import * as mongoose from 'mongoose';
import * as log from 'log-beautify';

export const databaseProviders = [
  {
    provide: 'DATABASE_CONNECTION',
    useFactory: (): Promise<typeof mongoose> => {
      return mongoose
        .connect(
          'mongodb+srv://tiennguyen2507:12345678a@cluster0.7pasb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0',
        )
        .then((value) => {
          log.success_('Connect DB success!!');
          return value;
        });
    },
  },
];
