export interface DiscdordDataType {
  id: string;
  access_token: string;
  refresh_token: string;
}

export interface tokenpayload {
  id: string;
  username: string;
  avatar: string | null;
  email: string;
  tokentype?: string;
}
