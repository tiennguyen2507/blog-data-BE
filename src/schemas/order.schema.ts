import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type OrderDocument = HydratedDocument<Order>;

export const ORDER_NAME_MODEL = 'ORDERS_MODEL';

export interface OrderItem {
  productId: Types.ObjectId;
  quantity: number;
}

@Schema({ timestamps: true, id: false })
export class Order {
  @Prop({ required: true, type: String })
  fullName: string;

  @Prop({ required: true, type: String })
  phone: string;

  @Prop({ required: true, type: String })
  address: string;

  @Prop({ type: String, default: '' })
  note: string;

  @Prop({
    required: true,
    type: [
      {
        productId: { type: Types.ObjectId, ref: 'PRODUCTS' },
        quantity: { type: Number, required: true },
      },
    ],
  })
  orderItems: OrderItem[];

  @Prop({ required: true, type: Number, default: 0 })
  totalAmount: number;

  @Prop({
    enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'],
    default: 'pending',
  })
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
}

export const OrderSchema = SchemaFactory.createForClass(Order);
