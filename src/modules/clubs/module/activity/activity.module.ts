import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Club } from '../../entities/club.entity';
import { ClubActivity } from '../../entities/clubActivity.entity';
import { ClubActivityService } from './activity.service';
import { ClubActivityController } from './activity.controller';
import { ClubMember } from '../../entities/clubMember.entity';
import { ClubActivityMember } from '../../entities/clubActivityMember.entity';
import { ClubFeedBack } from '../../entities/feedback.entity';
import { ClubSignInRecord } from '../../entities/signInRecord.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Club,
      ClubActivity,
      ClubMember,
      ClubActivityMember,
      ClubFeedBack,
      ClubSignInRecord,
    ]),
  ],
  providers: [ClubActivityService],
  controllers: [ClubActivityController],
})
export class ClubActivityModule {}
