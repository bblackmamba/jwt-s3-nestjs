import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import JwtPayload from '../../token/dto/jwt-payload.dto';

const GetCurrentUserId = createParamDecorator(
  (_: undefined, context: ExecutionContext): number => {
    const request = context.switchToHttp().getRequest();
    const user = request.user as JwtPayload;
    return user.id;
  },
);

export default GetCurrentUserId;
