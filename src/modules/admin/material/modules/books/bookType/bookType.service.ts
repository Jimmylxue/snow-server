import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TBBookType } from '../entities/bookType.entity';
import {
  BookTypeAddDTO,
  BookTypeUpdateDTO,
  BookTypeListDTO,
} from '../dto/bookType.dto';

@Injectable()
export class BookTypeService {
  constructor(
    @InjectRepository(TBBookType)
    private readonly bookTypeRepository: Repository<TBBookType>,
  ) {}

  async getList(params: BookTypeListDTO) {
    return await this.bookTypeRepository.find({
      where: {
        ...params,
      },
    });
  }

  async getDetail(id: number) {
    return await this.bookTypeRepository.findOneBy({
      id,
    });
  }

  async add(params: BookTypeAddDTO) {
    const item = await this.bookTypeRepository.create();
    item.name = params.name;
    item.description = params.description;
    item.cover = params.cover;
    await this.bookTypeRepository.save(item);
  }

  async updateType(params: BookTypeUpdateDTO) {
    const { id, ...args } = params;
    return await this.bookTypeRepository.update(
      { id },
      {
        ...args,
      },
    );
  }

  async del(id: number) {
    return await this.bookTypeRepository.delete({ id });
  }
}
