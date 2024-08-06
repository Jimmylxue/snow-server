import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Address } from '../../entities/address.entity';
import {
  AddAddressDto,
  AddressListDto,
  DelAddressDto,
  EditAddressDto,
} from '../../dto/address.dto';

@Injectable()
export class AddressService {
  constructor(
    @InjectRepository(Address)
    private readonly addressRepository: Repository<Address>,
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

  async addAddress(params: AddAddressDto) {
    const type = this.addressRepository.create();
    type.province = params.province;
    type.city = params.city;
    type.area = params.area;
    type.detail = params.detail;
    type.username = params.username;
    type.phone = params.phone;
    return await this.addressRepository.save(type);
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
}
