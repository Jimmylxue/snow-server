import { Module } from '@nestjs/common';
import { BookModule } from './book/book.module';
import { BookTypeModule } from './bookType/bookType.module';
@Module({
  imports: [BookModule, BookTypeModule],
  providers: [],
  controllers: [],
})
export class BooksModule {}
