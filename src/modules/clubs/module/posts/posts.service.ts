import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AddClubDto, ClubListDto, SignUpDto } from '../../dto/club.dto';
import { Club } from '../../entities/club.entity';
import { ClubMember } from '../../entities/clubMember.entity';
import { ClubPosts } from '../../entities/posts.entity';
import {
  CommentPostsDto,
  LovePostsDto,
  PostsListDto,
  SendPostsDto,
} from '../../dto/posts.dto';
import { ClubPostLove } from '../../entities/clubPostLove.entity';
import { ClubPostComment } from '../../entities/postComment.entity';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(ClubPosts)
    private readonly postsRepository: Repository<ClubPosts>,
    @InjectRepository(ClubPostLove)
    private readonly clubPostLoveRepository: Repository<ClubPostLove>,
    @InjectRepository(ClubPostComment)
    private readonly clubPostCommentRepository: Repository<ClubPostComment>,
  ) {}

  async getPostsList(body: PostsListDto, userId: number) {
    return await this.postsRepository.find({
      // select: ['recordId', 'letter', 'status', 'createdTime'],
      // relations: {
      //   letter: true,
      // },
      where: {
        ...body,
        // user: userId,
      },
      order: {
        id: 'DESC',
      },
    });
  }

  async posts(body: SendPostsDto, userId: number) {
    const posts = this.postsRepository.create();
    posts.userId = userId;
    posts.user = userId;
    posts.clubId = body.clubId;
    posts.club = body.clubId;
    posts.title = body.title;
    posts.content = body.content;
    return await this.postsRepository.save(posts);
  }

  async comment(body: CommentPostsDto, userId: number) {
    const comment = this.clubPostCommentRepository.create();
    comment.userId = userId;
    comment.user = userId;
    comment.clubId = body.clubId;
    comment.club = body.clubId;
    comment.clubPostsId = body.postsId;
    comment.clubPosts = body.postsId;
    comment.content = body.content;
    return await this.clubPostCommentRepository.save(comment);
  }

  async love(body: LovePostsDto, userId: number) {
    const hasLove = await this.clubPostLoveRepository.findOneBy({
      clubId: body.clubId,
      clubPostsId: body.postsId,
      userId,
    });
    if (hasLove) {
      return {
        code: 500,
        result: '您已点赞，请勿重复点赞',
      };
    }
    const comment = this.clubPostLoveRepository.create();
    comment.userId = userId;
    comment.user = userId;
    comment.clubId = body.clubId;
    comment.club = body.clubId;
    comment.clubPostsId = body.postsId;
    comment.clubPosts = body.postsId;
    await this.clubPostLoveRepository.save(comment);
    return {
      code: 200,
      result: '操作成功',
    };
  }

  // async getUserClub(body: ClubListDto, userId: number) {
  //   return await this.clubRepository.find({
  //     // select: ['recordId', 'letter', 'status', 'createdTime'],
  //     // relations: {
  //     //   letter: true,
  //     // },
  //     where: {
  //       ...body,
  //       user: userId,
  //     },
  //     order: {
  //       clubId: 'DESC',
  //     },
  //   });
  // }

  // async signUpClub(params: SignUpDto, userId: number) {
  //   const hasMember = await this.clubMemberRepository.findOneBy({
  //     clubMemberId: userId,
  //     clubId: params.clubId,
  //   });
  //   if (hasMember) {
  //     return {
  //       code: 500,
  //       message: '该同学已经是这个社团的成员了',
  //     };
  //   }
  //   const member = this.clubMemberRepository.create();
  //   member.clubMember = userId;
  //   member.clubMemberId = userId;
  //   member.club = params.clubId;
  //   member.clubId = params.clubId;
  //   await this.clubMemberRepository.save(member);
  //   return {
  //     code: 200,
  //     result: '报名成功',
  //   };
  // }

  // async addClub(params: AddClubDto, userId: number) {
  //   const club = this.clubRepository.create();
  //   club.user = userId;
  //   club.name = params.name;
  //   club.desc = params.desc;
  //   return await this.clubRepository.save(club);
  // }

  // async updateLetter(body: UpdateHabitDto | UpdateHabitStatusDto) {
  //   const { habitId, ...params } = body;
  //   const qb = this.habitRepository.createQueryBuilder('habit');
  //   return await qb
  //     .update(Habit)
  //     .set(params)
  //     .where('habit.habitId = :habitId', { habitId })
  //     .execute();
  // }

  // async delLetter(body: DelHabitDto) {
  //   return await this.habitRepository.delete({ habitId: body.habitId });
  // }
}
