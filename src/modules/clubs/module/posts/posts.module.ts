import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { ClubPostComment } from '../../entities/postComment.entity';
import { ClubPostLove } from '../../entities/clubPostLove.entity';
import { ClubPosts } from '../../entities/posts.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ClubPosts, ClubPostLove, ClubPostComment]),
  ],
  providers: [PostsService],
  controllers: [PostsController],
})
export class PostsModule {}
