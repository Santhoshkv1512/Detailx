import { Module } from '@nestjs/common';
import { SlotsController } from './slots.controller';
import { SlotsService } from './slots.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

export const REDIS_CLIENT = 'REDIS_CLIENT';

@Module({
  imports: [ConfigModule],
  controllers: [SlotsController],
  providers: [
    SlotsService,
    {
      provide: REDIS_CLIENT,
      useFactory: (configService: ConfigService) => {
        const redisUrl = configService.get<string>('REDIS_URL', 'redis://localhost:6379');
        const client = new Redis(redisUrl);
        client.on('error', (err) => {
          console.error('Redis client error:', err);
        });
        return client;
      },
      inject: [ConfigService],
    },
  ],
  exports: [SlotsService, REDIS_CLIENT],
})
export class SlotsModule {}
