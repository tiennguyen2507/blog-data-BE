import { Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from 'src/schemas/users.schema';
import { Model } from 'mongoose';
import { fieldSelector } from 'src/lib';

@Injectable()
export class UsersService {
  constructor(@Inject('USER_MODEL') private userModel: Model<User>) {}

  async create(createCatDto: CreateUserDto): Promise<typeof createCatDto> {
    const createdUser = new this.userModel(createCatDto);
    return createdUser.save();
  }

  async findAll(): Promise<User[]> {
    const users = await this.userModel
      .find()
      .select(fieldSelector.exclude(['refresh_token', 'password']))
      .exec();

    return users.map((user) => {
      const value = {
        ...user.toObject(),
        fullName: `${user.firstName} ${user.lastName}`,
      };
      delete value.lastName;
      delete value.firstName;
      return value;
    });
  }

  async findOne(id: string): Promise<User> {
    return await this.userModel.findById(id);
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${updateUserDto} user`;
  }

  async remove(id: string) {
    return await this.userModel.findByIdAndDelete(id);
  }
}
