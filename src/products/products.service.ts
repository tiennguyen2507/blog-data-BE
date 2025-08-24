import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { FilterProductDto } from './dto/filter-product.dto';
import { Model } from 'mongoose';
import { PRODUCT_NAME_MODEL, Product } from 'src/schemas/products.schema';
import { PaginationResult } from '../lib/pagination';

@Injectable()
export class ProductsService {
  constructor(@Inject(PRODUCT_NAME_MODEL) private readonly productsModel: Model<Product>) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const createdProduct = new this.productsModel(createProductDto);
    return createdProduct.save();
  }

  async findAll(filterDto?: FilterProductDto): Promise<PaginationResult<Product>> {
    const { search, category, sortBy, sortOrder, page, limit } = filterDto || {};

    // Build filter query
    const filter: any = {};

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    if (category) {
      filter.category = category;
    }

    // Build sort query
    const sort: any = {};
    if (sortBy) {
      sort[sortBy] = sortOrder === 'desc' ? -1 : 1;
    } else {
      sort.createdAt = -1; // Default sort by newest
    }

    // Simple pagination without using the paginate function
    const pageNum = page || 1;
    const limitNum = limit || 10;
    const skip = (pageNum - 1) * limitNum;

    const [data, total] = await Promise.all([
      this.productsModel.find(filter).sort(sort).skip(skip).limit(limitNum).lean().exec(),
      this.productsModel.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(total / limitNum);
    return {
      data,
      total,
      page: pageNum,
      limit: limitNum,
      nextPage: pageNum < totalPages,
      prePage: pageNum > 1,
    };
  }

  async findOne(id: string): Promise<Product> {
    const product = await this.productsModel.findById(id).lean().exec();
    if (!product) {
      throw new NotFoundException(`Product with ID "${id}" not found`);
    }
    return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto): Promise<Product> {
    const updatedProduct = await this.productsModel
      .findByIdAndUpdate(id, updateProductDto, {
        new: true,
        runValidators: true,
      })
      .lean()
      .exec();
    if (!updatedProduct) {
      throw new NotFoundException(`Product with ID "${id}" not found`);
    }
    return updatedProduct;
  }

  async remove(id: string): Promise<Product> {
    const deletedProduct = await this.productsModel.findByIdAndDelete(id).lean().exec();
    if (!deletedProduct) {
      throw new NotFoundException(`Product with ID "${id}" not found`);
    }
    return deletedProduct;
  }

  async findByCategory(category: string): Promise<Product[]> {
    return this.productsModel.find({ category }).lean().exec();
  }

  async findTopSelling(limit: number = 10): Promise<Product[]> {
    return this.productsModel.find().sort({ sales: -1 }).limit(limit).lean().exec();
  }

  async updateQuantity(id: string, quantity: number): Promise<Product> {
    const updatedProduct = await this.productsModel
      .findByIdAndUpdate(id, { quantity }, { new: true, runValidators: true })
      .lean()
      .exec();

    if (!updatedProduct) {
      throw new NotFoundException(`Product with ID "${id}" not found`);
    }
    return updatedProduct;
  }

  async incrementSales(id: string, increment: number = 1): Promise<Product> {
    const updatedProduct = await this.productsModel
      .findByIdAndUpdate(id, { $inc: { sales: increment } }, { new: true, runValidators: true })
      .lean()
      .exec();

    if (!updatedProduct) {
      throw new NotFoundException(`Product with ID "${id}" not found`);
    }
    return updatedProduct;
  }
}
