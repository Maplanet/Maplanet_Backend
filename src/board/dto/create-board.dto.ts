import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber, IsBoolean } from 'class-validator';

export class CreateBoardDto {
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({
    example: '900,000',
    description: '시간당 메소',
  })
  public meso: number;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: '1 시간당 메소 150만에 4시간 해드립니다.',
    description: '제목',
  })
  public title: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: '타락파워전사',
    description: '메이플랜드 닉네임',
  })
  public maple_nickname: string;

  // @IsString()
  // @ApiProperty({
  //   example: '죽은나무의숲4',
  //   description: '사냥터',
  // })
  // public hunting_ground: string;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({
    example: '67',
    description: '레벨',
  })
  public level: number;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: '마법사',
    description: '직업',
  })
  public main_job: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: '클레릭',
    description: '직업',
  })
  public sub_job: string;

  // @IsString()
  // @ApiProperty({
  //   example: '심쩔',
  //   description: '쩔 종류',
  // })
  // public progress_kind: string;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({
    example: '5',
    description: '잠쩔 시간',
  })
  public progress_time: number;

  @IsNotEmpty()
  @IsBoolean()
  @ApiProperty({
    example: 'true',
    description: '자리 보유',
  })
  public position: boolean;
}
