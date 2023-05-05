import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserModel } from './auth.model/user.model';
import { AuthDto } from './dto/auth.dto.ts';
import { compare, genSaltSync, hashSync } from 'bcrypt';
import {
  INCORRECT_PASSWORD_ERROR,
  NOT_FOUND_USER_ERROR,
} from './auth.constants';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(UserModel.name) private readonly userModel: Model<UserModel>,
    private readonly jwtService: JwtService,
  ) {}

  async create(dto: AuthDto) {
    const salt = genSaltSync(10);
    const hash = hashSync(dto.password, salt);
    const newUser = await this.userModel.create({
      email: dto.email,
      passwordHash: hash,
    });
    newUser.save();
    return {
      email: newUser.email,
    };
  }

  async find(email: string) {
    const user = await this.userModel.findOne({ email: email }).exec();
    return user;
  }

  async validateUser(
    email: string,
    password: string,
  ): Promise<Pick<UserModel, 'email'>> {
    const user = await this.find(email);
    if (!user) {
      throw new UnauthorizedException(NOT_FOUND_USER_ERROR);
    }
    const correctPassword = await compare(password, (await user).passwordHash);
    if (!correctPassword) {
      throw new UnauthorizedException(INCORRECT_PASSWORD_ERROR);
    }
    return { email: user.email };
  }

  async login(email: string) {
    const payload = { email };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
