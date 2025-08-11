import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CommentsAboutMeDocument = HydratedDocument<CommentsAboutMe>;

@Schema({ timestamps: true })
export class CommentsAboutMe {
  @Prop({ required: true })
  avatar: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  relationship: string;

  @Prop({ required: true })
  comment: string;

  @Prop({ required: true })
  status: string;

  @Prop()
  createdAt?: Date;

  @Prop()
  updatedAt?: Date;
}

export const CommentsAboutMeSchema =
  SchemaFactory.createForClass(CommentsAboutMe);
