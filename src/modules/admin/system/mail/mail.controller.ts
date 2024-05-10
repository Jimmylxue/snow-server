import { Body, Controller, Get, Post } from '@nestjs/common';
import { SendMailDto } from './mail.dto';
import { NodeMailerService } from '@src/modules/shared/service/nodermailer/nodemailer.service';
import { RedisInstance } from '@src/instance';
import { generateRandomCode, isQQMail } from '@src/utils';

@Controller('mail')
export class MailController {
  constructor(private readonly nodemailerService: NodeMailerService) {}

  @Post('send_verification_code')
  async send(@Body() body: SendMailDto) {
    const { mail } = body;
    if (!isQQMail(mail)) {
      return { code: 500, result: '邮箱格式不正确 - 不是qq邮箱' };
    }
    const redis = await RedisInstance.initRedis();
    const code = generateRandomCode();
    const key = `snow-server-mail-verification-code-${mail}`;
    redis.set(key, code);
    redis.expire(key, 600); // 单位是秒
    await this.nodemailerService.sendVerificationCode({ to: mail, code });
    return { code: 200, result: '发送成功' };
  }

  @Get('test')
  async getCode(code: string) {
    const redis = await RedisInstance.initRedis();
    const mail = code;
    const key = `snow-server-mail-verification-code-${mail}`;
    return redis.get(key);
  }
}
