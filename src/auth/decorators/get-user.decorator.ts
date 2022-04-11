import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { Role } from 'src/users/enums/role.enum';
export interface UserPayload {
  username: string,
  roles: Role[],
  userId: string;
}
export const GetUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): UserPayload => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  }
);
