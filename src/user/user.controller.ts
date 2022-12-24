import {
  Body,
  HttpCode,
  HttpStatus,
  Get,
  Param,
  Post,
  Request,
  UploadedFiles,
  UseInterceptors,
  Delete,
} from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import AuthController from '../common/decorators/auth-controller.decorator';
import UserService from './user.service';
import {
  UpdateUserDto, UserWithRoleDto,
} from './dto';
import { AuthRequest, StatusDto } from '../common/dto';
import { UserNotFoundException } from '../common/exceptions';
import { IncorrectAuthException } from '../auth/exceptions';
import User from './models/user.model';

@AuthController('users')
export default class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ description: 'Get User' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User',
    type: UserWithRoleDto,
  })
  @ApiResponse({
    status: UserNotFoundException.statusCode,
    description: UserNotFoundException.message,
    type: UserNotFoundException,
  })
  @HttpCode(HttpStatus.OK)
  @Get(':id')
  find(
    @Param('id') id: number,
      @Request() request: AuthRequest,
  ): Promise<User> {
    return this.userService.find(id, request.currentUser);
  }

  @ApiOperation({ description: 'Update user' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Updated user',
    type: UserWithRoleDto,
  })
  @ApiResponse({
    status: UserNotFoundException.statusCode,
    description: UserNotFoundException.message,
    type: UserNotFoundException,
  })
  @ApiResponse({
    status: IncorrectAuthException.statusCode,
    description: IncorrectAuthException.message,
    type: IncorrectAuthException,
  })
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(AnyFilesInterceptor())
  @Post(':id')
  update(
    @Param('id') id: number,
      @Body() userDto: UpdateUserDto,
      @Request() request: AuthRequest,
      @UploadedFiles() files: Array<Express.Multer.File>,
  ): Promise<User> {
    return this.userService.update(id, userDto, request.currentUser, files);
  }

  @ApiOperation({ description: 'Delete user' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Status',
    type: StatusDto,
  })
  @ApiResponse({
    status: UserNotFoundException.statusCode,
    description: UserNotFoundException.message,
    type: UserNotFoundException,
  })
  @HttpCode(HttpStatus.OK)
  @Delete(':id')
  delete(
    @Param('id') id: number,
      @Request() request: AuthRequest,
  ): Promise<StatusDto> {
    return this.userService.delete(id, request.currentUser);
  }
}
