import { Injectable, Inject, NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { FilterOrderDto } from './dto/filter-order.dto';
import { Model, Types } from 'mongoose';
import { ORDER_NAME_MODEL, Order, OrderItem } from 'src/schemas/order.schema';
import { PRODUCT_NAME_MODEL, Product } from 'src/schemas/products.schema';

export interface PaginationResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  nextPage: boolean;
  prePage: boolean;
}

@Injectable()
export class OrderService {
  constructor(
    @Inject(ORDER_NAME_MODEL) private readonly orderModel: Model<Order>,
    @Inject(PRODUCT_NAME_MODEL) private readonly productModel: Model<Product>,
  ) {}

  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    const { orderItems, ...orderData } = createOrderDto;

    // Validate products and calculate total amount
    let totalAmount = 0;
    const validatedOrderItems: OrderItem[] = [];

    for (const item of orderItems) {
      const product = await this.productModel.findById(item.productId).exec();
      if (!product) {
        throw new BadRequestException(`Product with ID "${item.productId}" not found`);
      }

      if (product.quantity < item.quantity) {
        throw new BadRequestException(
          `Insufficient stock for product "${product.title}". Available: ${product.quantity}, Requested: ${item.quantity}`,
        );
      }

      totalAmount += product.price * item.quantity;
      validatedOrderItems.push({
        productId: new Types.ObjectId(item.productId),
        quantity: item.quantity,
      });

      // Update product quantity
      await this.productModel.findByIdAndUpdate(item.productId, {
        $inc: { quantity: -item.quantity },
      });
    }

    const order = new this.orderModel({
      ...orderData,
      orderItems: validatedOrderItems,
      totalAmount,
      status: 'pending',
    });

    return order.save();
  }

  async findAll(filterDto?: FilterOrderDto): Promise<PaginationResult<Order>> {
    const { search, status, page, limit } = filterDto || {};

    // Build filter query
    const filter: any = {};

    if (search) {
      filter.$or = [
        { fullName: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
      ];
    }

    if (status) {
      filter.status = status;
    }

    // Pagination
    const pageNum = page || 1;
    const limitNum = limit || 10;
    const skip = (pageNum - 1) * limitNum;

    const [data, total] = await Promise.all([
      this.orderModel
        .find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .populate({
          path: 'orderItems.productId',
          select: 'title price thumbnail category',
          model: 'PRODUCTS',
        })
        .lean()
        .exec(),
      this.orderModel.countDocuments(filter),
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

  async findOne(id: string): Promise<Order> {
    const order = await this.orderModel
      .findById(id)
      .populate({
        path: 'orderItems.productId',
        select: 'title price thumbnail category',
        model: 'PRODUCTS',
      })
      .lean()
      .exec();

    if (!order) {
      throw new NotFoundException(`Order with ID "${id}" not found`);
    }
    return order;
  }

  async update(id: string, updateOrderDto: UpdateOrderDto): Promise<Order> {
    const updatedOrder = await this.orderModel
      .findByIdAndUpdate(id, updateOrderDto, {
        new: true,
        runValidators: true,
      })
      .populate({
        path: 'orderItems.productId',
        select: 'title price thumbnail category',
        model: 'PRODUCTS',
      })
      .lean()
      .exec();

    if (!updatedOrder) {
      throw new NotFoundException(`Order with ID "${id}" not found`);
    }
    return updatedOrder;
  }

  async updateStatus(id: string, status: string): Promise<Order> {
    const validStatuses = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      throw new BadRequestException(`Invalid status: ${status}`);
    }

    const updatedOrder = await this.orderModel
      .findByIdAndUpdate(id, { status }, { new: true, runValidators: true })
      .populate({
        path: 'orderItems.productId',
        select: 'title price thumbnail category',
        model: 'PRODUCTS',
      })
      .lean()
      .exec();

    if (!updatedOrder) {
      throw new NotFoundException(`Order with ID "${id}" not found`);
    }
    return updatedOrder;
  }

  async remove(id: string): Promise<Order> {
    const deletedOrder = await this.orderModel.findByIdAndDelete(id).lean().exec();
    if (!deletedOrder) {
      throw new NotFoundException(`Order with ID "${id}" not found`);
    }
    return deletedOrder;
  }

  async findByStatus(status: string): Promise<Order[]> {
    return this.orderModel
      .find({ status })
      .sort({ createdAt: -1 })
      .populate({
        path: 'orderItems.productId',
        select: 'title price thumbnail category',
        model: 'PRODUCTS',
      })
      .lean()
      .exec();
  }

  async getOrderStats(): Promise<any> {
    const stats = await this.orderModel.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalAmount: { $sum: '$totalAmount' },
        },
      },
    ]);

    const totalOrders = await this.orderModel.countDocuments();
    const totalRevenue = await this.orderModel.aggregate([
      { $group: { _id: null, total: { $sum: '$totalAmount' } } },
    ]);

    return {
      totalOrders,
      totalRevenue: totalRevenue[0]?.total || 0,
      statusBreakdown: stats,
    };
  }
}
