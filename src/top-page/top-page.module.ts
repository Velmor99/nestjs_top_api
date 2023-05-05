import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TopPageController } from './top-page.controller';
import { TopPageModel, TopPageSchema } from './top-page.model/top-page.model';
import { TopPageService } from './top-page.service';

@Module({
  controllers: [TopPageController],
  providers: [TopPageService],
  imports: [
    MongooseModule.forFeature([
      { name: TopPageModel.name, schema: TopPageSchema },
    ]),
  ],
})
export class TopPageModule {}
