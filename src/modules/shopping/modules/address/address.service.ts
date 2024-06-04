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
    return await this.addressRepository.find({
      // select: ['recordId', 'letter', 'status', 'createdTime'],
      // relations: {
      //   letter: true,
      // },
      where: {
        ...body,
        // clubMemberId: userId,
      },
      order: {
        addressId: 'DESC',
      },
    });
  }

  async addAddress(params: AddAddressDto, userId: number) {
    const type = this.addressRepository.create();
    type.province = params.province;
    type.city = params.city;
    type.area = params.area;
    type.detail = params.detail;
    type.user = userId;
    type.username = params.username;
    type.phone = params.phone;
    type.userId = userId;
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
