import { HttpService } from '@nestjs/axios';
import { Body, Controller, Get, Post } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { generateNonceStr } from '@src/modules/wx/core/util';
import { generateOutTradeNo, generatePaySign } from '@src/utils/payment';

const PAY_PRICE = 0.01;

@Controller('wechatpay')
export class WeChatPaymentController {
  constructor(
    private httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  @Get('pay')
  async prePayment(params: any) {
    await generatePaySign({
      appId: 'wx2421b1c4370ec43b',
      timeStamp: '1554208460',
      nonceStr: '593BEC0C930BF1AFEB40B4A08C8FB242',
      prepay_id: 'wx201410272009395522657a690389285100',
    });
    const appid = this.configService.get('WX_SERVER_OFFICIAL_APPID');
    const mchid = this.configService.get('WX_MERCHANT_ID');
    const notify_url = this.configService.get('WX_PAY_SUCCESS_NOTIFY_URL');
    const out_trade_no = generateOutTradeNo();
    //这里的params就是小程序传递的相关参数
    const { openid } = params;
    const options = {
      appid,
      mchid,
      description: '入群支付',
      out_trade_no,
      notify_url,
      amount: {
        total: PAY_PRICE, // 转化后的数据
      },
      payer: {
        openid,
      },
    };
    // 使用axios 发起请求
    const res = await this.httpService.axiosRef.post(
      'https://api.mch.weixin.qq.com/v3/pay/transactions/jsapi',
      options,
    );
    const timeStamp = Math.floor(Date.now() / 1000);
    const nonceStr = generateNonceStr();

    const paySign = await generatePaySign({
      appId: appid,
      timeStamp: String(timeStamp),
      nonceStr,
      prepay_id: res.data.prepay_id,
    });

    return {
      code: 200,
      result: {
        appId: appid,
        timeStamp,
        nonceStr,
        package: `prepay_id=${res.data.prepay_id}`,
        signType: 'RSA',
        paySign,
      },
    };
  }

  @Post()
  async notify_url(@Body() body: any) {
    // 这个body中是更私密的支付信息,我们通过解密之后才能拿到
    const v3 = '........'; // 解密密钥
    const { resource } = body;
    const { ciphertext, associated_data, nonce } = resource;

    // TODO: 需要根据返回的不同支付状态调整订单的支付状态

    // 到这里支付就算是完成了
  }
}
