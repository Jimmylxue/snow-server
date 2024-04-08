import {
  Controller,
  Get,
  Query,
  Ip,
  Post,
  Body,
  HttpCode,
  UseGuards,
} from '@nestjs/common';
import { SystemException } from '@src/exception';
import { IpAddress } from '@src/modules/shared/decorator';
import { LocationService } from '../../services/gaodeMap/location.service';
import { GeoDto } from './dto/location.dto';
import { AuthGuard } from '@nestjs/passport';
const searcher = require('node-ip2region').create();

@Controller('location')
export class LocationController {
  constructor(private readonly locationService: LocationService) {}

  @Get('/ipTransform')
  async getBaseInfo(@IpAddress() ip: string) {
    const realIp = ip.split('::ffff:')[1];
    const queryInfo = searcher.btreeSearchSync(realIp);
    if (queryInfo?.city && queryInfo?.region) {
      const location = queryInfo.region?.split('|');
      return {
        code: 200,
        result: {
          status: 1,
          info: 'OK BY STATIC',
          infocode: '10000',
          province: location[2],
          city: location[3],
          adcode: '',
          rectangle: '',
        },
        requestIp: ip,
      };
    }
    // 离线库查不到了再查有次数的在线库
    const { data } = await this.locationService.getLocationByIp(realIp);
    if (+data.infocode === 10000) {
      return {
        code: 200,
        result: data,
        requestIp: ip,
      };
    }
    throw new SystemException('THIRD_PART_SERVICE_ERROR_CODE', 200, '');
  }

  @Post('/getAddress')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(200)
  async getLocationInfo(@Body() body: GeoDto) {
    // 离线库查不到了再查有次数的在线库
    const { data } = await this.locationService.getLocationByGeo(body);
    if (+data.infocode === 10000) {
      return {
        code: 200,
        result: data.regeocode,
      };
    }
    throw new SystemException('THIRD_PART_SERVICE_ERROR_CODE', 200, '');
  }
}
