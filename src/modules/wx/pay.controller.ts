import { Controller, Get, Post, Body, Query, Res } from '@nestjs/common';
import { SystemException } from '@src/exception';
import { textMessage } from './core/messageTemplate';
import { NodeMailerService } from '../shared/service/nodermailer/nodemailer.service';
import { generateNonceStr } from './core/util';
import { WxConnectService } from './connect/connect.service';
import { WxConfigParams } from './wx.dto';
import { ConfigService } from '@nestjs/config';
import { SseService } from '../sse/sse.service';
const sha1 = require('sha1'); // 加密

type TUrlLinkQuery = {
  signature: string;
  nonce: string;
  timestamp: string;
  echostr: string;
};

@Controller('pay')
export class WxController {
  constructor(
    private readonly nodemailerService: NodeMailerService,
    private readonly wxConnectService: WxConnectService,
    private readonly configService: ConfigService,
    private readonly sseService: SseService,
  ) {}

  // JS安全域名配置
  @Get('/')
  async today(@Query() req: TUrlLinkQuery) {
    const token = this.configService.get('WX_OFFICIAL_TOKEN');
    const { signature, nonce, timestamp, echostr } = req;

    const str = [token, timestamp, nonce].sort().join('');
    const sha = sha1(str);
    if (sha === signature) {
      return echostr;
    } else {
      throw new SystemException('THIRD_PART_SERVICE_ERROR_CODE', 200, {
        error_code: 10000,
        error_msg: 'JS安全域名配置错误',
      });
    }
  }

  @Post('/')
  async getInfo(@Body() body, @Res() res) {
    const xml = body.xml;
    let message = {
      FromUserName: xml.FromUserName,
      ToUserName: xml.ToUserName,
      reply: '你好呀，我是通过代码回复你的',
    };
    res.status(200).send(textMessage(message));
  }

  @Post('/config/data')
  async getJssdkConfig(@Body() body: WxConfigParams) {
    const timestamp = Math.floor(Date.now() / 1000);
    const noncestr = generateNonceStr();
    const ticket = await this.wxConnectService.getApkTicket();
    const str = `jsapi_ticket=${ticket}&noncestr=${noncestr}&timestamp=${timestamp}+&url=${body.url}`;
    const signature = sha1(str);
    return {
      timestamp,
      noncestr,
      signature,
    };
  }

  /**
   * 测试 发送邮件
   * @returns
   */
  @Get('/send')
  async sendMail() {
    const res = await this.nodemailerService.sendMail({
      to: '1002661758@qq.com',
      subject: '测试的呀',
      content: '这个是测试的内容',
      attachments: [
        {
          filename: 'test.png',
          path: `${process.cwd()}/src/modules/shared/service/nodemailer/test.png`,
        },
      ],
    });
    return res ? '发送成功' : '发送失败';
  }
}
