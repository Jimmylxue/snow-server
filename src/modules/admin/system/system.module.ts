import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { UsersModule } from './user/modules/user.module';

@Module({
  imports: [HttpModule, UsersModule],
  controllers: [],
  providers: [],
})
export class SystemModule {}
