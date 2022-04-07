import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { Role } from '../enums/role.enum';
export interface UserPayload {
  username: string,
  roles: Role[],
  userId: string;
}
export const GetUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): UserPayload => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;
    return { userId: user.sub, ...user };
  }
);
