import { Module } from '@nestjs/common';
import { SystemModule } from './system/system.module';
import { MaterialModule } from './material/Material.module';
@Module({
  imports: [SystemModule, MaterialModule],
})
export class AdminModule {}
