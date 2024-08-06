import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserGeoRecord } from '../entities/geoRecord.entity';
import { AddGeoRecordDto, GeoRecordListDto } from '../dto/geo.dto';

@Injectable()
export class UserGeoService {
  constructor(
    @InjectRepository(UserGeoRecord)
    private readonly userGeoRepository: Repository<UserGeoRecord>,
  ) {}

  async addGeoRecord(params: AddGeoRecordDto, userId: number) {
    // @ts-ignore
    const { data } = await this.locationService.getLocationByGeo(params);
    if (+data.infocode === 10000) {
      const res = data.regeocode;
      const _address = {
        country: res?.addressComponent?.country,
        province: res?.addressComponent?.province,
        city: res?.addressComponent?.city,
        district: res?.addressComponent?.district,
        township: res?.addressComponent?.township,
        formatted_address: res?.formatted_address,
      };
      console.log('res', res);
      const record = this.userGeoRepository.create();
      record.latitude = params.latitude;
      record.longitude = params.longitude;
      record.country = _address.country;
      record.province = _address.province;
      record.city = _address.city;
      record.district = _address.district;
      record.township = _address.township;
      record.formatted_address = _address.formatted_address;
      record.userId = userId;
      record.user = userId;
      await this.userGeoRepository.save(record);
    }
  }

  async getAllList(body: GeoRecordListDto) {
    return await this.userGeoRepository.find({
      where: {
        ...body,
      },
      order: {
        id: 'DESC',
      },
      take: 10,
    });
  }
}
