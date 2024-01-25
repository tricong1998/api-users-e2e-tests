import { Body, Controller, Param, Patch, Post } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { CreateUserDto } from './dto/createUser.dto';
import { UsersService } from './users.service';
import { AddPointDto } from './dto/addPoints.dto';
import { UserByIdDto } from './dto/getUserDetail.dto';
import { ApiCommonResponse } from 'src/decorators/api-common-response.decorator';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post()
  @ApiOperation({
    operationId: 'createUser',
    summary: 'Create user',
    description: 'Create new user',
  })
  @ApiCommonResponse()
  create(@Body() input: CreateUserDto) {
    return this.usersService.createUser(input);
  }

  @Patch(':id/add-points')
  @ApiOperation({
    operationId: 'addPoint',
    summary: 'Add point for a user',
    description: 'Add point for a user',
  })
  @ApiCommonResponse()
  addPoint(@Param() { id }: UserByIdDto, @Body() input: AddPointDto) {
    return this.usersService.addPoint(id, input);
  }
}
