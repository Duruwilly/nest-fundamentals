import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from './user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Users])], // doing this because i will like to inject the user entity inside the user service
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
