import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { usersProviders } from '../providers/user.providers';

@Module({
  controllers: [UsersController],
  providers: [UsersService, ...usersProviders],
})
export class UsersModule {}
