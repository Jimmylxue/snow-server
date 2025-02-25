import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { TBBooks } from '../entities/book.entity';
import { BookAddDTO, BookListDTO, BookUpdateDTO } from '../dto/book.dto';
import { formatFullTime } from '@src/utils';

@Injectable()
export class BookService {
  constructor(
    @InjectRepository(TBBooks)
    private readonly booksRepository: Repository<TBBooks>,
  ) {}

  async getList(params: BookListDTO) {
    const { pageSize, page, startTime, endTime, ...where } = params;
    const [result, total] = await this.booksRepository.findAndCount({
      where: {
        ...where,
        createdTime: startTime
          ? Between(
              formatFullTime(Number(startTime)),
              formatFullTime(Number(endTime)),
            )
          : undefined,
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

  async getDetail(id: number) {
    return await this.booksRepository.findOneBy({
      id,
    });
  }

  async add(params: BookAddDTO) {
    const item = await this.booksRepository.create();
    item.name = params.name;
    item.description = params.description;
    item.author = params.author;
    item.cover = params.cover;
    item.source = params.source;
    item.typeId = params.typeId;
    item.type = params.typeId;
    await this.booksRepository.save(item);
  }

  async update(params: BookUpdateDTO) {
    const { id, ...args } = params;
    return await this.booksRepository.update(
      { id },
      {
        ...args,
      },
    );
  }

  async del(id: number) {
    return await this.booksRepository.delete(id);
  }
}
