import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'oauth2' })
export class DiscordOAuth2Credentials {
  @PrimaryColumn({ name: 'discord_id' })
  discord_id: string;

  @Column({ name: 'access_token' })
  access_token: string;

  @Column({ name: 'refresh_token' })
  refresh_token: string;
}
