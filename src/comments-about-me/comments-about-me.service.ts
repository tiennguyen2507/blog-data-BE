import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { Model } from 'mongoose';
import { COMMENTS_ABOUT_ME_MODEL } from '../providers/comments-about-me.providers';
import { CommentsAboutMe } from '../schemas/comments-about-me.schema';
import { CreateCommentsAboutMeDto } from './dto/create-comments-about-me.dto';
import { UpdateCommentsAboutMeDto } from './dto/update-comments-about-me.dto';
import {
  PaginationQueryDto,
  paginate,
  PaginationResult,
} from '../lib/pagination';

@Injectable()
export class CommentsAboutMeService {
  constructor(
    @Inject(COMMENTS_ABOUT_ME_MODEL)
    private readonly commentsAboutMeModel: Model<CommentsAboutMe>,
  ) {}

  async create(createDto: CreateCommentsAboutMeDto): Promise<CommentsAboutMe> {
    const created = new this.commentsAboutMeModel(createDto);
    return created.save();
  }

  async findAll(
    query: PaginationQueryDto,
  ): Promise<PaginationResult<CommentsAboutMe>> {
    return paginate<CommentsAboutMe>(
      this.commentsAboutMeModel,
      query,
      {},
      null,
      { sort: { createdAt: -1 } },
    );
  }

  async findOne(id: string): Promise<CommentsAboutMe> {
    const comment = await this.commentsAboutMeModel.findById(id).lean().exec();
    if (!comment) {
      throw new NotFoundException(`Comment with ID "${id}" not found`);
    }
    return comment;
  }

  async update(
    id: string,
    updateDto: UpdateCommentsAboutMeDto,
  ): Promise<CommentsAboutMe> {
    const updated = await this.commentsAboutMeModel
      .findByIdAndUpdate(id, updateDto, { new: true, runValidators: true })
      .lean()
      .exec();
    if (!updated) {
      throw new NotFoundException(`Comment with ID "${id}" not found`);
    }
    return updated;
  }

  async remove(id: string): Promise<CommentsAboutMe> {
    const deleted = await this.commentsAboutMeModel
      .findByIdAndDelete(id)
      .lean()
      .exec();
    if (!deleted) {
      throw new NotFoundException(`Comment with ID "${id}" not found`);
    }
    return deleted;
  }
}
