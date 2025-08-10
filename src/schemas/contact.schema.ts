import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ContactDocument = HydratedDocument<Contact>;

@Schema({ timestamps: true })
export class Contact {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  message: string;

  @Prop({ default: true })
  status: boolean;

  @Prop()
  createdAt?: Date;

  @Prop()
  updatedAt?: Date;
}

export const ContactSchema = SchemaFactory.createForClass(Contact);
