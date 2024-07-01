import { Module } from '@nestjs/common';
import { EventsGateway } from './gateway';
import { JwtAuthGuard } from './core/jwt-auth.guard';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [],
  providers: [EventsGateway, JwtService, JwtAuthGuard],
})
export class EventsModule {}
