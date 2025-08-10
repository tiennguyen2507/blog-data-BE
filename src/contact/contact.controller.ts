import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ValidationPipe,
  UsePipes,
  Query,
  // UseGuards,
} from '@nestjs/common';
import { ContactService } from './contact.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { ApiTags } from '@nestjs/swagger';
import { PaginationQueryDto } from '../lib/pagination';
// import { AuthGuard } from 'src/auth/auth.guard';

@ApiTags('Contact')
@Controller('contact')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
  async create(@Body() createContactDto: CreateContactDto) {
    return this.contactService.create(createContactDto);
  }

  // @UseGuards(AuthGuard)
  @Get()
  findAll(@Query() query: PaginationQueryDto) {
    return this.contactService.findAll(query);
  }

  // @UseGuards(AuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.contactService.findOne(id);
  }

  // @UseGuards(AuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateContactDto: UpdateContactDto) {
    return this.contactService.update(id, updateContactDto);
  }

  // @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.contactService.remove(id);
  }
}
