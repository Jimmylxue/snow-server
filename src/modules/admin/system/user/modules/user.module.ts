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
    ]),
    // user模块需要派发 token 所以这里必须得引用 jwt Module
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: {
        expiresIn: '30d',
      },
    }),
  ],
  providers: [
    UserService,
    BcryptService,
    JwtStrategy,
    BcryptService,
    SendLetterService,
    LetterService,
  ],
  controllers: [UserController],
  exports: [UserService],
})
export class UsersModule {}
