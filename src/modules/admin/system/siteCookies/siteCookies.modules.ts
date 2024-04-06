import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoggerService } from '@src/modules/shared/service/Logger.service';
import { Site } from './site/site.entity';
import { Cookies } from './cookies/cookies.entity';
import { SiteService } from './site/site.service';
import { CookiesService } from './cookies/cookies.service';
import { SiteController } from './site/site.controller';
import { CookiesController } from './cookies/cookies.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Site, Cookies])],
  providers: [SiteService, CookiesService, LoggerService],
  controllers: [SiteController, CookiesController],
})
export class SiteCookiesModule {}
