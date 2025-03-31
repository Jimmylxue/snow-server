import { Module } from '@nestjs/common';
import { PostsModule } from './module/posts/posts.module';

@Module({
  imports: [PostsModule],
  providers: [],
  controllers: [],
})
export class ClubSystemModule {}
