import { Connection } from 'mongoose';
import { CommentsAboutMeSchema } from '../schemas/comments-about-me.schema';

export const COMMENTS_ABOUT_ME_MODEL = 'COMMENTS_ABOUT_ME_MODEL';

export const commentsAboutMeProviders = [
  {
    provide: COMMENTS_ABOUT_ME_MODEL,
    useFactory: (connection: Connection) =>
      connection.model('CommentsAboutMe', CommentsAboutMeSchema),
    inject: ['DATABASE_CONNECTION'],
  },
];
