import { Type } from 'class-transformer';
import {
  IsArray,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';

class ProductCharacteristicDto {
  @IsString()
  name: string;

  @IsString()
  value: string;
}

class ProductAdvantagesOrDisadvantages {
  @IsString()
  title: string;

  @IsString()
  description: string;
}

export class CreateProductDto {
  @IsString()
  image: string;

  @IsString()
  title: string;

  @Max(5)
  @Min(1)
  @IsNumber()
  initialRating: number;

  @IsString()
  description: string;

  @IsString()
  price: number;

  @IsOptional()
  @IsString()
  oldPrice: number;

  @IsString()
  credit: number;

  @IsArray()
  @ValidateNested()
  @Type(() => ProductAdvantagesOrDisadvantages)
  advantages: ProductAdvantagesOrDisadvantages[];

  @IsArray()
  @ValidateNested()
  @Type(() => ProductAdvantagesOrDisadvantages)
  disAdvantages: ProductAdvantagesOrDisadvantages[];

  @IsArray()
  @IsString({ each: true })
  categories: string[];

  @IsArray()
  @IsString({ each: true })
  tags: string[];

  @IsArray()
  @ValidateNested()
  @Type(() => ProductCharacteristicDto)
  characteristics: ProductCharacteristicDto[];
}
