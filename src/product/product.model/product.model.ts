import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

class ProductCharacteristic {
  @Prop()
  name: string;

  @Prop()
  value: string;
}

export type ProductDocument = HydratedDocument<ProductModel>;

@Schema()
export class ProductModel {
  _id: Types.ObjectId;

  @Prop()
  image: string;

  @Prop()
  title: string;

  @Prop()
  description: string;

  @Prop()
  price: number;

  @Prop()
  oldPrice: number;

  @Prop()
  credit: number;

  @Prop()
  advantages: string;

  @Prop()
  disAdvantages: string;

  @Prop({ type: () => [String] })
  categories: string[];

  @Prop({ type: () => [String] })
  tags: string[];

  @Prop({ type: () => [ProductCharacteristic] })
  characteristics: ProductCharacteristic[];
}

export const ProductSchema = SchemaFactory.createForClass(ProductModel);
