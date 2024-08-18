import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { LoginAuthDto } from './dto/login-auth.dto';
import { Model } from 'mongoose';
import { User } from 'src/schemas/users.schema';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @Inject('USER_MODEL') private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  private async generateToken(payload: { id: string; email: string }) {
    const access_token = await this.jwtService.signAsync(payload, {
      secret: '123',
    });
    const refresh_token = await this.jwtService.signAsync(payload, {
      secret: '123',
    });

    await this.userModel.findOneAndUpdate(
      { email: payload.email },
      { refresh_token },
    );

    return { access_token, refresh_token };
  }

  async login(loginAuthDto: LoginAuthDto): Promise<any> {
    const user = await this.userModel.findOne({ email: loginAuthDto.email });
    if (!user) {
      throw new HttpException('Email is not exist', HttpStatus.UNAUTHORIZED);
    }
    const checkPass = bcrypt.compareSync(loginAuthDto.password, user.password);
    if (!checkPass) {
      throw new HttpException('Password is no exist', HttpStatus.UNAUTHORIZED);
    }
    //generate access token and refresh token
    const payload = { id: user.id, email: user.email };

    return this.generateToken(payload);
  }

  private async encodePassword(password: string): Promise<string> {
    const selfRound = 10;
    const self = await bcrypt.genSalt(selfRound);
    const hash = await bcrypt.hash(password, self);
    return hash;
  }

  async register(registerUserDto: RegisterAuthDto): Promise<User> {
    const hashPassword = await this.encodePassword(registerUserDto.password);

    const user = new this.userModel({
      ...registerUserDto,
      password: hashPassword,
      refresh_token: 'refresh_token_string',
    });
    return user.save();
  }

  async getInfo(_id: string): Promise<User> {
    const user = await this.userModel.findOne({ _id });
    return user;
  }
}
