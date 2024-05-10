import { Module } from '@nestjs/common';
import { BaseController } from './base.controller';
import { GithubService } from '@src/modules/admin/system/resource/controllers/github/github.service';
import { HttpModule } from '@nestjs/axios';
import { BaseService } from './base.service';

@Module({
  imports: [HttpModule],
  providers: [BaseService, GithubService],
  controllers: [BaseController],
})
export class BaseModule {}
