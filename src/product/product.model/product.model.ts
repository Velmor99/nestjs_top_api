import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

class ProductCharacteristic {
  @Prop()
  name: string;

  @Prop()
  value: string;
}

class ProductAdvantagesOrDisadvantages {
  @Prop()
  title: string;

  @Prop()
  description: string;
}

export type ProductDocument = HydratedDocument<ProductModel>;

@Schema({ timestamps: true })
export class ProductModel {
  _id: Types.ObjectId;

  @Prop()
  image: string;

  @Prop()
  title: string;

  @Prop()
  initialRating: number;

  @Prop()
  description: string;

  @Prop()
  price: number;

  @Prop()
  oldPrice: number;

  @Prop()
  credit: number;

  @Prop({ type: () => [ProductAdvantagesOrDisadvantages] })
  advantages: ProductAdvantagesOrDisadvantages[];

  @Prop({ type: () => [ProductAdvantagesOrDisadvantages] })
  disAdvantages: ProductAdvantagesOrDisadvantages[];

  @Prop({ type: () => [String] })
  categories: string[];

  @Prop({ type: () => [String] })
  tags: string[];

  @Prop({ type: () => [ProductCharacteristic] })
  characteristics: ProductCharacteristic[];
}

export const ProductSchema = SchemaFactory.createForClass(ProductModel);
ProductSchema.index({ description: 'text', tags: 'text', title: 'text' });
