import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExamRecordService } from './examRecord.service';
import { ExamRecordController } from './examRecord.controller';
import { UsersModule } from '@src/modules/admin/system/user/modules/user.module';
import { ExamRecord } from '../../entities/examRecord.entity';
import { ExamProject } from '../../entities/examProject.entity';
@Module({
  imports: [TypeOrmModule.forFeature([ExamRecord, ExamProject]), UsersModule],
  providers: [ExamRecordService],
  controllers: [ExamRecordController],
})
export class ExamRecordModule {}
