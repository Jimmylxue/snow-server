import { Module } from '@nestjs/common';
import { LinkModule } from './link/link.module';

@Module({
  imports: [LinkModule],
  providers: [],
  controllers: [],
})
export class LinksModule {}
