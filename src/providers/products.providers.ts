import { Connection } from 'mongoose';
import {
  PRODUCT_NAME_MODEL,
  ProductsSchema,
} from 'src/schemas/products.schema';
export const productsProviders = [
  {
    provide: PRODUCT_NAME_MODEL,
    useFactory: (connection: Connection) =>
      connection.model('PRODUCTS', ProductsSchema),
    inject: ['DATABASE_CONNECTION'],
  },
];
