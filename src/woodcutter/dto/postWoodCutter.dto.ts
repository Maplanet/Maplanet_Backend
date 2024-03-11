import { IsNumber, IsString } from 'class-validator';

export class WoodCutterDTO {
  @IsString()
  title: string;

  @IsNumber()
  meso: number;

  @IsString()
  main_job: string;

  @IsString()
  sub_job: string;

  @IsNumber()
  progress_time: number;

  @IsString()
  hunting_ground: string;

  @IsNumber()
  level: number;

  @IsString()
  maple_nickname: string;
}
