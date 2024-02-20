import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsBoolean,
  IsNumber,
} from 'class-validator';

export class CreateBoard2Dto {
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({
    example: '100,000',
    description: '건당 메소',
  })
  public meso: number;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: '인기도 하락',
    description: '의뢰 종류',
  })
  public report_kind: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: '타락파워전사 인기도 -1시 10만원',
    description: '제목',
  })
  public title: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: '번개의신zz',
    description: '의뢰인 닉네임',
  })
  public request_nickname: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: '타락파워전사',
    description: '비매너 유저 닉네임',
  })
  public place_theif_nickname: string;

}
