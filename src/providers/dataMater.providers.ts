import { Connection } from 'mongoose';
import { DataMaterSchema } from 'src/schemas/dataMater.schema';
export const dataMaterProviders = [
  {
    provide: 'DATA-MATER_MODEL',
    useFactory: (connection: Connection) =>
      connection.model('DATA-MATER', DataMaterSchema),
    inject: ['DATABASE_CONNECTION'],
  },
];
