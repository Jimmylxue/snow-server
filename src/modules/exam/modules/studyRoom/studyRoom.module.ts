import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StudyRoomService } from './studyRoom.service';
import { StudyRoomController } from './studyRoom.controller';
import { StudyRoom } from '../../entities/studyRoom.entity';
import { StudyRoomRecord } from '../../entities/studyRecord.entity';
import { UsersModule } from '@src/modules/admin/system/user/modules/user.module';
@Module({
  imports: [
    TypeOrmModule.forFeature([StudyRoom, StudyRoomRecord]),
    UsersModule,
  ],
  providers: [StudyRoomService],
  controllers: [StudyRoomController],
})
export class StudyRoomModule {}
