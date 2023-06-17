import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Patch,
  Post,
  UsePipes,
  ValidationPipe,
  UseGuards,
} from '@nestjs/common';
import { IdValidationPipe } from 'src/pipes/id-validation.pipe';
import { CreateProductDto } from './dto/create-product.dto';
import { FindProductDto } from './dto/find-product.dto.ts';
import { NOT_FOUND_PRODUCT_ERROR } from './product.constants';
import { ProductModel } from './product.model/product.model';
import { ProductService } from './product.service';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { SearchProductsByTextDto } from './dto/search-products.dto';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}
  @Post('create')
  async create(@Body() dto: CreateProductDto) {
    return await this.productService.create(dto);
  }

  @UsePipes(new ValidationPipe())
  @Post('searchByText')
  async searchProductsByText(@Body() dto: SearchProductsByTextDto) {
    return this.productService.searchProductsByText(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async delete(@Param('id', IdValidationPipe) id: string) {
    return await this.productService.deleteById(id);
  }

  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  @Get(':id')
  async get(@Param('id', IdValidationPipe) id: string) {
    const product = await this.productService.findById(id);
    if (!product) {
      throw new NotFoundException(NOT_FOUND_PRODUCT_ERROR);
    } else {
      return product;
    }
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async put(
    @Param('id', IdValidationPipe) id: string,
    @Body() dto: ProductModel,
  ) {
    const product = await this.productService.updateById(id, dto);
    if (!product) {
      throw new NotFoundException(NOT_FOUND_PRODUCT_ERROR);
    } else {
      return product;
    }
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post('find')
  async find(@Body() dto: FindProductDto) {
    return this.productService.findWithReviews(dto);
  }
}
