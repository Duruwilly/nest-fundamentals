import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { LoginDTO } from './dto/login-user-dto';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { Users } from 'src/users/user.entity';
import { ArtistsService } from 'src/artists/artists.service';
import { PayloadType } from './types';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
    private artistsService: ArtistsService,
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
      const payload: PayloadType = { email: user.email, userId: user.id };
      const artist = await this.artistsService.findArtist(user.id);
      const { email, firstName, lastName, role } = user;

      if (artist) {
        payload.artistId = artist.id;
      }
      return {
        accessToken: this.jwtService.sign(payload),
        data: {
          email,
          firstName,
          lastName,
          role,
        },
      };
    } else {
      throw new UnauthorizedException('password does not match');
    }
  }
}
