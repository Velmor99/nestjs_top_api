import { Module } from '@nestjs/common';
import { ReviewController } from './review.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ReviewModel, ReviewSchema } from './review.model';
import { ReviewService } from './review.service';
import { PassportModule } from '@nestjs/passport';

@Module({
  controllers: [ReviewController],
  providers: [ReviewService],
  imports: [
    MongooseModule.forFeature([
      { name: ReviewModel.name, schema: ReviewSchema },
    ]),
    PassportModule,
  ],
})
export class ReviewModule {}
