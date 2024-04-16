import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { VoteService } from './vote.service';
import { ChoiceVoteDto, LaunchVoteDto } from '../../dto/vote.dto';

@Controller('vote')
export class VoteController {
  constructor(private readonly voteService: VoteService) {}

  /**
   * 发起投票
   */
  @UseGuards(AuthGuard('jwt'))
  @Post('/launch')
  async getList(@Body() body: LaunchVoteDto, @Req() auth) {
    const { user } = auth;
    const userId = user.userId;
    await this.voteService.launch(body, userId);
    return {
      code: 200,
      result: '发布成功',
    };
  }

  /**
   * 投票
   */
  @UseGuards(AuthGuard('jwt'))
  @Post('/choice')
  async choice(@Body() body: ChoiceVoteDto, @Req() auth) {
    const { user } = auth;
    const userId = user.userId;
    return await this.voteService.choice(body, userId);
  }
}
