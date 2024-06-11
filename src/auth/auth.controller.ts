import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { CreateUserDTO } from 'src/users/dto/create-user-dto';
import { Users } from 'src/users/user.entity';
import { UsersService } from 'src/users/users.service';
import { AuthService } from './auth.service';
import { LoginDTO } from './dto/login-user-dto';
import { JwtAuthGuard } from './jwt-guard';
import { Enable2FAType } from './types';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { ValidateTokenDTO } from './dto/validate-token-dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(
    private userService: UsersService,
    private authService: AuthService,
  ) {}
  @Post('signup')
  @ApiOperation({ summary: 'register new user' })
  @ApiResponse({
    status: 201,
    description: 'It will return the user in the response',
  })
  signup(
    @Body()
    userDTO: CreateUserDTO,
  ): Promise<Users> {
    return this.userService.create(userDTO);
  }

  @Post('login')
  login(
    @Body()
    loginDTO: LoginDTO,
  ) {
    return this.authService.login(loginDTO);
  }

  @Get('enable-2fa')
  @UseGuards(JwtAuthGuard)
  enable2FA(
    @Req()
    request,
  ): Promise<Enable2FAType> {
    console.log(request.user);
    return this.authService.enable2FA(request.user.userId);
  }

  @Post('validate-2fa')
  @UseGuards(JwtAuthGuard)
  validate2FA(
    @Req()
    request,
    @Body()
    ValidateTokenDTO: ValidateTokenDTO,
  ): Promise<{ verified: boolean }> {
    return this.authService.validate2FAToken(
      request.user.userId,
      ValidateTokenDTO.token,
    );
  }

  @Get('profile')
  @UseGuards(AuthGuard('bearer'))
  getProfile(
    @Req()
    request,
  ) {
    delete request.user.password;
    return {
      msg: 'authenticated with api key',
      user: request.user,
    };
  }
}
