import { Injectable } from '@nestjs/common';
import { Redis } from 'ioredis';
import { InjectRedis } from '@liaoliaots/nestjs-redis';

@Injectable()
export class ChatService {
  constructor(@InjectRedis() private readonly redisClient: Redis) {}

  async addUserList(clientID: string) {
    await this.redisClient.sadd('userIpList', clientID);

    const b: number = await this.redisClient.scard('userIpList');

    console.log('접속한아이피갯수', b);
  }

  async deleteUserList(clientID: string) {
    const a: number = await this.redisClient.srem('userIpList', clientID);
    console.log(clientID);
    console.log('유저접속종료', await this.redisClient.scard('userIpList'));
  }

  async getUserList(): Promise<number> {
    return await this.redisClient.scard('userIpList');
  }
}
