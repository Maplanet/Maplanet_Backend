import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber, IsBoolean } from 'class-validator';

export class CreatePartyDto {

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: '파티사냥 하실분 오세요',
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

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: '죽은나무의숲4',
    description: '사냥터',
  })
  public hunting_ground: string;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({
    example: 5,
    description: '잠쩔 시간',
  })
  public progress_time: number;

  @IsNotEmpty()
  @IsBoolean()
  @ApiProperty({
    example: true,
    description: '주차 완료',
  })
  public parking: boolean;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({
    example: 2,
    description: '모집 인원수',
  })
  public recruit_people_count: number;

  @IsString()
  @ApiProperty({
    example: '55 표도',
    description: '사냥 자리',
  })
  public first_floor: string;

  @IsString()
  @ApiProperty({
    example: '구인중',
    description: '사냥 자리',
  })
  public second_floor: string;

  @IsString()
  @ApiProperty({
    example: '75 표도',
    description: '사냥 자리',
  })
  public third_floor: string;

  @IsString()
  @ApiProperty({
    example: '93 클레릭',
    description: '사냥 자리',
  })
  public fourth_floor: string;

  @IsString()
  @ApiProperty({
    example: '구인중',
    description: '사냥 자리',
  })
  public fifth_floor: string;

  @IsString()
  @ApiProperty({
    example: '구인중',
    description: '사냥 자리',
  })
  public sixth_floor: string;
}
