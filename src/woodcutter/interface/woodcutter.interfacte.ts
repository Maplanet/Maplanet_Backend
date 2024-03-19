export interface IWoodCutter {
  title: string;
  meso: number;
  main_job: string;
  sub_job: string;
  progress_time: number;
  hunting_ground: string;
  level: number;
  maple_nickname: string;
}

export interface IBoard3Data {
  board3_id: number;
  user_id: number;
  discord_id: string;
  title: string;
  meso: number;
  sub_job: string;
  progress_time: number;
  hunting_ground: string;
  level: number;
  discord_global_name: string;
  discord_image: string;
  view_count: number;
  complete: boolean;
  manner_count: number;
  report_count: number;
  created_at: Date;
  update_at: Date;
}
