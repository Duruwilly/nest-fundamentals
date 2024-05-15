import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { LoginDTO } from './dto/login-user-dto';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { Users } from 'src/users/user.entity';
import { ArtistsService } from 'src/artists/artists.service';
import { Enable2FAType, PayloadType } from './types';
import * as speakeasy from 'speakeasy';

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
      const {
        email,
        firstName,
        lastName,
        role,
        twoFASecret,
        enable2FA,
        apiKey,
      } = user;

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
          twoFASecret,
          enable2FA,
          apiKey,
        },
      };
    } else {
      throw new UnauthorizedException('password does not match');
    }
  }

  async enable2FA(userId: number): Promise<Enable2FAType> {
    const user = await this.userService.findById(userId);
    if (user.enable2FA) {
      return { secret: user.twoFASecret };
    }
    const secret = speakeasy.generateSecret();
    console.log(secret);
    user.twoFASecret = secret.base32;
    await this.userService.updateSecretKey(user.id, user.twoFASecret);
    return { secret: user.twoFASecret };
  }

  async validate2FAToken(
    userId: number,
    token: string,
  ): Promise<{ verified: boolean }> {
    try {
      const user = await this.userService.findById(userId);

      // extract his 2fa secret

      // verify the secret with token by calling the speakeasy verify method
      const verified = speakeasy.totp.verify({
        secret: user.twoFASecret,
        token: token,
        encoding: 'base32',
      });

      if (verified) {
        return { verified: true };
      } else {
        return { verified: false };
      }
    } catch (error) {
      throw new UnauthorizedException('Error verifying token');
    }
  }

  async validateUserByApiKey(apiKey: string): Promise<Users> {
    return this.userService.findByApiKey(apiKey);
  }
}
