import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminModule } from './modules/admin/admin.module';
import { APP_FILTER } from '@nestjs/core';
import { HttpExceptionFilter } from './exception/http-exception.filter';
import { WxModule } from './modules/wx/wx.module';
import { ScheduleModule } from '@nestjs/schedule';
import { TasksModule } from './schedule/task.module';
import { EventsModule } from './modules/socket/event.module';
import { GptModule } from './modules/gpt/gpt.module';
import { TodoListModule } from './modules/todolist/todolist.module';
import { UploadModule } from './modules/upload/upload.module';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './modules/admin/system/auth/constats';
import { BcryptService } from './modules/admin/system/auth/auth.service';
import { JwtStrategy } from './modules/admin/system/auth/jwtStrategy.service';
import { CatchErrorController } from './modules/admin/system/catchError/catchError.controller';
import { LoggerService } from './modules/shared/service/Logger.service';
import { SnowMemoModule } from './modules/memo-word/memo.module';
import { CheckInModule } from './modules/checkIn/checkIn.module';
import { TrainModule } from './modules/12306/train.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { resolve } from 'path';
import { ClubSystemModule } from './modules/clubs/clubSystem.module';
import { ExamSystemModule } from './modules/exam/examSystem.module';
import { StaticModule } from './modules/static/static.module';
import { CourseSystemModule } from './modules/course/CourseSystem.module';
import { ShoppingSystemModule } from './modules/shopping/shoppingSystem.module';
import { User } from './modules/admin/system/user/entities/user.entity';
import { AiModule } from './modules/ai/ai.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [resolve(process.cwd(), '.env')],
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
    TodoListModule,
    CheckInModule,
    // MiniProgramModule,
    GptModule,
    AiModule,
    ScheduleModule.forRoot(),
    TasksModule,
    EventsModule,
    UploadModule,
    SnowMemoModule,
    TrainModule,
    ClubSystemModule,
    ExamSystemModule,
    StaticModule,
    CourseSystemModule,
    ShoppingSystemModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: {
        expiresIn: '30d',
      },
    }),
    TypeOrmModule.forFeature([User]),
  ],
  controllers: [CatchErrorController],
  providers: [
    // {
    //   provide: APP_INTERCEPTOR,
    //   useClass: LoggingInterceptor,
    // },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    BcryptService,
    JwtStrategy,
    LoggerService,
  ],
})
export class AppModule {}
