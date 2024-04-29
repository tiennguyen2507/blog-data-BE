import { Connection } from 'mongoose';
import { UserSchema } from 'src/schemas/users.schema';
export const usersProviders = [
  {
    provide: 'USER_MODEL',
    useFactory: (connection: Connection) =>
      connection.model('USER', UserSchema),
    inject: ['DATABASE_CONNECTION'],
  },
];
