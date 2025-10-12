import { Connection } from 'mongoose';
import { NewsSchema } from '../schemas/news.schema';

export const NEWS_MODEL = 'NEWS_MODEL';

export const newsProviders = [
  {
    provide: NEWS_MODEL,
    useFactory: (connection: Connection) => connection.model('News', NewsSchema),
    inject: ['DATABASE_CONNECTION'],
  },
];
