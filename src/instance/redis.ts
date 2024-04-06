import Redis from 'ioredis';
import { ConfigService } from '@nestjs/config';

const configService = new ConfigService();

export class RedisInstance {
  static redis: Redis = null;
  static async initRedis() {
    if (!this.redis) {
      const redisConfig = {
        port: configService.get('REDIS_PORT'),
        host: configService.get('REDIS_HOST'),
        password: configService.get('REDIS_PASSWORD'),
      };
      this.redis = new Redis(redisConfig);
      this.redis.on('error', (err) => console.log('Redis cluster Error', err));
      this.redis.on('connect', () => console.log('redis连接成功'));
    }
    return this.redis;
  }
}

export function getRedisInstance() {}
