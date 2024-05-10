import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetCommitDto } from '@src/modules/admin/system/resource/controllers/github/github.dto';
import { GithubService } from '@src/modules/admin/system/resource/controllers/github/github.service';
import { SystemException } from '@src/exception';
import { BaseService } from './base.service';

@Controller('base')
export class BaseController {
  constructor(
    private readonly baseService: BaseService,
    private readonly githubService: GithubService,
  ) {}

  // @UseGuards(AuthGuard('jwt'))
  @Post('/UpdateRecord')
  async getTodoListUpdateRecord(@Body() req: GetCommitDto) {
    const data = await this.githubService.getCommit(req);
    if (data.code === 200) {
      return {
        code: 200,
        result: data.commitList,
      };
    }
    throw new SystemException(
      'THIRD_PART_SERVICE_ERROR_CODE',
      200,
      data.message,
    );
  }
}
