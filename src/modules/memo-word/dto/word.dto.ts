import {
  IsIn,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class ListWordBody {
  @IsOptional()
  @IsNumber({}, { message: 'userId-参数类型错误' })
  userId: number;

  @IsOptional({ message: 'languageId-不能为空' })
  @IsNumber({}, { message: 'languageId-参数类型错误' })
  languageId: number;

  @IsOptional({ message: 'word-不能为空' })
  @IsString({ message: 'word-参数类型错误' })
  word: string;

  @IsOptional({ message: 'chineseMean-不能为空' })
  @IsString({ message: 'chineseMean-参数类型错误' })
  chineseMean: string;

  @IsOptional()
  @IsIn(['ASC', 'DESC'])
  sort: string;

  @IsNotEmpty({ message: 'pageSize不能为空' })
  @IsInt({ message: 'pageSize-参数类型错误' })
  pageSize: number;

  @IsNotEmpty({ message: 'page不能为空' })
  @IsInt({ message: 'page-参数类型错误' })
  page: number;
}

export class SaveWordBody {
  @IsOptional()
  @IsNumber({}, { message: 'userId-参数类型错误' })
  userId: number;

  @IsNotEmpty({ message: 'languageId-不能为空' })
  @IsNumber({}, { message: 'languageId-参数类型错误' })
  languageId: number;

  @IsNotEmpty({ message: 'word-不能为空' })
  @IsString({ message: 'word-参数类型错误' })
  word: string;

  @IsNotEmpty({ message: 'chineseMean-不能为空' })
  @IsString({ message: 'chineseMean-参数类型错误' })
  chineseMean: string;
}

export class DelWordBody {
  @IsNotEmpty({ message: 'wordId-不能为空' })
  @IsNumber({}, { message: 'wordId-参数类型错误' })
  wordId: number;
}
