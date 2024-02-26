import {
  Controller,
  Get,
  Header,
  Post,
  Query,
  Redirect,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
// import { DiscordAuthGuard } from '../auth/discord-auth.guard'

interface IData {
  access_token: string;
  refreshToken: string;
  discordImage: string;
}

@ApiTags('USERS')
@Controller('/discord')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

}
