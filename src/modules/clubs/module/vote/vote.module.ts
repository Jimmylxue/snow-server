import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VoteService } from './vote.service';
import { VoteController } from './vote.controller';
import { ClubPostComment } from '../../entities/postComment.entity';
import { ClubPostLove } from '../../entities/clubPostLove.entity';
import { ClubPosts } from '../../entities/posts.entity';
import { ClubVote } from '../../entities/clubVote.entity';
import { clubVoteRecord } from '../../entities/clubVoteRecord.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ClubVote, clubVoteRecord])],
  providers: [VoteService],
  controllers: [VoteController],
})
export class VoteModule {}
