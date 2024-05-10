import { Module } from '@nestjs/common';
import { GptController } from './gpt.controller';

@Module({
  imports: [],
  controllers: [GptController],
})
export class GptModule {}
