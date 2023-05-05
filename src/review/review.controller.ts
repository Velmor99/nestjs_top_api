import {
  Body,
  Controller,
  Post,
  Delete,
  Param,
  Get,
  HttpException,
  HttpStatus,
  ValidationPipe,
  UsePipes,
  UseGuards,
} from '@nestjs/common';
//TODO костыль в импорте для тестов
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
//TODO костыль в импорте для тестов
import { userEmail } from '../decorators/user-email.decorator';
import { CreateReviewDto } from './dto/create-review.dto';
import { REVIEW_NOT_FOUND } from './review.constants';
import { ReviewService } from './review.service';

@Controller('review')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @UsePipes(new ValidationPipe())
  @Post('create')
  async create(@Body() dto: CreateReviewDto) {
    return await this.reviewService.create(dto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    const deletedDoc = await this.reviewService.delete(id);
    if (!deletedDoc) {
      throw new HttpException(REVIEW_NOT_FOUND, HttpStatus.NOT_FOUND);
    } else {
      return deletedDoc;
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('byProduct/:productId')
  async getByProduct(
    @Param('productId') productId: string,
    @userEmail() email: string,
  ) {
    try {
      return await this.reviewService.findByProductId(productId);
    } catch (error) {
      console.log(error);
    }
  }

  //TODO понять почему тут действует гард если он задан методу выше
  @Delete('byProduct/:productId')
  async deleteByProductId(@Param('productId') productId: string) {
    return await this.reviewService.deleteByProductId(productId);
  }
}
