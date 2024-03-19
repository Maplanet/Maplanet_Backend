import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Users } from '../users/entities/users.entity';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());

    console.log(roles);
    if (!roles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user as Users;
    console.log(user);

    // return (
    //   user &&
    //   user.authorities &&
    //   user.authorities.some((role) => roles.includes(role))
    // );
    return null;
  }
}
