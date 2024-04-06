import { Module } from '@nestjs/common';
import { LetterModule } from './letter/letter.module';
import { SendLetterModule } from './sendLetter/sendLetter.module';

@Module({
  imports: [LetterModule, SendLetterModule],
  providers: [],
  controllers: [],
})
export class SiteLetterModule {}
