import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PostDocument = Post & Document;

@Schema()
export class Post {
  @Prop()
  postNumber: number;

  @Prop()
  title: string;

  @Prop()
  content: string;

  @Prop()
  summary: string;

  @Prop()
  keyword: string[];

  @Prop()
  category: string;

  @Prop()
  date: Date;

  @Prop()
  views: number;

  @Prop()
  hearts: number;
}

export const PostSchema = SchemaFactory.createForClass(Post);
