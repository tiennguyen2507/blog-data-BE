import { Connection } from 'mongoose';
import { ORDER_NAME_MODEL, OrderSchema } from 'src/schemas/order.schema';

export const orderProviders = [
  {
    provide: ORDER_NAME_MODEL,
    useFactory: (connection: Connection) => connection.model('ORDERS', OrderSchema),
    inject: ['DATABASE_CONNECTION'],
  },
];
