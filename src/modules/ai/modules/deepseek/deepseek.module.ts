import { Module } from '@nestjs/common';
import { DeepSeekController } from './deepseek.controller';

@Module({
  imports: [],
  controllers: [DeepSeekController],
})
export class DeepSeekModule {}
