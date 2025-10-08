import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type TaskDocument = Task & Document;

@Schema({ timestamps: true })
export class Task {
  @Prop({ required: true })
  title: string;

  @Prop()
  description?: string;

  @Prop({ default: false })
  completed: boolean;

  @Prop({ type: Date, default: null })
  dueDate?: Date;

  @Prop({ default: 'medium', enum: ['low', 'medium', 'high'] })
  priority: 'low' | 'medium' | 'high';


  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  createdBy: Types.ObjectId;


  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  assignedTo: Types.ObjectId;
}

export const TaskSchema = SchemaFactory.createForClass(Task);
