import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { UserService } from '../services/user.service';
import { BcryptService } from '../../auth/auth.service';
import { JwtStrategy } from '../../auth/jwtStrategy.service';
// import { AuthService } from '../auth/auth.service';
import { UserController } from '../controllers/user/user.controller';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from '../../auth/constats';
import { TaskTypeService } from '@src/modules/todolist/modules/taskType/taskType.service';
import { TaskType } from '@src/modules/todolist/entities/taskType.entity';
import { HttpModule } from '@nestjs/axios';
import { UserGeoController } from '../controllers/user/userGeo.controller';
import { UserGeoService } from '../services/userGeo.service';
import { UserGeoRecord } from '../entities/geoRecord.entity';
import { LocationService } from '../../resource/services/gaodeMap/location.service';
import { ChildrenRecord } from '../entities/childrenRecord.entity';
import { ChildrenRecordService } from '../services/childrenRecord.service';
import { ChildrenRecordController } from '../controllers/user/childrenRecord.controller';
import { ManagerSettingService } from '../services/managerSetting.service';
import { ManagerSettingController } from '../controllers/user/managerSetting.controller';
import { ManagerSetting } from '../entities/managerSetting.entity';

@Module({
  imports: [
    HttpModule,
    TypeOrmModule.forFeature([
      User,
      TaskType,
      UserGeoRecord,
      ChildrenRecord,
      ManagerSetting,
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
    TaskTypeService,
    BcryptService,
    UserGeoService,
    LocationService,
    ChildrenRecordService,
    ManagerSettingService,
  ],
  controllers: [
    UserController,
    UserGeoController,
    ChildrenRecordController,
    ManagerSettingController,
  ],
  // exports: [TypeOrmModule],
})
export class UsersModule {}
