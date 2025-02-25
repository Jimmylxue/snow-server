import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TBBooks } from '../entities/book.entity';
import { BookService } from './book.service';
import { BookController } from './book.controller';
@Module({
  imports: [TypeOrmModule.forFeature([TBBooks])],
  providers: [BookService],
  controllers: [BookController],
})
export class BookModule {}
