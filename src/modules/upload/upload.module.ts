import { Module } from '@nestjs/common';
import { UploadController } from './upload.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  providers: [ConfigService],
  controllers: [UploadController],
})
export class UploadModule {}
