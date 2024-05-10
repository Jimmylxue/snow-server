import { Module } from '@nestjs/common';
import { MailController } from './mail.controller';
import { NodeMailerService } from '@src/modules/shared/service/nodermailer/nodemailer.service';

@Module({
  imports: [],
  providers: [NodeMailerService],
  controllers: [MailController],
})
export class MailModule {}
