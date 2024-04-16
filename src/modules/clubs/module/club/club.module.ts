import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClubService } from './club.service';
import { ClubController } from './club.controller';
import { Club } from '../../entities/club.entity';
import { ClubMember } from '../../entities/clubMember.entity';
import { ClubActivity } from '../../entities/clubActivity.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Club, ClubMember, ClubActivity])],
  providers: [ClubService],
  controllers: [ClubController],
})
export class ClubModule {}
