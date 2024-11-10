import { Provider } from '@nestjs/common';
import { Connection } from 'mongoose';
import { UserSchema } from 'src/schemas/users.schema';

export const usersProviders: Provider[] = [
  {
    provide: 'USER_MODEL',
    useFactory: (connection: Connection) => {
      return connection.model('USER', UserSchema);
    },
    inject: ['DATABASE_CONNECTION'],
  },
];
