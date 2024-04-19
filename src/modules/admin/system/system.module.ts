import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { SiteLetterModule } from './siteLetter/siteLetter.module';
import { UsersModule } from './user/modules/user.module';
@Module({
  imports: [HttpModule, UsersModule, SiteLetterModule],
  controllers: [],
  providers: [],
})
export class SystemModule {}
