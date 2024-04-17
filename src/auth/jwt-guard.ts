import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {} // indicates that the AuthGuard class should be configured for JWT authentication which makes the JwtAuthGuard class inherits all the behavior and functionality provided by the AuthGuard class for JWT authentication
