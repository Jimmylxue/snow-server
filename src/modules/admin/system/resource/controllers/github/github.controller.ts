import { Body, Controller, Get } from '@nestjs/common';
import { SystemException } from '@src/exception';
import { GithubService } from './github.service';
import { GetCommitDto } from './github.dto';
@Controller('github')
export class GithubController {
  constructor(private readonly githubService: GithubService) {}

  @Get('/commit')
  async getCommitInfo(@Body() req: GetCommitDto) {
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
