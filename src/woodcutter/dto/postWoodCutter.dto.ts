import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class WoodCutterDTO {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsNumber()
  meso: number;

  @IsNotEmpty()
  @IsString()
  main_job: string;

  @IsNotEmpty()
  @IsString()
  sub_job: string;

  @IsNotEmpty()
  @IsNumber()
  progress_time: number;

  @IsNotEmpty()
  @IsString()
  hunting_ground: string;

  @IsNotEmpty()
  @IsNumber()
  level: number;

  @IsNotEmpty()
  @IsString()
  maple_nickname: string;
}
