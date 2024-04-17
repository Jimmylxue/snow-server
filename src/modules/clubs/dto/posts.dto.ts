import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class PostsListDto {
  @IsOptional()
  @IsNumber()
  clubId: number;
}

export class SendPostsDto {
  @IsNotEmpty()
  @IsNumber()
  clubId: number;

  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  content: string;
}

export class CommentPostsDto {
  @IsNotEmpty()
  @IsNumber()
  clubId: number;

  @IsNotEmpty()
  @IsNumber()
  postsId: number;

  @IsNotEmpty()
  @IsString()
  content: string;
}

export class LovePostsDto {
  @IsNotEmpty()
  @IsNumber()
  clubId: number;

  @IsNotEmpty()
  @IsNumber()
  postsId: number;
}

export class SignUpDto {
  @IsOptional()
  @IsNumber()
  clubId?: number;
}

export class AddClubDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  desc: string;
}
