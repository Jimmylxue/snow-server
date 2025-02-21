import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class DoubaoService {
  constructor(private readonly configService: ConfigService) {}

  private readonly region = 'cn-north-1';
  private readonly service = 'cv';
  private readonly schema = 'https';
  private readonly host = 'visual.volcengineapi.com';
  private readonly path = '/';
  private readonly ak = this.configService.get('VOLC_ACCESS_KEY_ID'); // 替换为你的AK
  private readonly sk = this.configService.get('VOLC_SECRET_ACCESS_KEY'); // 替换为你的SK

  private signStringEncoder(source: string): string {
    return encodeURIComponent(source).replace(/[!'()*]/g, function (c) {
      return '%' + c.charCodeAt(0).toString(16).toUpperCase();
    });
  }

  private async hashSHA256(content: Buffer | string): Promise<string> {
    const hash = crypto.createHash('sha256');
    hash.update(content);
    return hash.digest('hex');
  }

  private async hmacSHA256(
    key: Buffer | string,
    content: string,
  ): Promise<Buffer> {
    const hmac = crypto.createHmac('sha256', key);
    hmac.update(content);
    return hmac.digest();
  }

  private async genSigningSecretKeyV4(
    secretKey: string,
    date: string,
    region: string,
    service: string,
  ): Promise<Buffer> {
    const kDate = await this.hmacSHA256(secretKey, date);
    const kRegion = await this.hmacSHA256(kDate, region);
    const kService = await this.hmacSHA256(kRegion, service);
    return await this.hmacSHA256(kService, 'request');
  }

  async processImage(imageUrls: string[], prompt: string, returnUrl: boolean) {
    const method = 'POST';
    const action = 'CVProcess';
    const version = '2022-08-31';
    const date = new Date();

    const body = JSON.stringify({
      req_key: 'img2img_anime_accelerated_maintain_id_for_smart_drawing_anime',
      image_urls: imageUrls,
      positive_prompt: prompt,
      return_url: returnUrl,
    });

    const xContentSha256 = await this.hashSHA256(body);
    const xDate = date.toISOString().replace(/[-:]|\.\d{3}/g, '');
    const shortXDate = xDate.substring(0, 8);
    const contentType = 'application/json';
    const signHeader = 'host;x-date;x-content-sha256;content-type';

    const queryParams = new Map([
      ['Action', action],
      ['Version', version],
    ]);

    const queryString = Array.from(queryParams.entries())
      .map(
        ([key, value]) =>
          `${this.signStringEncoder(key)}=${this.signStringEncoder(value)}`,
      )
      .join('&');

    const canonicalString = [
      method,
      this.path,
      queryString,
      `host:${this.host}`,
      `x-date:${xDate}`,
      `x-content-sha256:${xContentSha256}`,
      `content-type:${contentType}`,
      '',
      signHeader,
      xContentSha256,
    ].join('\n');

    const hashCanonicalString = await this.hashSHA256(canonicalString);
    const credentialScope = `${shortXDate}/${this.region}/${this.service}/request`;
    const stringToSign = [
      'HMAC-SHA256',
      xDate,
      credentialScope,
      hashCanonicalString,
    ].join('\n');

    const signKey = await this.genSigningSecretKeyV4(
      this.sk,
      shortXDate,
      this.region,
      this.service,
    );

    const signature = (await this.hmacSHA256(signKey, stringToSign)).toString(
      'hex',
    );

    const url = `${this.schema}://${this.host}${this.path}?${queryString}`;

    try {
      const response = await axios({
        method,
        url,
        data: body,
        headers: {
          Host: this.host,
          'X-Date': xDate,
          'X-Content-Sha256': xContentSha256,
          'Content-Type': contentType,
          Authorization: `HMAC-SHA256 Credential=${this.ak}/${credentialScope}, SignedHeaders=${signHeader}, Signature=${signature}`,
        },
      });
      console.log('response', response.data);
      return response.data;
    } catch (error: any) {
      throw new Error(
        `Request failed: ${error.message} - ${error?.response?.data?.message}`,
      );
    }
  }
}
