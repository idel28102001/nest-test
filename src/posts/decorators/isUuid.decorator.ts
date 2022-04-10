import { createParamDecorator, ExecutionContext, NotFoundException } from '@nestjs/common';

export const getUuid = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const pattern = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;
    if (pattern.test(request.params.id)) {
      return request.params.id;
    }
    else {
      throw new NotFoundException;
    }
  }
);