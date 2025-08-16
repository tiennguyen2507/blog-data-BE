import { Connection } from 'mongoose';
import { ProjectSchema } from '../schemas/project.schema';

export const PROJECT_MODEL = 'PROJECT_MODEL';

export const projectProviders = [
  {
    provide: PROJECT_MODEL,
    useFactory: (connection: Connection) => connection.model('Project', ProjectSchema),
    inject: ['DATABASE_CONNECTION'],
  },
];
