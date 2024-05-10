import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { MiniProgramController } from './miniProgram.controller';

@Module({
  imports: [HttpModule],
  controllers: [MiniProgramController],
})
export class MiniProgramModule {}
