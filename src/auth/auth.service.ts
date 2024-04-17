import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { LoginDTO } from './dto/login-user-dto';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { Users } from 'src/users/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}

  /** WITHOUT JWT */
  // async login(loginDTO: LoginDTO): Promise<Users> {
  //   const user = await this.userService.findOne(loginDTO);

  //   const pastwordMatched = await bcrypt.compare(
  //     loginDTO.password,
  //     user.password,
  //   );

  //   if (pastwordMatched) {
  //     delete user.password;
  //     return user;
  //   } else {
  //     throw new UnauthorizedException('password does not match');
  //   }
  // }
  async login(
    loginDTO: LoginDTO,
  ): Promise<{ accessToken: string; data: Omit<Users, 'id' | 'password'> }> {
    const user = await this.userService.findOne(loginDTO);

    const pastwordMatched = await bcrypt.compare(
      loginDTO.password,
      user.password,
    );

    if (pastwordMatched) {
      delete user.password;
      // return user;
      const payload = { email: user.email, sub: user.id };
      const { email, firstName, lastName } = user;
      return {
        accessToken: this.jwtService.sign(payload),
        data: {
          email,
          firstName,
          lastName,
        },
      };
    } else {
      throw new UnauthorizedException('password does not match');
    }
  }
}
