import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';
@Injectable()
export class WeChatPaymentService {
  constructor(private readonly configService: ConfigService) {}

  verifySignature(
    timestamp: string,
    nonce: string,
    body: string,
    signature: string,
    serial: string, // 这个是序列号-> 如果有多个商户号 用于获取指定的 public_key的 这里先写死了
  ) {
    // 构造验签名串
    const message = `${timestamp}\n${nonce}\n${body}\n`;

    // 实际应用中，你应该预先下载并缓存微信支付平台证书
    const publicKey = this.getWechatPayPublicKey();

    // 验证签名
    const verifier = crypto.createVerify('RSA-SHA256');
    verifier.update(message);
    return verifier.verify(publicKey, signature, 'base64');
  }

  /**
   * 解密微信支付通知数据
   */
  decryptWechatPayData(
    ciphertext: string,
    associatedData: string,
    nonce: string,
  ): any {
    const key = this.configService.get('WX_MERCHANT_SECRET');
    const ciphertextBuffer = Buffer.from(ciphertext, 'base64');

    // 使用AES-256-GCM解密
    const decipher = crypto.createDecipheriv(
      'aes-256-gcm',
      Buffer.from(key, 'utf8'),
      Buffer.from(nonce, 'utf8'),
    );

    decipher.setAuthTag(ciphertextBuffer.slice(ciphertextBuffer.length - 16));
    decipher.setAAD(Buffer.from(associatedData, 'utf8'));

    const decrypted = Buffer.concat([
      decipher.update(ciphertextBuffer.slice(0, ciphertextBuffer.length - 16)),
      decipher.final(),
    ]);

    return JSON.parse(decrypted.toString('utf8'));
  }

  getWechatPayPublicKey() {
    return `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEArZxu7oErdowRqDOBoM+K
uUTKTJ8tRHu8e8nbi4Pd4FMjI6uNyOrBrclIot4Dnfom92GIbCk4LsA0kKPC3u8S
jADtmDS/+IAc/mgOpfod3ULp1RMjPAcWEjmDfDqkSP4KjfiNLRViQp8v/2Ro77Ya
ElLT8QY74opDMAn78gD+UewoC4c/Lex1RmCwvatojpip6ARcvvKfOX1H7Sjr+rAf
52/b1oXMmEEW/BTBJXsAHbUbtjWaS0HnqkoUcnT7IEXBvrMBOf4rBuVU6hf28/5m
3MQl9fVA5EMq6gwsPHEp9ma/90q0vhE9H2t8P8PLr5+UVccqW7A6nwcNawpOKMP/
9QIDAQAB
-----END PUBLIC KEY-----`;
  }
}
