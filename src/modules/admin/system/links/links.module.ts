import { Module } from '@nestjs/common';
import { LinkModule } from './link/link.module';
import { LinkPlatformModule } from './linkPlatform/linkPlatform.module';

@Module({
  imports: [LinkModule, LinkPlatformModule],
  providers: [],
  controllers: [],
})
export class LinksModule {}
