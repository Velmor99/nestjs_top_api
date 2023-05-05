import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type TopPageDocument = HydratedDocument<TopPageModel>;

export class HhData {
  @Prop()
  count: number;

  @Prop()
  juniorSalary: number;

  @Prop()
  middleSalary: number;

  @Prop()
  seniorSalary: number;
}
export class TopPageAdvantage {
  title: string;
  description: string;
}

export enum TopLevelCategory {
  Courses = 'Courses',
  Services = 'Services',
  Books = 'Books',
  Products = 'Products',
}

@Schema()
export class TopPageModel {
  @Prop({ enum: TopLevelCategory })
  firstCategory: TopLevelCategory;

  @Prop({ unique: true })
  alias: string;

  @Prop()
  secondCategory: string;

  @Prop()
  title: string;

  @Prop()
  category: string;

  @Prop()
  description: string;

  @Prop()
  hh?: HhData;

  @Prop({ type: () => [TopPageAdvantage] })
  advantages: TopPageAdvantage[];

  @Prop()
  seoText: string;

  @Prop()
  tagsTitle: string;

  @Prop({ type: () => [String] })
  tags: string[];
}

export const TopPageSchema = SchemaFactory.createForClass(TopPageModel);
TopPageSchema.index({ title: 'text', advantages: 'text' });
