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
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    HttpModule,
    TypeOrmModule.forFeature([User]),
    // user模块需要派发 token 所以这里必须得引用 jwt Module
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: {
        expiresIn: '30d',
      },
    }),
  ],
  providers: [UserService, BcryptService, JwtStrategy, BcryptService],
  controllers: [UserController],
  exports: [UserService],
})
export class UsersModule {}
