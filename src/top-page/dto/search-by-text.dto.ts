import { IsString } from 'class-validator';

export class SearchByTextDto {
  @IsString()
  text: string;
}
