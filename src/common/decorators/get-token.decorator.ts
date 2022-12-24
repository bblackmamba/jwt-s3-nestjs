import { createParamDecorator, ExecutionContext } from '@nestjs/common';

const GetToken = createParamDecorator(
  (_: undefined, context: ExecutionContext): string => {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    return authHeader.split('Bearer ')[1];
  },
);

export default GetToken;
