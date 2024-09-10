import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Address } from '../../entities/address.entity';
import {
  AddAddressDto,
  AddressListDto,
  DelAddressDto,
  EditAddressDto,
  EditConfigDto,
} from '../../dto/address.dto';
// @ts-ignore
import { SystemConfig } from '../../entities/systemConfig.entity';
import * as XLSX from 'xlsx';

@Injectable()
export class AddressService {
  constructor(
    @InjectRepository(Address)
    private readonly addressRepository: Repository<Address>,
    @InjectRepository(SystemConfig)
    private readonly systemConfigRepository: Repository<SystemConfig>,
  ) {}

  async getAllList(body: AddressListDto) {
    const { page, pageSize, ...where } = body;
    const [result, total] = await this.addressRepository.findAndCount({
      where: {
        ...where,
      },
      order: {
        addressId: 'DESC',
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });
    return {
      page: page,
      result,
      total,
    };
  }

  async getConfigList() {
    const [result, total] = await this.systemConfigRepository.findAndCount({
      where: {
        configId: 1,
      },
      order: {
        configId: 'DESC',
      },
    });
    return {
      result,
      total,
    };
  }

  async addAddress(params: AddAddressDto) {
    const type = this.addressRepository.create();
    type.province = params.province;
    type.city = params.city;
    type.area = params.area;
    type.detail = params.detail;
    type.username = params.username;
    type.phone = params.phone;
    type.memberCode = params.memberCode;
    type.shop = params.shop;
    type.productType = params.productType;
    return await this.addressRepository.save(type);
  }

  async addConfig(params: EditConfigDto) {
    const type = this.systemConfigRepository.create();
    type.lineCode = params.lineCode;
    type.inviteCode = params.inviteCode;
    return await this.systemConfigRepository.save(type);
  }

  async delAddress(params: DelAddressDto) {
    return await this.addressRepository.delete({ addressId: params.addressId });
  }

  async editAddress(updateParams: EditAddressDto) {
    const { addressId, ...params } = updateParams;
    const qb = this.addressRepository.createQueryBuilder('address');
    qb.update(Address)
      .set(params)
      .where('address.addressId = :addressId', { addressId })
      .execute();
    return { status: 1, message: '更新成功' };
  }

  async editSystemConfig(updateParams: EditConfigDto) {
    const { ...params } = updateParams;
    const qb = this.systemConfigRepository.createQueryBuilder('systemConfig');
    qb.update(SystemConfig)
      // @ts-ignore
      .set(params)
      .where('systemConfig.configId = :configId', { configId: 1 })
      .execute();
    return { status: 1, message: '更新成功' };
  }

  /**
   * 导出表格
   */
  async exportUsersToExcel() {
    const address = await this.addressRepository.find();

    const worksheet = XLSX.utils.json_to_sheet(address);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Address');

    const excelBuffer = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'buffer',
    });
    return excelBuffer;
  }
}
