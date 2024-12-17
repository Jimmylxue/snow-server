import { Module } from '@nestjs/common';
import { RichTextModule } from './richText/richText.module';

@Module({
  imports: [RichTextModule],
  providers: [],
  controllers: [],
})
export class SettingModule {}
