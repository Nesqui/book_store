import { Controller, Get, Post, Body, Put, Patch, Query, Delete, UnauthorizedException, UseGuards, Param } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiOperation, ApiQuery } from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';
import { AcceptUserDto } from './dto/accept-user.dto';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { Role, RolesGuard } from 'src/guards/roles.guard';
import { LoginUserDto } from './dto/login-user.dto';
import { Roles } from 'src/decorators/roles.decorator';
import { ReqUser } from 'src/decorators/user.decorator';
import { User } from './entities/user.entity';
import { UpdateUserRoleDto } from './dto/update-user-role.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Post('register')
  register(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Post('login')
  @ApiOperation({ summary: 'Sign in' })
  async login(@Body() loginUserDto: LoginUserDto) {
    return this.userService.login(loginUserDto);
  }

  @Get('accept')
  accept(@Query() acceptUserDto: AcceptUserDto) {
    return this.userService.accept(acceptUserDto);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  findOne(@ReqUser() user: User) {
    return this.userService.findOne(user.id);
  }

  @Put(':id/role')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  updateRole(@Param('id') id: string, @Body() updateUserRoleDti: UpdateUserRoleDto) {
    return this.userService.updateRole(id, updateUserRoleDti);
  }
}
