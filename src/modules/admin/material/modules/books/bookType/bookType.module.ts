import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookTypeService } from './bookType.service';
import { BookTypeController } from './bookType.controller';
import { TBBookType } from '../entities/bookType.entity';
@Module({
  imports: [TypeOrmModule.forFeature([TBBookType])],
  providers: [BookTypeService],
  controllers: [BookTypeController],
})
export class BookTypeModule {}
