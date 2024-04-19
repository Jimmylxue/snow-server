import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClubService } from './club.service';
import { ClubController } from './club.controller';
import { Club } from '../../entities/club.entity';
import { ClubMember } from '../../entities/clubMember.entity';
import { ClubActivity } from '../../entities/clubActivity.entity';
import { LetterService } from '@src/modules/admin/system/siteLetter/letter/letter.service';
import { SendLetterService } from '@src/modules/admin/system/siteLetter/sendLetter/sendLetter.service';
import { Letter } from '@src/modules/admin/system/siteLetter/entities/letter.entity';
import { SendRecord } from '@src/modules/admin/system/siteLetter/entities/sendRecord.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Club,
      ClubMember,
      ClubActivity,
      Letter,
      SendRecord,
    ]),
  ],
  providers: [ClubService, LetterService, SendLetterService],
  controllers: [ClubController],
})
export class ClubModule {}
