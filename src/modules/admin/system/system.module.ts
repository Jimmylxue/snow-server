import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { WeatherController } from './resource/controllers/weather/weather.controller';
import { WeatherService } from './resource/services/weather/weather.service';
import { TranslateController } from './resource/controllers/baiduFanYi/baiduFanYi.controller';
import { TranslateService } from './resource/services/baiduFanYi/baiduFanYi.service';
import { ActivityController } from './signIn/controller/activity/activity.controller';
import { ActivityService } from './signIn/services/activity/activity.service';
import { UsersModule } from './user/modules/user.module';
import { LocationController } from './resource/controllers/gaodeMap/location.controller';
import { LocationService } from './resource/services/gaodeMap/location.service';
import { ResourceModule } from './resource/modules/resource.modules';
import { GithubController } from './resource/controllers/github/github.controller';
import { GithubService } from './resource/controllers/github/github.service';
import { SiteCookiesModule } from './siteCookies/siteCookies.modules';
import { MailModule } from './mail/mail.module';
import { SiteLetterModule } from './siteLetter/siteLetter.module';
import { CoinModule } from './coinRecord/coinRecord.modules';
@Module({
  imports: [
    ResourceModule,
    SiteCookiesModule,
    HttpModule,
    UsersModule,
    MailModule,
    SiteLetterModule,
    CoinModule,
  ],
  controllers: [
    WeatherController,
    TranslateController,
    ActivityController,
    LocationController,
    GithubController,
  ],
  providers: [
    WeatherService,
    TranslateService,
    ActivityService,
    LocationService,
    GithubService,
  ],
})
export class SystemModule {}
