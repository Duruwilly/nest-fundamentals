import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from './user.entity';
import { Repository, UpdateResult } from 'typeorm';
import { CreateUserDTO } from './dto/create-user-dto';
import * as bcrypt from 'bcryptjs';
import { LoginDTO } from '../auth/dto/login-user-dto';
import { v4 as uuid4 } from 'uuid';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private userRepository: Repository<Users>,
  ) {}

  async create(userDTO: CreateUserDTO): Promise<Users> {
    const user = new Users();
    user.firstName = userDTO.firstName;
    user.lastName = userDTO.lastName;
    user.email = userDTO.email;
    user.apiKey = uuid4();
    user.role = 'regular';

    const salt = await bcrypt.genSalt();
    user.password = await bcrypt.hash(userDTO.password, salt);
    const savedUser = await this.userRepository.save(user);
    // const hashedPassword = await bcrypt.hash(userDTO.password, salt);

    // const newUser = {
    //   ...userDTO,
    //   role: 'regular',
    //   password: hashedPassword,
    // };

    // const user = await this.userRepository.save(newUser);
    // delete user.password;
    delete savedUser.password;
    return user;
  }

  async findOne(data: LoginDTO): Promise<Users> {
    const user = await this.userRepository.findOneBy({ email: data.email });
    if (!user) {
      throw new UnauthorizedException('user not found');
    }
    return user;
  }

  async findById(id: number): Promise<Users> {
    return this.userRepository.findOneBy({ id: id });
  }

  async updateSecretKey(userId, secret: string): Promise<UpdateResult> {
    return this.userRepository.update(
      { id: userId },
      {
        twoFASecret: secret,
        enable2FA: true,
      },
    );
  }

  async findByApiKey(apiKey: string): Promise<Users> {
    return this.userRepository.findOneBy({ apiKey });
  }
}
