import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { Model } from 'mongoose';
import { PROJECT_MODEL } from '../providers/project.providers';
import { Project } from '../schemas/project.schema';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { PaginationQuery } from '../lib/pagination';

@Injectable()
export class ProjectsService {
  constructor(@Inject(PROJECT_MODEL) private readonly projectModel: Model<Project>) {}

  async create(createProjectDto: CreateProjectDto, userId: string): Promise<Project> {
    const createdProject = new this.projectModel({
      ...createProjectDto,
      skill: createProjectDto.skill || [],
      createdBy: userId,
    });
    return createdProject.save();
  }

  async findAll(query?: PaginationQuery) {
    const page = Math.max(1, Number(query?.page) || 1);
    const limit = Math.max(1, Number(query?.limit) || 10);
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.projectModel
        .find()
        .skip(skip)
        .limit(limit)
        .populate('createdBy', 'firstName lastName avatar')
        .lean()
        .exec(),
      this.projectModel.countDocuments(),
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

  async findOne(id: string): Promise<Project> {
    const project = await this.projectModel
      .findById(id)
      .populate('createdBy', 'firstName lastName avatar')
      .lean()
      .exec();
    if (!project) {
      throw new NotFoundException(`Project with ID "${id}" not found`);
    }
    return project;
  }

  async update(id: string, updateProjectDto: UpdateProjectDto): Promise<Project> {
    const updatedProject = await this.projectModel
      .findByIdAndUpdate(id, updateProjectDto, {
        new: true,
        runValidators: true,
      })
      .lean()
      .exec();
    if (!updatedProject) {
      throw new NotFoundException(`Project with ID "${id}" not found`);
    }
    return updatedProject;
  }

  async remove(id: string): Promise<Project> {
    const deletedProject = await this.projectModel.findByIdAndDelete(id).lean().exec();
    if (!deletedProject) {
      throw new NotFoundException(`Project with ID "${id}" not found`);
    }
    return deletedProject;
  }
}
