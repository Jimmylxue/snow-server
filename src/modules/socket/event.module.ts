import { Module } from '@nestjs/common';
import { JwtAuthGuard } from './core/jwt-auth.guard';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [],
  providers: [JwtService, JwtAuthGuard],
})
export class EventsModule {}
