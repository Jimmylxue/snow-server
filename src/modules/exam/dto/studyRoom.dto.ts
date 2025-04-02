import { IsNotEmpty, IsNumber } from 'class-validator';

export class JoinStudyRoomDto {
  @IsNotEmpty()
  @IsNumber()
  studyRoomId: number;
}
