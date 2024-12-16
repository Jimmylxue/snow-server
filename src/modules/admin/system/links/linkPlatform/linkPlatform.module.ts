import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LinkPlatform } from '../entities/linkPlatform.entity';
import { LinkPlatformController } from './linkPlatform.controller';
import { LinkPlatformService } from './linkPlatform.service';

@Module({
  imports: [TypeOrmModule.forFeature([LinkPlatform])],
  providers: [LinkPlatformService],
  controllers: [LinkPlatformController],
})
export class LinkPlatformModule {}
