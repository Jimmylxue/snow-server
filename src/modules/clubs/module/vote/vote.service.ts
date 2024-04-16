import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClubVote } from '../../entities/clubVote.entity';
import { clubVoteRecord } from '../../entities/clubVoteRecord.entity';
import { ChoiceVoteDto, LaunchVoteDto } from '../../dto/vote.dto';

@Injectable()
export class VoteService {
  constructor(
    @InjectRepository(ClubVote)
    private readonly clubVoteRepository: Repository<ClubVote>,
    @InjectRepository(clubVoteRecord)
    private readonly clubVoteRecordRepository: Repository<clubVoteRecord>,
  ) {}

  async launch(body: LaunchVoteDto, userId: number) {
    const voteItem = this.clubVoteRepository.create();
    voteItem.userId = userId;
    voteItem.user = userId;
    voteItem.clubId = body.clubId;
    voteItem.club = body.clubId;
    voteItem.name = body.name;
    voteItem.desc = body.desc;
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
}
