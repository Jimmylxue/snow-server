import { HttpService } from '@nestjs/axios';
import {
  Controller,
  Get,
  Headers,
  Post,
  RawBodyRequest,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { generateNonceStr } from '@src/modules/wx/core/util';
import { generateOutTradeNo, generatePaySign } from '@src/utils/payment';
import { AuthGuard } from '@nestjs/passport';
import { UserService } from '@src/modules/admin/system/user/services/user.service';
import { OrderService } from '@src/modules/admin/system/order/order.service';
import { WeChatPaymentService } from './wechat.service';

const PAY_PRICE = 0.01;
const total = Math.round(PAY_PRICE * 100); // 转为分（1 分）

@Controller('wechatpay')
export class WeChatPaymentController {
  constructor(
    private httpService: HttpService,
    private readonly configService: ConfigService,
    private readonly userService: UserService,
    private readonly orderService: OrderService,
    private readonly wechatPaymentService: WeChatPaymentService,
  ) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('pay')
  async prePayment(@Req() req) {
    const user = req.user;
    const userId = user.id;
    const appid = this.configService.get('WX_SERVER_OFFICIAL_APPID');
    const mchid = this.configService.get('WX_MERCHANT_ID');
    const notify_url = this.configService.get('WX_PAY_SUCCESS_NOTIFY_URL');
    const out_trade_no = generateOutTradeNo();
    //这里的params就是小程序传递的相关参数
    const openid = await this.userService.getUserOpenId(userId);
    if (!openid) {
      return {
        code: 401,
        result: '请先注册~',
      };
    }
    const options = {
      appid,
      mchid,
      description: '入群支付',
      out_trade_no,
      notify_url,
      amount: {
        total, // 转化后的数据
      },
      payer: {
        openid,
      },
    };

    const url = 'https://api.mch.weixin.qq.com/v3/pay/transactions/jsapi';
    const method = 'POST';
    const body = JSON.stringify(options);

    const authorization = this.wechatPaymentService.getPayAuthorization(
      method,
      url,
      body,
    );

    // 使用axios 发起请求
    const res = await this.httpService.axiosRef.post(
      'https://api.mch.weixin.qq.com/v3/pay/transactions/jsapi',
      options,
      {
        headers: {
          Authorization: authorization,
          'Content-Type': 'application/json',
          Accept: 'application/json',
          'User-Agent': 'NestJS WeChatPay Client',
        },
      },
    );
    const timeStamp = Math.floor(Date.now() / 1000);
    const nonceStr = generateNonceStr();

    console.log('res', res);
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

  @Post('notify')
  async notify_url(
    @Headers('wechatpay-signature') signature: string,
    @Headers('wechatpay-timestamp') timestamp: string,
    @Headers('wechatpay-nonce') nonce: string,
    @Headers('wechatpay-serial') serial: string,
    @Req() req: RawBodyRequest<Request>,
    @Res() res,
  ) {
    console.log('signature', signature);
    console.log('timestamp', timestamp);
    console.log('nonce', nonce);
    console.log('serial', serial);
    res.status(401).send('签名验证失败');
    return;
    try {
      const verified = this.wechatPaymentService.verifySignature(
        timestamp,
        nonce,
        req.rawBody.toString('utf8'),
        signature,
        serial,
      );
      if (!verified) {
        res.status(401).send('签名验证失败');
        return;
      }

      const result = JSON.parse(req.body.toString());
      const decryptedData = this.wechatPaymentService.decryptWechatPayData(
        result.resource.ciphertext,
        result.resource.associated_data,
        result.resource.nonce,
      );

      // 3. 处理业务逻辑
      console.log('解密后的通知数据:', decryptedData);

      const transaction_id = decryptedData.transaction_id;
      const out_trade_no = decryptedData.out_trade_no;
      const openid = decryptedData.payer.openid;
      const total_fee = decryptedData.amount.total;

      const user = await this.userService.getUserByOpenId(openid);
      if (!user) {
        res.status(401).json({ code: 'FAIL', message: '用户不存在' });
        return;
      }

      await this.orderService.createOrder(user.id, {
        outTradeNo: out_trade_no,
        transactionId: transaction_id,
        totalFee: total_fee,
      });

      res.status(200).json({ code: 'SUCCESS', message: '成功' });
    } catch (error) {
      console.error('处理微信支付通知出错:', error);
      res.status(500).json({ code: 'FAIL', message: '处理失败' });
    }
  }

  @Get('notify')
  async notify_url_old(@Req() req) {
    try {
      const { xml } = req.body;
      const data: any = {};
      for (const item in xml) {
        data[item] = xml[item][0];
      }

      if (data.result_code === 'SUCCESS' && data.return_code === 'SUCCESS') {
        const user = await this.userService.getUserByOpenId(data.openid);
        const outTradeNo = data.out_trade_no; // 商户订单号
        const transactionId = data.transaction_id; // 微信支付订单号
        const totalFee = data.total_fee; // 支付金额(分)
        await this.orderService.createOrder(user.id, {
          outTradeNo,
          transactionId,
          totalFee,
        });
        return `<xml>
        <return_code><![CDATA[SUCCESS]]></return_code>
        <return_msg><![CDATA[OK]]></return_msg>
      </xml>`;
      }
      return `<xml>
        <return_code><![CDATA[FAIL]]></return_code>
        <return_msg><![CDATA[处理失败]]></return_msg>
      </xml>`;
    } catch (error) {
      return `<xml>
        <return_code><![CDATA[FAIL]]></return_code>
        <return_msg><![CDATA[处理失败2]]></return_msg>
      </xml>`;
    }
  }
}
