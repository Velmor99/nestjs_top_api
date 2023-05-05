import {
  Controller,
  Get,
  Post,
  Delete,
  Patch,
  Body,
  Param,
  HttpCode,
  NotFoundException,
  UsePipes,
  ValidationPipe,
  UseGuards,
} from '@nestjs/common';
import { IdValidationPipe } from 'src/pipes/id-validation.pipe';
import { CreateTopPageDto } from './dto/create-top-page.dto';
import { FindTopPageDto } from './dto/find-top-page.dto.ts';
import { TOP_PAGE_NOT_FOUND } from './top-page.constants';
import { TopPageModel } from './top-page.model/top-page.model';
import { TopPageService } from './top-page.service';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';

@Controller('top-page')
export class TopPageController {
  constructor(private readonly topPageService: TopPageService) {}
  @UseGuards(JwtAuthGuard)
  @Post('create')
  @UsePipes(new ValidationPipe())
  async create(@Body() dto: CreateTopPageDto) {
    return await this.topPageService.create(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @UsePipes(new ValidationPipe())
  async delete(@Param('id', IdValidationPipe) id: string) {
    return await this.topPageService.findByIdAndDelete(id);
  }

  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  @Get(':id')
  @UsePipes(new ValidationPipe())
  async get(@Param('id', IdValidationPipe) id: string) {
    const topPage = await this.topPageService.findById(id);
    if (!topPage) {
      throw new NotFoundException(TOP_PAGE_NOT_FOUND);
    } else {
      return topPage;
    }
  }

  @HttpCode(200)
  @Get('findByAlias/:alias')
  @UsePipes(new ValidationPipe())
  async getByAlias(@Param('alias') alias: string) {
    const topPage = await this.topPageService.findByAlias(alias);
    if (!topPage) {
      throw new NotFoundException(TOP_PAGE_NOT_FOUND);
    } else {
      return topPage;
    }
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @UsePipes(new ValidationPipe())
  async put(
    @Param('id', IdValidationPipe) id: string,
    @Body() dto: TopPageModel,
  ) {
    const newTopPage = await this.topPageService.findByIdAndUpdate(id, dto);
    if (!newTopPage) {
      throw new NotFoundException(TOP_PAGE_NOT_FOUND);
    } else {
      return newTopPage;
    }
  }

  @Post('findByCategory')
  @UsePipes(new ValidationPipe())
  async find(@Body() dto: FindTopPageDto) {
    return await this.topPageService.findByFirstCategory(dto);
  }

  @Get('searchByText/:text')
  async search(@Param('text') text: string) {
    return await this.topPageService.searchByText(text);
  }
}
