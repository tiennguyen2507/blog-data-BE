import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { Model } from 'mongoose';
import { POST_MODEL } from '../providers/post.providers';
import { Post } from '../schemas/post.schema';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { paginate, PaginationQuery, PaginationResult } from '../lib/pagination';

@Injectable()
export class PostsService {
  constructor(@Inject(POST_MODEL) private readonly postModel: Model<Post>) {}

  async create(createPostDto: CreatePostDto): Promise<Post> {
    const createdPost = new this.postModel(createPostDto);
    return createdPost.save();
  }

  async findAll(query?: PaginationQuery): Promise<PaginationResult<Post>> {
    return paginate<Post>(this.postModel, query);
  }

  async findOne(id: string): Promise<Post> {
    const post = await this.postModel.findById(id).lean().exec();
    if (!post) {
      throw new NotFoundException(`Post with ID "${id}" not found`);
    }
    return post;
  }

  async update(id: string, updatePostDto: UpdatePostDto): Promise<Post> {
    const updatedPost = await this.postModel
      .findByIdAndUpdate(id, updatePostDto, {
        new: true,
        runValidators: true,
      })
      .lean()
      .exec();
    if (!updatedPost) {
      throw new NotFoundException(`Post with ID "${id}" not found`);
    }
    return updatedPost;
  }

  async remove(id: string): Promise<Post> {
    const deletedPost = await this.postModel
      .findByIdAndDelete(id)
      .lean()
      .exec();
    if (!deletedPost) {
      throw new NotFoundException(`Post with ID "${id}" not found`);
    }
    return deletedPost;
  }
}
