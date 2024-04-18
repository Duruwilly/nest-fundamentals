import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { authConstants } from './auth-constant';
import { PayloadType } from './types';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  // this argument indicates that JwtStrategy class should be based on the Strategy provided by Passport
  constructor() {
    super({
      // the super calls the constructor of the base class (PassportStrategy) with configuration options for the JWT authentication strategy.
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), //  Specifies how to extract JWT tokens from incoming requests. In this case, it extracts the token from the Authorization header as a bearer token
      ignoreExpiration: false, // specifies whether to ignore the expiration field in the JWT token
      secretOrKey: authConstants.secret, //  Specifies the secret key used to verify the signature of the JWT token.
    });
  }

  // This method is called by Passport once a JWT token has been verified and decoded.
  async validate(payload: PayloadType) {
    return {
      userId: payload.userId,
      email: payload.email,
      artistId: payload.artistId,
    };
  }
}
