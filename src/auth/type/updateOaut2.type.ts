export interface DiscdordDataType {
  id: string;
  access_token: string;
  refresh_token: string;
}

export interface ITokenpayload {
  discord_id: string;
  user_id: number;
  username: string;
  global_name: string;
  avatar: string | null;
  email: string;
  tokentype?: string;
}
