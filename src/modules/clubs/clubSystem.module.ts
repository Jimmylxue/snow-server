import { Module } from '@nestjs/common';
import { ClubModule } from './module/club/club.module';
import { ClubActivityModule } from './module/activity/activity.module';
import { PostsModule } from './module/posts/posts.module';
import { VoteModule } from './module/vote/vote.module';

@Module({
  imports: [ClubModule, ClubActivityModule, PostsModule, VoteModule],
  providers: [],
  controllers: [],
})
export class ClubSystemModule {}
