import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from './user.entity';
import { Repository } from 'typeorm';
import { CreateUserDTO } from './dto/create-user-dto';
import * as bcrypt from 'bcryptjs';
import { LoginDTO } from '../auth/dto/login-user-dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private userRepository: Repository<Users>,
  ) {}

  async create(userDTO: CreateUserDTO): Promise<Users> {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(userDTO.password, salt);

    const newUser = {
      ...userDTO,
      role: 'regular',
      password: hashedPassword,
    };

    const user = await this.userRepository.save(newUser);
    delete user.password;
    return user;
  }

  async findOne(data: LoginDTO): Promise<Users> {
    const user = await this.userRepository.findOneBy({ email: data.email });
    if (!user) {
      throw new UnauthorizedException('user not found');
    }
    return user;
  }
}
