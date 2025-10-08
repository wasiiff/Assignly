import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export enum Role {
  USER = 'user',
  ADMIN = 'admin',
}

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ type: [String], enum: Role, default: [Role.USER] })
  roles: Role[];

  @Prop()
  avatarUrl?: string;
}
export type UserDocument = User & Document & { _id: Types.ObjectId };
export const UserSchema = SchemaFactory.createForClass(User);


UserSchema.set('toJSON', {
  transform: (_: any, ret: Record<string, any>) => {
    delete ret.password;
    return ret;
  },
});

UserSchema.set('toObject', {
  transform: (_: any, ret: Record<string, any>) => {
    delete ret.password;
    return ret;
  },
});
