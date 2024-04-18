import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';

// this guard is designed to ensure that only authenticated users with an artistId property are allowed to access protected routes. If authentication fails or if the user does not have an artistId, an unauthorized exception is thrown
@Injectable()
export class ArtistJwtGuard extends AuthGuard('jwt') {
  // This method overrides the canActivate method of the base class (AuthGuard) to customize the guard's behavior.
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    return super.canActivate(context);
  }
  handleRequest<TUser = any>(err: any, user: any): TUser {
    if (err || !user) {
      throw err || new UnauthorizedException();
    }
    console.log(user);

    if (user.artistId) {
      return user;
    }
    throw err || new UnauthorizedException();
  }
}
