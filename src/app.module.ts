import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminModule } from './modules/admin/admin.module';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { HttpExceptionFilter } from './exception/http-exception.filter';
import { WxModule } from './modules/wx/wx.module';
import { ScheduleModule } from '@nestjs/schedule';
import { TasksModule } from './schedule/task.module';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './modules/admin/system/auth/constats';
import { BcryptService } from './modules/admin/system/auth/auth.service';
import { JwtStrategy } from './modules/admin/system/auth/jwtStrategy.service';
import { LoggerService } from './modules/shared/service/Logger.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { resolve } from 'path';
import { User } from './modules/admin/system/user/entities/user.entity';
import { AdminInterceptor } from './interceptors/admin.interceptor';
import { PaymentModule } from './modules/payment/payment.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [
        resolve(process.cwd(), `.env.${process.env.NODE_ENV}`),
        resolve(process.cwd(), '.env'),
      ],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory(config: ConfigService) {
        return {
          type: 'mysql',
          host: config.get('MYSQL_HOST'),
          port: config.get('MYSQL_PORT'),
          username: config.get('MYSQL_USERNAME'),
          password: config.get('MYSQL_PASSWORD'),
          database: config.get('MYSQL_DATABASE'),
          entities: [__dirname + '/**/*.entity{.ts,.js}'],
          // logging: true, // 将日志级别设置为 true
          synchronize: true,
        };
      },
    }),
    AdminModule,
    WxModule,
    ScheduleModule.forRoot(),
    TasksModule,
    PaymentModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: {
        expiresIn: '30d',
      },
    }),
    TypeOrmModule.forFeature([User]),
  ],
  controllers: [],
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: AdminInterceptor,
    },
    BcryptService,
    JwtStrategy,
    LoggerService,
  ],
})
export class AppModule {}
