import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductTypeService } from './productType.service';
import { ProductTypeController } from './productType.controller';
import { ProductType } from '../../entities/productType.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ProductType])],
  providers: [ProductTypeService],
  controllers: [ProductTypeController],
})
export class ProductTypeModule {}
