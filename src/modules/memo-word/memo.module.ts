import { Module } from '@nestjs/common';
import { WordModule } from './word/word.module';

@Module({
  imports: [WordModule],
  providers: [],
  controllers: [],
})
export class SnowMemoModule {}
