import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ProductModel } from './product.model/product.model';
import { Model } from 'mongoose';
import { CreateProductDto } from './dto/create-product.dto';
import { FindProductDto } from './dto/find-product.dto.ts';
import { ReviewModel } from '../review/review.model';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(ProductModel.name)
    private readonly productModel: Model<ProductModel>,
  ) {}

  async create(dto: CreateProductDto) {
    return await this.productModel.create(dto);
  }

  async findById(id: string) {
    return await this.productModel.findById(id).exec();
  }

  async deleteById(id: string) {
    return await this.productModel.findByIdAndDelete(id).exec();
  }

  async updateById(id: string, dto: CreateProductDto) {
    return await this.productModel
      .findByIdAndUpdate(id, dto, { new: true })
      .exec();
  }

  // находит продукт вместе со всеми его отзывами
  async findWithReviews(dto: FindProductDto) {
    return (await this.productModel
      .aggregate([
        {
          $match: {
            categories: dto.category,
          }, // выбираем только нужные категории продуктов
        },
        {
          $sort: {
            _id: 1,
          },
        }, // сортируем для того что бы возвращались упорядоченные данные
        {
          $limit: dto.limit,
        }, // задаем лимит возвращаемых данных
        {
          $lookup: {
            from: 'reviewmodels', // название коллекции в которой мы будем искать
            localField: '_id', // значение которое мы ищем
            foreignField: 'productId', // поле в котором мы ищем это значение
            as: 'reviews', // алиас для названия поля результата
          },
        }, // подтягиваем из другой коллекции все то что сможем найти по совпадающему полю в данном случае productId: _id
        {
          $addFields: {
            reviewCount: { $size: '$reviews' }, // так как мы выше добавили поле review с помощью $lookup, то мы можем ссылаться на это поле через '$review'
            reviewAwg: { $avg: '$reviews.rating' },
            reviews: {
              $function: {
                //сдесь описана функция mongodb, первый параметр это сама функция в виде строки
                //второй параметр это массив аргументов и третий это язык
                body: `function (reviews) {
                  reviews.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                  return reviews;
                }`,
                args: ['$reviews'],
                lang: 'js',
              },
            },
          },
        }, // добавляем доп поля для детальной информации
      ])
      .exec()) as ProductModel &
      {
        review: ReviewModel[];
        reviewCount: number;
        reviewAwg: number;
      }[]; // привязка к типу дополнительных полей
  }
}
