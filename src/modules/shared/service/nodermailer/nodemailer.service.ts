import { Injectable } from '@nestjs/common';
import { TSendMealParams, TSendVerificationParams } from './type';
import { getBaseTemplate, getVerificationTemplate } from './template';
import { ConfigService } from '@nestjs/config';
const nodemailer = require('nodemailer');

@Injectable()
export class NodeMailerService {
  constructor(private readonly configService: ConfigService) {}

  /**
   * 发送测试邮箱
   * @param params
   * @returns
   */
  async sendMail(params: TSendMealParams) {
    const { to, subject, attachments } = params;
    return new Promise((resolve) => {
      const host = this.configService.get('QQ_MAIL_HOST');
      const port = this.configService.get('QQ_MAIL_PORT');
      const secure = Boolean(Number(this.configService.get('QQ_MAIL_SECURE')));
      const user = this.configService.get('QQ_MAIL_USER');
      const password = this.configService.get('QQ_MAIL_PASSWORD');
      if (!user || !password || !to) {
        return;
      }
      const html = getBaseTemplate(params);
      nodemailer
        .createTransport({
          host, // 设置服务
          port, // 端口
          secure, // 是否使用TLS，true，端口为465，否则其他或者568
          auth: {
            // 用户名和密码/授权码
            user,
            pass: password,
          },
        })
        .sendMail(
          {
            from: `test <${user}>`, // 发送邮箱
            to: to, //接收邮箱
            subject: subject, //标题
            html, //内容
            attachments, //附件
          },
          (err, info) => {
            if (err) {
              console.error(`对${to}邮件发送失败！`, err);
              resolve(false);
              return;
            }
            console.log(`对${to}邮件发送成功！`, info);
            resolve(true);
          },
        );
    });
  }

  /**
   * 发送验证码
   *  会将码保存至redis
   */
  async sendVerificationCode(params: TSendVerificationParams) {
    const { to } = params;
    return new Promise((resolve) => {
      const host = this.configService.get('QQ_MAIL_HOST');
      const port = this.configService.get('QQ_MAIL_PORT');
      const secure = Boolean(Number(this.configService.get('QQ_MAIL_SECURE')));
      const user = this.configService.get('QQ_MAIL_USER');
      const password = this.configService.get('QQ_MAIL_PASSWORD');
      if (!user || !password || !to) {
        return;
      }
      const html = getVerificationTemplate(params);
      nodemailer
        .createTransport({
          host, // 设置服务
          port, // 端口
          secure, // 是否使用TLS，true，端口为465，否则其他或者568
          auth: {
            // 用户名和密码/授权码
            user,
            pass: password,
          },
        })
        .sendMail(
          {
            from: `吉米前端 <${user}>`, // 发送邮箱
            to: to, //接收邮箱
            subject: '您的一次性验证码', //标题
            html, //内容
          },
          (err, info) => {
            if (err) {
              console.error(`对${to}邮件发送失败！`, err);
              resolve(false);
              return;
            }
            console.log(`对${to}邮件发送成功！`, info);
            resolve(true);
          },
        );
    });
  }
}
