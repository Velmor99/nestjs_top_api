import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

// Этот документ позволит нам типизировать возвращаемое значение
export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop([String])
  images: string[];
}

export const UserSchema = SchemaFactory.createForClass(User);
