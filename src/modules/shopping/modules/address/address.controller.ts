import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  Response,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AddressService } from './address.service';
import {
  AddAddressDto,
  AddressListDto,
  DelAddressDto,
  EditAddressDto,
  EditConfigDto,
  FBDto,
} from '../../dto/address.dto';
import { Response as Res } from 'express';

@Controller('address')
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  /**
   * 添加商品
   */
  @Post('/add')
  async signIn(@Body() body: AddAddressDto, @Request() req: any) {
    const { fbc, fbp } = body;
    await this.addressService.addAddress(body);
    if (body.productType === 2) {
      this.addressService.testSendPurchase(req, fbc, fbp);
    } else {
      this.addressService.testSendAddPayMethod(req, fbc, fbp);
    }
    return {
      code: 200,
      result: '操作成功',
    };
  }

  /**
   * 添加商品
   */
  @Post('/addConfig')
  async addConfig(@Body() body: EditConfigDto) {
    await this.addressService.addConfig(body);
    return {
      code: 200,
      result: '操作成功',
    };
  }

  @Post('/editConfig')
  async editConfig(@Body() body: EditConfigDto) {
    const letter = await this.addressService.editSystemConfig(body);
    if (letter) {
      return {
        code: 200,
        result: '操作成功',
      };
    }
  }

  /**
   * 查看商品列表
   */
  @Post('/list')
  async getSignList(@Body() body: AddressListDto) {
    const list = await this.addressService.getAllList(body);
    if (list) {
      return {
        code: 200,
        result: list,
      };
    }
  }

  /**
   * 查看商品列表
   */
  @Post('/configList')
  async getConfigList() {
    const list = await this.addressService.getConfigList();
    if (list) {
      return {
        code: 200,
        result: list,
      };
    }
  }

  /**
   * 管理员-添加题目类型
   */
  @UseGuards(AuthGuard('jwt'))
  @Post('/edit')
  async editProduct(@Body() body: EditAddressDto) {
    const letter = await this.addressService.editAddress(body);
    if (letter) {
      return {
        code: 200,
        result: '操作成功',
      };
    }
  }

  /**
   * 管理员-添加题目类型
   */
  @UseGuards(AuthGuard('jwt'))
  @Post('/del')
  async delProduct(@Body() body: DelAddressDto) {
    const res = await this.addressService.delAddress(body);
    if (res.affected === 0) {
      return {
        code: 500,
        result: '检查删除内容是否存在',
      };
    }
    return {
      code: 200,
      result: '删除成功',
    };
  }

  @Get('export')
  async exportUsers(@Response() res: Res) {
    const excelBuffer = await this.addressService.exportUsersToExcel();
    res.set({
      'Content-Type':
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': 'attachment; filename=Address.xlsx',
    });
    res.send(excelBuffer);
  }

  @Get('country')
  getCountry(@Request() req): string {
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    return this.addressService.getCountryByIp(ip);
  }

  /**
   * 购物
   */
  @Post('purchase')
  async purchase(@Request() req, @Body() body: FBDto) {
    await this.addressService.testSendPurchase(req, body.fbc, body.fbp);
    return {
      code: 200,
      result: '上报成功',
    };
  }

  /**
   * addCart
   */
  @Post('addPayMethod')
  async addCart(@Request() req, @Body() body: FBDto) {
    await this.addressService.testSendAddPayMethod(req, body.fbc, body.fbp);
    return {
      code: 200,
      result: '上报成功',
    };
  }

  /**
   * addPayMessage
   */
  @Post('addPayMessage')
  async addPayMessage(@Request() req, @Body() body: FBDto) {
    await this.addressService.testSendAddPayMethod(req, body.fbc, body.fbp);
    return {
      code: 200,
      result: '上报成功',
    };
  }

  /**
   * chat
   */
  @Post('chat')
  async chat(@Request() req, @Body() body: FBDto) {
    await this.addressService.testChat(req, body.fbc, body.fbp);
    return {
      code: 200,
      result: '上报成功',
    };
  }

  /**
   * chat
   */
  @Post('addToCart')
  async AddToCart(@Request() req, @Body() body: FBDto) {
    await this.addressService.testAddToCart(req, body.fbc, body.fbp);
    return {
      code: 200,
      result: '上报成功',
    };
  }
}
