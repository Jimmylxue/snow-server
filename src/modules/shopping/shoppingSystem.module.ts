import { Module } from '@nestjs/common';
import { ProductModule } from './modules/product/product.module';
import { OrderModule } from './modules/order/order.module';
import { AddressModule } from './modules/address/address.module';
import { ProductTypeModule } from './modules/productType/productType.module';

@Module({
  imports: [ProductModule, OrderModule, AddressModule, ProductTypeModule],
  providers: [],
  controllers: [],
})
export class ShoppingSystemModule {}
