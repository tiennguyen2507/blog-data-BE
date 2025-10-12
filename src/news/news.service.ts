import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { Model } from 'mongoose';
import { NEWS_MODEL } from '../providers/news.providers';
import { News } from '../schemas/news.schema';
import { CreateNewsDto } from './dto/create-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';
import { PaginationQuery } from '../lib/pagination';

@Injectable()
export class NewsService {
  constructor(@Inject(NEWS_MODEL) private readonly newsModel: Model<News>) {}

  async create(createNewsDto: CreateNewsDto): Promise<News> {
    const createdNews = new this.newsModel(createNewsDto);
    return createdNews.save();
  }

  async findAll(query?: PaginationQuery) {
    const page = Math.max(1, Number(query?.page) || 1);
    const limit = Math.max(1, Number(query?.limit) || 10);
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.newsModel.find().skip(skip).limit(limit).lean().exec(),
      this.newsModel.countDocuments(),
    ]);

    return {
      data,
      total,
      page,
      limit,
      nextPage: page < Math.ceil(total / limit),
      prePage: page > 1,
    };
  }

  async findOne(id: string): Promise<News> {
    const news = await this.newsModel.findById(id).lean().exec();
    if (!news) {
      throw new NotFoundException(`News with ID "${id}" not found`);
    }
    return news;
  }

  async update(id: string, updateNewsDto: UpdateNewsDto): Promise<News> {
    const updatedNews = await this.newsModel
      .findByIdAndUpdate(id, updateNewsDto, {
        new: true,
        runValidators: true,
      })
      .lean()
      .exec();
    if (!updatedNews) {
      throw new NotFoundException(`News with ID "${id}" not found`);
    }
    return updatedNews;
  }

  async remove(id: string): Promise<News> {
    const deletedNews = await this.newsModel.findByIdAndDelete(id).lean().exec();
    if (!deletedNews) {
      throw new NotFoundException(`News with ID "${id}" not found`);
    }
    return deletedNews;
  }
}
