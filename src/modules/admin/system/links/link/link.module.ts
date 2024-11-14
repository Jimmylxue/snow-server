import { Module } from '@nestjs/common';
import { LinkService } from './link.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Link } from '../entities/links.entity';
import { LinkController } from './link.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Link])],
  providers: [LinkService],
  controllers: [LinkController],
})
export class LinkModule {}
