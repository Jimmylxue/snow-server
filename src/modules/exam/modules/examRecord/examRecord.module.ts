import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExamRecordService } from './examRecord.service';
import { ExamRecordController } from './examRecord.controller';
import { UsersModule } from '@src/modules/admin/system/user/modules/user.module';
import { ExamRecord } from '../../entities/examRecord.entity';
@Module({
  imports: [TypeOrmModule.forFeature([ExamRecord]), UsersModule],
  providers: [ExamRecordService],
  controllers: [ExamRecordController],
})
export class ExamRecordModule {}
