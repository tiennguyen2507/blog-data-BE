import { Connection } from 'mongoose';
import { ContactSchema } from '../schemas/contact.schema';

export const CONTACT_MODEL = 'CONTACT_MODEL';

export const contactProviders = [
  {
    provide: CONTACT_MODEL,
    useFactory: (connection: Connection) =>
      connection.model('Contact', ContactSchema),
    inject: ['DATABASE_CONNECTION'],
  },
];
