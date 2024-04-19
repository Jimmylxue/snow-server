import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClubVote } from '../../entities/clubVote.entity';
import { clubVoteRecord } from '../../entities/clubVoteRecord.entity';
import { ChoiceVoteDto, LaunchVoteDto, VoteListDto } from '../../dto/vote.dto';

@Injectable()
export class VoteService {
  constructor(
    @InjectRepository(ClubVote)
    private readonly clubVoteRepository: Repository<ClubVote>,
    @InjectRepository(clubVoteRecord)
    private readonly clubVoteRecordRepository: Repository<clubVoteRecord>,
  ) {}

  async getVoteList(body: VoteListDto, userId: number) {
    // const records = await this.clubVoteRepository.find({
    //   relations: {
    //     recordItems: true,
    //   },
    //   where: {
    //     ...body,
    //   },
    //   order: {
    //     id: 'DESC',
    //   },
    // });
    const records = await this.clubVoteRepository
      .createQueryBuilder('clubVote')
      // .leftJoinAndSelect('clubVote.recordItems', 'recordItem',"recordItem.voteId > :value", { value: 10 }) 这个等于动态查 留个笔记吧
      .leftJoinAndSelect(
        'clubVote.recordItems',
        'recordItem',
        'recordItem.voteId = clubVote.id',
      )
      .leftJoinAndSelect('recordItem.user', 'user') // 两层关联
      .where({
        ...body,
      })
      .orderBy('clubVote.id', 'DESC')
      .getMany();
    const newRecords = records.map((item) => {
      return {
        ...item,
        voteStatus: this.getVoteStatus(item),
        myVote:
          item.recordItems?.find((it) => it.userId === userId)?.choose || -1,
      };
    });
    return newRecords;
  }

  async launch(body: LaunchVoteDto, userId: number) {
    const voteItem = this.clubVoteRepository.create();
    voteItem.userId = userId;
    voteItem.user = userId;
    voteItem.clubId = body.clubId;
    voteItem.club = body.clubId;
    voteItem.name = body.name;
    voteItem.desc = body.desc;
    voteItem.voteStartTime = body.voteStartTime;
    voteItem.voteEndTime = body.voteEndTime;
    return await this.clubVoteRepository.save(voteItem);
  }

  async choice(body: ChoiceVoteDto, userId: number) {
    // todo 判断用户是否在这个部门下 -> 先不加了
    const hasChoose = await this.clubVoteRecordRepository.findOneBy({
      userId,
      voteId: body.voteId,
    });
    if (hasChoose) {
      return {
        code: 500,
        result: '您已投票，请勿重复投票',
      };
    }
    const voteRecord = this.clubVoteRecordRepository.create();
    voteRecord.userId = userId;
    voteRecord.user = userId;
    voteRecord.clubId = body.clubId;
    voteRecord.club = body.clubId;
    voteRecord.voteId = body.voteId;
    voteRecord.vote = body.voteId;
    voteRecord.choose = body.choose;
    await this.clubVoteRecordRepository.save(voteRecord);
    return {
      code: 200,
      result: '投票成功',
    };
  }

  getVoteStatus(item: ClubVote) {
    const now = Date.now() / 1000;
    if (now < item.voteStartTime) {
      return 1;
    }
    if (now >= item.voteStartTime && now < item.voteEndTime) {
      return 2;
    }
    return 3;
  }
}
