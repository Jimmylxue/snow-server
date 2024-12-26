import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { UserService } from '../services/user.service';
import { BcryptService } from '../../auth/auth.service';
import { JwtStrategy } from '../../auth/jwtStrategy.service';
import { UserController } from '../controllers/user/user.controller';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from '../../auth/constats';
import { HttpModule } from '@nestjs/axios';
import { UserGeoRecord } from '../entities/geoRecord.entity';
import { ChildrenRecord } from '../entities/childrenRecord.entity';
import { ManagerSetting } from '../entities/managerSetting.entity';
import { SendLetterService } from '../../siteLetter/sendLetter/sendLetter.service';
import { SendRecord } from '../../siteLetter/entities/sendRecord.entity';
import { LetterService } from '../../siteLetter/letter/letter.service';
import { Letter } from '../../siteLetter/entities/letter.entity';
import { UserCleanupService } from '../services/userCleanup.service';
import { LoggerService } from '@src/modules/shared/service/Logger.service';
import { PhoneCoin } from '../../coinRecord/entities/phoneCoin.entity';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    HttpModule,
    TypeOrmModule.forFeature([
      User,
      UserGeoRecord,
      ChildrenRecord,
      ManagerSetting,
      SendRecord,
      Letter,
      PhoneCoin,
    ]),
    // ThrottlerModule.forRoot([
    //   {
    //     ttl: 60000,
    //     limit: 3,
    //   },
    // ]),
    // user模块需要派发 token 所以这里必须得引用 jwt Module
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: {
        expiresIn: '30d',
      },
    }),
  ],
  providers: [
    LoggerService,
    UserService,
    BcryptService,
    JwtStrategy,
    BcryptService,
    SendLetterService,
    LetterService,
    UserCleanupService,
    // {
    //   provide: APP_GUARD,
    //   useClass: ThrottlerGuard,
    // },
  ],
  controllers: [UserController],
  exports: [UserService],
})
export class UsersModule {}
