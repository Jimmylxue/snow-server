import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  AddClubActivityDto,
  ClubActivityListDto,
  FeedBackDto,
  SignInDto,
  SignUpActivityDto,
} from '../../dto/clubActivity.dto';
import { ClubActivity } from '../../entities/clubActivity.entity';
import { ClubActivityMember } from '../../entities/clubActivityMember.entity';
import { ClubFeedBack } from '../../entities/feedback.entity';
import { ClubSignInRecord } from '../../entities/signInRecord.entity';

@Injectable()
export class ClubActivityService {
  constructor(
    @InjectRepository(ClubActivity)
    private readonly clubActivityRepository: Repository<ClubActivity>,
    @InjectRepository(ClubActivityMember)
    private readonly clubActivityMemberRepository: Repository<ClubActivityMember>,
    @InjectRepository(ClubFeedBack)
    private readonly clubFeedBackRepository: Repository<ClubFeedBack>,
    @InjectRepository(ClubSignInRecord)
    private readonly clubSignInRecordRepository: Repository<ClubSignInRecord>,
  ) {}

  async getUserClubActivity(body: ClubActivityListDto, userId: number) {
    return await this.clubActivityRepository.find({
      // select: ['recordId', 'letter', 'status', 'createdTime'],
      // relations: {
      //   letter: true,
      // },
      where: {
        ...body,
        user: userId,
      },
      order: {
        clubActivityId: 'DESC',
      },
    });
  }

  async signUpClubActivity(params: SignUpActivityDto, userId: number) {
    const hasMember = await this.clubActivityMemberRepository.findOneBy({
      clubActivityId: params.clubActivityId,
      userId,
    });
    if (hasMember) {
      return {
        code: 500,
        message: '该同学已经参与这个活动了',
      };
    }
    const member = this.clubActivityMemberRepository.create();
    member.userId = userId;
    member.user = userId;
    member.clubActivityId = params.clubActivityId;
    member.clubActivity = params.clubActivityId;
    await this.clubActivityMemberRepository.save(member);
    return {
      code: 200,
      result: '报名成功',
    };
  }

  async addClubActivity(params: AddClubActivityDto, userId: number) {
    const clubActivity = this.clubActivityRepository.create();
    clubActivity.user = userId;
    clubActivity.clubId = params.clubId;
    clubActivity.signStartTime = params.signStartTime;
    clubActivity.signEndTime = params.signEndTime;
    clubActivity.name = params.name;
    clubActivity.desc = params.desc;
    return await this.clubActivityRepository.save(clubActivity);
  }

  async feedback(params: FeedBackDto, userId: number) {
    const clubActivity = this.clubFeedBackRepository.create();
    clubActivity.user = userId;
    clubActivity.userId = userId;
    clubActivity.clubActivity = params.clubActivityId;
    clubActivity.clubActivityId = params.clubActivityId;
    clubActivity.club = params.clubId;
    clubActivity.clubId = params.clubId;
    clubActivity.content = params.content;
    return await this.clubFeedBackRepository.save(clubActivity);
  }

  async signIn(params: SignInDto, userId: number) {
    const now = Date.now() / 1000;
    const activity = await this.clubActivityRepository.findOneBy({
      clubActivityId: params.clubActivityId,
    });
    if (!(now >= activity.signStartTime && now <= activity.signEndTime)) {
      return {
        code: 500,
        result: '暂不在签到时间',
      };
    }
    const hasSignIn = await this.clubSignInRecordRepository.findOneBy({
      activityId: params.clubActivityId,
      userId,
    });
    if (hasSignIn) {
      return {
        code: 500,
        result: '请勿重复签到',
      };
    }
    const clubActivity = await this.clubSignInRecordRepository.create();
    clubActivity.user = userId;
    clubActivity.userId = userId;
    clubActivity.activity = params.clubActivityId;
    clubActivity.activityId = params.clubActivityId;
    clubActivity.club = params.clubId;
    clubActivity.clubId = params.clubId;
    await this.clubSignInRecordRepository.save(clubActivity);
    return {
      code: 200,
      result: '签到成功',
    };
  }

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
