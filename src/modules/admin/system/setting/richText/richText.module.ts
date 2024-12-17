import { Module } from '@nestjs/common';
import { RichTextService } from './richText.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RichTextController } from './richText.controller';
import { RichText } from '../entities/richText.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RichText])],
  providers: [RichTextService],
  controllers: [RichTextController],
})
export class RichTextModule {}
