import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { CookiesService } from './cookies.service';
import { AuthGuard } from '@nestjs/passport';
import { DetailCookiesParams, UpdateCookiesParams } from './cookies.dto';
@Controller('cookies')
export class CookiesController {
  constructor(private readonly cookiesService: CookiesService) {}

  @Get('/list')
  async getUserCookies(@Req() auth) {
    const { user } = auth;
    const userId = user.userId;
    const userCookies = await this.cookiesService.getUserCookies(userId);
    if (!userCookies) {
      return {
        code: 500,
        message: '参数错误-请检查参数是否一致',
      };
    }
    return {
      code: 200,
      result: userCookies,
    };
  }

  // @UseGuards(AuthGuard('jwt'))
  @Post('/detail')
  async getCookiesDetail(@Body() req: DetailCookiesParams, @Req() auth) {
    const { website_id, userId } = req;
    // const { user } = auth;
    // const userId = user.userId;
    const userCookies = await this.cookiesService.getCookiesDetail(
      website_id,
      userId,
    );
    if (!userCookies) {
      return {
        code: 500,
        message: '参数错误-请检查参数是否一致',
      };
    }
    return {
      code: 200,
      result: userCookies,
    };
  }

  // @UseGuards(AuthGuard('jwt'))
  @Post('/update')
  async updateTask(@Body() req: UpdateCookiesParams, @Req() auth) {
    // const { user } = auth;
    // const userId = user.userId;
    const userId = req.userId;
    const whetherCorrect = await this.cookiesService.hasCookies(
      req.website_id,
      userId,
    );
    if (!whetherCorrect) {
      return {
        code: 500,
        message: '参数错误-请检查参数是否一致',
      };
    }
    const timeString = Date.now();
    const params: any = {
      ...req,
      site_cookie_id: whetherCorrect.site_cookie_id,
    };
    params.updateTime = timeString;
    await this.cookiesService.updateCookies(params);
    return {
      code: 200,
      result: { ...params, userId },
      message: '更新成功',
    };
  }
}
