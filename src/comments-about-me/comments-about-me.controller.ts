import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ApiTags, ApiQuery } from '@nestjs/swagger';
import { CommentsAboutMeService } from './comments-about-me.service';
import { CreateCommentsAboutMeDto } from './dto/create-comments-about-me.dto';
import { UpdateCommentsAboutMeDto } from './dto/update-comments-about-me.dto';
import { PaginationQueryDto } from '../lib/pagination';

@ApiTags('CommentsAboutMe')
@Controller('comments-about-me')
export class CommentsAboutMeController {
  constructor(private readonly service: CommentsAboutMeService) {}

  @Post()
  create(@Body() createDto: CreateCommentsAboutMeDto) {
    return this.service.create(createDto);
  }

  @Get()
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  findAll(@Query() query: PaginationQueryDto) {
    return this.service.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDto: UpdateCommentsAboutMeDto) {
    return this.service.update(id, updateDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
