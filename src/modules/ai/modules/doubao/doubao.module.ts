import { Module } from '@nestjs/common';
import { DoubaoController } from './doubao.controller';
import { DoubaoService } from './doubao.service';

@Module({
  imports: [],
  providers: [DoubaoService],
  controllers: [DoubaoController],
  exports: [DoubaoService],
})
export class DoubaoModule {}
