import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AddClubDto, ClubListDto, SignUpDto } from '../../dto/club.dto';
import { Club } from '../../entities/club.entity';
import { ClubMember } from '../../entities/clubMember.entity';

@Injectable()
export class ClubService {
  constructor(
    @InjectRepository(Club)
    private readonly clubRepository: Repository<Club>,
    @InjectRepository(ClubMember)
    private readonly clubMemberRepository: Repository<ClubMember>,
  ) {}

  async getUserClub(body: ClubListDto, userId: number) {
    return await this.clubRepository.find({
      // select: ['recordId', 'letter', 'status', 'createdTime'],
      // relations: {
      //   letter: true,
      // },
      where: {
        ...body,
        user: userId,
      },
      order: {
        clubId: 'DESC',
      },
    });
  }

  async signUpClub(params: SignUpDto, userId: number) {
    const hasMember = await this.clubMemberRepository.findOneBy({
      clubMemberId: userId,
      clubId: params.clubId,
    });
    if (hasMember) {
      return {
        code: 500,
        message: '该同学已经是这个社团的成员了',
      };
    }
    const member = this.clubMemberRepository.create();
    member.clubMember = userId;
    member.clubMemberId = userId;
    member.club = params.clubId;
    member.clubId = params.clubId;
    await this.clubMemberRepository.save(member);
    return {
      code: 200,
      result: '报名成功',
    };
  }

  async addClub(params: AddClubDto, userId: number) {
    const club = this.clubRepository.create();
    club.user = userId;
    club.name = params.name;
    club.desc = params.desc;
    return await this.clubRepository.save(club);
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
