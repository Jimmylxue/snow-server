import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { UsersModule } from './user/modules/user.module';
import { MailModule } from './mail/mail.module';
import { SiteLetterModule } from './siteLetter/siteLetter.module';
import { CoinModule } from './coinRecord/coinRecord.modules';
@Module({
  imports: [HttpModule, UsersModule, MailModule, SiteLetterModule, CoinModule],
  controllers: [],
  providers: [],
})
export class SystemModule {}
