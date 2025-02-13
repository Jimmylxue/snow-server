import { Module } from '@nestjs/common';
import { DoubaoModule } from './modules/doubao/doubao.module';
import { DeepSeekModule } from './modules/deepseek/deepseek.module';

@Module({
  imports: [DoubaoModule, DeepSeekModule],
  controllers: [],
})
export class AiModule {}
