import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { PostsService } from './posts.service';
import {
  CommentPostsDto,
  LovePostsDto,
  PostsCommentListDto,
  PostsListDto,
  PostsLoveUserListDto,
  SendPostsDto,
} from '../../dto/posts.dto';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  /**
   * 帖子列表
   */
  @UseGuards(AuthGuard('jwt'))
  @Post('/list')
  async getPostsList(@Body() body: PostsListDto, @Req() auth) {
    const { user } = auth;
    const userId = user.userId;
    const record = await this.postsService.getPostsList(body, userId);
    return {
      code: 200,
      result: record,
    };
  }

  /**
   * 发帖
   */
  @UseGuards(AuthGuard('jwt'))
  @Post('/send')
  async getList(@Body() body: SendPostsDto, @Req() auth) {
    const { user } = auth;
    const userId = user.userId;
    await this.postsService.posts(body, userId);
    return {
      code: 200,
      result: '发布成功',
    };
  }

  /**
   * 点赞
   */
  @UseGuards(AuthGuard('jwt'))
  @Post('/like')
  async signUpClub(@Body() body: LovePostsDto, @Req() auth) {
    const { user } = auth;
    const userId = user.userId;
    return await this.postsService.love(body, userId);
  }

  /**
   * 喜欢某个帖子的人
   */
  @UseGuards(AuthGuard('jwt'))
  @Post('/likePostUser')
  async getLikePostUser(@Body() body: PostsLoveUserListDto, @Req() auth) {
    const { user } = auth;
    const userId = user.userId;
    const record = await this.postsService.getLikePostUser(body, userId);
    return {
      code: 200,
      result: record,
    };
  }

  /**
   * 帖子评论列表
   */
  @UseGuards(AuthGuard('jwt'))
  @Post('/postCommentList')
  async getPostsCommentList(@Body() body: PostsCommentListDto, @Req() auth) {
    const { user } = auth;
    const userId = user.userId;
    const record = await this.postsService.getPostsCommentList(body, userId);
    return {
      code: 200,
      result: record,
    };
  }

  /**
   * 评论帖子
   */
  @UseGuards(AuthGuard('jwt'))
  @Post('/comment')
  async updateLetter(@Body() body: CommentPostsDto, @Req() auth) {
    const { user } = auth;
    const userId = user.userId;
    const letter = await this.postsService.comment(body, userId);
    if (letter) {
      return {
        code: 200,
        result: '创建成功',
      };
    }
  }

  // @UseGuards(AuthGuard('jwt'))
  // @Post('/updateStatus')
  // async updateStatus(@Body() body: UpdateHabitStatusDto) {
  //   const letter = await this.habitService.updateLetter(body);
  //   if (letter) {
  //     return {
  //       code: 200,
  //       result: '更新成功',
  //     };
  //   }
  // }

  // @UseGuards(AuthGuard('jwt'))
  // @Post('/del')
  // async delLetter(@Body() body: DelHabitDto) {
  //   const res = await this.habitService.delLetter(body);
  //   if (res.affected === 0) {
  //     return {
  //       code: 500,
  //       result: '检查删除内容是否存在',
  //     };
  //   }
  //   return {
  //     code: 200,
  //     result: '删除成功',
  //   };
  // }
}
