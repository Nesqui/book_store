import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { User } from 'src/user/entities/user.entity';

export const ReqUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): User => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
