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

import * as geoip from 'geoip-lite';

const bizSdk = require('facebook-nodejs-business-sdk');

const keyList = [
  {
    accessToken:
      'EAAHu7cyoQbcBO9RWYkuZB8tyxPOtg8bz6Dse5XZAZC9ukYzZCNUVhJREafRMZAghrQQR6a2Oyu1uxlc34vqZBDzFk2AJuSxGSEeKDkJKI58ia8kWu2RgZApnqu1trxQOELwiZB3XsSnhLoCs9rmgsmZBUJOY6A6DK8jwq0ZAgulhBv2uW6uUCjkDZBWZCIq9ckDEJPWAAQZDZD',
    accountId: '1263184435049650',
  },
  {
    accessToken:
      'EAAHYQgdoZByMBO3ZAoaRDU6ttqPY6UCgNj3DVvmNNMWgNSuG0eb48c2UYHrLX0EAuMQ2tP5K1MoyTcOntgbPAldYyfGdk2k0EHyrmyBXkOqkpym3ixSwSKRlBO9BjyiIdJfXqdKzPfr1EdGStEDkOgimmwzZBmdzFf4rdR3A2BCNSxdMZClkEE7COtj4y44jLQZDZD',
    accountId: '806815144919568',
  },
  {
    accessToken:
      'EAAYMgPZAEAZC0BO99ZB7ZCAO6LJTmFyhu8YZBmEUhFF2PTLhpym6Jjc6naRiAIckRmfROCc6LYHlPgS9OUFIfTexcuEZBrlNOULoQW0nohnz7z0YNqTAZBP7Q6g6EdImOZBfbSTH1Rs5OJmQUlZCo7xGRMcCclR1ECV8epaWQUIraFY23U3RkGwYk6P6UPHSSEf40eAZDZD',
    accountId: '3875401789445477',
  },
  {
    accessToken:
      'EAB6sgAq0EoABO3HylJ4kQ4xphITc8dBb5tuvNeL8YXfUNVF2TtBuT6i6ZBU3dXV4fr54iyYhqyMfSmI6ZAWcPhxM5l08bpwu9tzxcBupBfZCZAYxdflfDgr7pItJ9ZBjAlO0QZAlqVtPjy9lWRnHNnqmrcZCrfwtNcEbWU8M8uHmj2ZBKjistyG1YlZAR3bdHCobdsAZDZD',
    accountId: '857944092337320',
  },
];

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
    type.sku = params.sku;
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

  getCountryByIp(ip: string) {
    const geo = geoip.lookup(ip);
    console.log('geo', geo, ip);
    return geo ? geo.country : 'Unknown';
  }

  testSendPurchase(request: any, fbc: string, fbp: string) {
    keyList.forEach(({ accessToken, accountId }) => {
      this.sendPurchase(request, accessToken, accountId, fbc, fbp);
    });
  }

  testSendAddPayMethod(request: any, fbc: string, fbp: string) {
    keyList.forEach(({ accessToken, accountId }) => {
      this.addPayMethod(request, accessToken, accountId, fbc, fbp);
    });
  }

  testChat(request: any, fbc: string, fbp: string) {
    keyList.forEach(({ accessToken, accountId }) => {
      this.sendChat(request, accessToken, accountId, fbc, fbp);
    });
  }

  testAddToCart(request: any, fbc: string, fbp: string) {
    keyList.forEach(({ accessToken, accountId }) => {
      this.sendChat(request, accessToken, accountId, fbc, fbp);
    });
  }

  /**
   * 下单
   */
  sendPurchase(
    request: any,
    accessToken: string,
    accountId: string,
    fbc: string,
    fbp: string,
  ) {
    const originUrl = request.headers.referer;
    const Content = bizSdk.Content;
    const CustomData = bizSdk.CustomData;
    const DeliveryCategory = bizSdk.DeliveryCategory;
    const EventRequest = bizSdk.EventRequest;
    const UserData = bizSdk.UserData;
    const ServerEvent = bizSdk.ServerEvent;

    bizSdk.FacebookAdsApi.init(accessToken);

    // @ts-ignore
    let current_timestamp = Math.floor(new Date() / 1000);

    const userData = new UserData()
      .setEmails(['1778888999@qq.com'])
      .setPhones(['13344445555', '16677778888'])
      // It is recommended to send Client IP and User Agent for Conversions API Events.
      .setClientIpAddress(request.connection.remoteAddress)
      .setClientUserAgent(request.headers['user-agent'])
      .setFbp(fbp)
      .setFbc(fbc);

    const content = new Content()
      .setId('product123')
      .setQuantity(1)
      .setDeliveryCategory(DeliveryCategory.HOME_DELIVERY);

    const customData = new CustomData()
      .setContents([content])
      .setCurrency('usd')
      .setValue(0.1);

    const serverEvent = new ServerEvent()
      .setEventName('Purchase')
      .setEventTime(current_timestamp)
      .setUserData(userData)
      .setCustomData(customData)
      .setEventSourceUrl(originUrl)
      .setActionSource('website');

    const eventsData = [serverEvent];
    const eventRequest = new EventRequest(accessToken, accountId).setEvents(
      eventsData,
    );

    eventRequest._test_event_code = 'TEST39766';

    eventRequest.execute().then(
      (response) => {
        console.log('Response: ', {
          ...response,
          accessToken,
          accountId,
          type: 'Purchase',
          fbc,
          fbp,
        });
      },
      (err) => {
        console.error('Error: ', {
          ...err,
          accessToken,
          accountId,
          type: 'Purchase',
          fbc,
          fbp,
        });
      },
    );

    return { code: 200, result: '成功' };
  }

  addPayMethod(
    request: any,
    accessToken: string,
    accountId: string,
    fbc: string,
    fbp: string,
  ) {
    const originUrl = request.headers.referer;

    console.log('fullUrl', request.headers.referer);

    const Content = bizSdk.Content;
    const CustomData = bizSdk.CustomData;
    const DeliveryCategory = bizSdk.DeliveryCategory;
    const EventRequest = bizSdk.EventRequest;
    const UserData = bizSdk.UserData;
    const ServerEvent = bizSdk.ServerEvent;

    bizSdk.FacebookAdsApi.init(accessToken);

    // @ts-ignore
    let current_timestamp = Math.floor(new Date() / 1000);

    const userData = new UserData()
      .setEmails(['1778888999@qq.com'])
      .setPhones(['13344445555', '16677778888'])
      // It is recommended to send Client IP and User Agent for Conversions API Events.
      .setClientIpAddress(request.connection.remoteAddress)
      .setClientUserAgent(request.headers['user-agent'])
      .setFbp(fbp)
      .setFbc(fbc);

    const content = new Content();

    const customData = new CustomData();

    const serverEvent = new ServerEvent()
      .setEventName('AddPaymentInfo')
      .setEventTime(current_timestamp)
      .setUserData(userData)
      .setCustomData(customData)
      .setEventSourceUrl(originUrl)
      .setActionSource('website');

    const eventsData = [serverEvent];
    const eventRequest = new EventRequest(accessToken, accountId).setEvents(
      eventsData,
    );

    eventRequest._test_event_code = 'TEST39766';

    eventRequest.execute().then(
      (response) => {
        console.log('Response: ', {
          ...response,
          accessToken,
          accountId,
          type: 'AddPaymentInfo',
          fbc,
          fbp,
        });
      },
      (err) => {
        console.error('Error: ', {
          ...err,
          accessToken,
          accountId,
          type: 'AddPaymentInfo',
        });
      },
    );

    return { code: 200, result: '成功' };
  }

  /**
   * 聊天
   */
  sendChat(
    request: any,
    accessToken: string,
    accountId: string,
    fbc: string,
    fbp: string,
  ) {
    /**
     *前端请求时的网址
     */
    const originUrl = request.headers.referer;
    const Content = bizSdk.Content;
    const CustomData = bizSdk.CustomData;
    const DeliveryCategory = bizSdk.DeliveryCategory;
    const EventRequest = bizSdk.EventRequest;
    const UserData = bizSdk.UserData;
    const ServerEvent = bizSdk.ServerEvent;

    bizSdk.FacebookAdsApi.init(accessToken);

    // @ts-ignore
    let current_timestamp = Math.floor(new Date() / 1000);

    const userData = new UserData()
      .setEmails(['1778888999@qq.com'])
      .setPhones(['13344445555', '16677778888'])
      // It is recommended to send Client IP and User Agent for Conversions API Events.
      .setClientIpAddress(request.connection.remoteAddress)
      .setClientUserAgent(request.headers['user-agent'])
      .setFbp(fbp)
      .setFbc(fbc);

    const content = new Content();

    const customData = new CustomData();

    const serverEvent = new ServerEvent()
      .setEventName('Contact')
      .setEventTime(current_timestamp)
      .setUserData(userData)
      .setCustomData(customData)
      .setEventSourceUrl(originUrl)
      .setActionSource('website');

    const eventsData = [serverEvent];
    const eventRequest = new EventRequest(accessToken, accountId).setEvents(
      eventsData,
    );

    eventRequest._test_event_code = 'TEST39766';

    eventRequest.execute().then(
      (response) => {
        console.log('Response: ', {
          ...response,
          accessToken,
          accountId,
          type: 'Contact',
          fbc,
          fbp,
        });
      },
      (err) => {
        console.error('Error: ', {
          ...err,
          accessToken,
          accountId,
          type: 'Contact',
          fbc,
          fbp,
        });
      },
    );

    return { code: 200, result: '成功' };
  }

  /**
   * 发送下单事件
   */
  sendAddToCart(
    request: any,
    accessToken: string,
    accountId: string,
    fbc: string,
    fbp: string,
  ) {
    /**
     *前端请求时的网址
     */
    const originUrl = request.headers.referer;
    const Content = bizSdk.Content;
    const CustomData = bizSdk.CustomData;
    const DeliveryCategory = bizSdk.DeliveryCategory;
    const EventRequest = bizSdk.EventRequest;
    const UserData = bizSdk.UserData;
    const ServerEvent = bizSdk.ServerEvent;

    bizSdk.FacebookAdsApi.init(accessToken);

    // @ts-ignore
    let current_timestamp = Math.floor(new Date() / 1000);

    const userData = new UserData()
      .setEmails(['1778888999@qq.com'])
      .setPhones(['13344445555', '16677778888'])
      // It is recommended to send Client IP and User Agent for Conversions API Events.
      .setClientIpAddress(request.connection.remoteAddress)
      .setClientUserAgent(request.headers['user-agent'])
      .setFbp(fbp)
      .setFbc(fbc);

    const content = new Content();

    const customData = new CustomData();

    const serverEvent = new ServerEvent()
      .setEventName('AddToCart')
      .setEventTime(current_timestamp)
      .setUserData(userData)
      .setCustomData(customData)
      .setEventSourceUrl(originUrl)
      .setActionSource('website');

    const eventsData = [serverEvent];
    const eventRequest = new EventRequest(accessToken, accountId).setEvents(
      eventsData,
    );

    eventRequest._test_event_code = 'TEST39766';

    eventRequest.execute().then(
      (response) => {
        console.log('Response: ', {
          ...response,
          accessToken,
          accountId,
          type: 'AddToCart',
          fbc,
          fbp,
        });
      },
      (err) => {
        console.error('Error: ', {
          ...err,
          accessToken,
          accountId,
          type: 'AddToCart',
          fbc,
          fbp,
        });
      },
    );

    return { code: 200, result: '成功' };
  }
}
