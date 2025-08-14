import * as mongoose from 'mongoose';
import * as log from 'log-beautify';

// const mongoLocal =
//   process.env.MONGO_URI ||
//   'mongodb://bakery_user:bakery_pass@localhost:27017/bakery_db?authSource=admin';

const mongoUri =
  'mongodb+srv://tiennguyen2507:12345678a@cluster0.7pasb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

export const databaseProviders = [
  {
    provide: 'DATABASE_CONNECTION',
    useFactory: (): Promise<typeof mongoose> => {
      return mongoose.connect(mongoUri).then(value => {
        log.success_('Connect DB success!!');
        return value;
      });
    },
  },
];
