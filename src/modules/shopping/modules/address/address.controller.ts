import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AddressService } from './address.service';
import {
  AddAddressDto,
  AddressListDto,
  DelAddressDto,
  EditAddressDto,
  EditConfigDto,
} from '../../dto/address.dto';

@Controller('address')
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  /**
   * 添加商品
   */
  @Post('/add')
  async signIn(@Body() body: AddAddressDto) {
    await this.addressService.addAddress(body);
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
}
