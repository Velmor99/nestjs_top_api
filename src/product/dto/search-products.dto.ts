import { IsString } from 'class-validator';

export class SearchProductsByTextDto {
  @IsString()
  text: string;
}
