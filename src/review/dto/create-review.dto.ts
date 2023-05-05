import { IsString, IsNumber, Min, Max } from 'class-validator';

export class CreateReviewDto {
  @IsString()
  name: string;

  @IsString()
  title: string;

  @IsString()
  description: string;

  @Min(1, { message: 'Это значение не может быть меньше 1' })
  @Max(5)
  @IsNumber()
  rating: number;

  @IsString()
  productId: string;
}
