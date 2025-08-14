import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { Model } from 'mongoose';
import { CONTACT_MODEL } from '../providers/contact.providers';
import { Contact } from '../schemas/contact.schema';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { PaginationQuery } from '../lib/pagination';

@Injectable()
export class ContactService {
  constructor(@Inject(CONTACT_MODEL) private readonly contactModel: Model<Contact>) {}

  async create(createContactDto: CreateContactDto): Promise<Contact> {
    const createdContact = new this.contactModel(createContactDto);
    return createdContact.save();
  }

  async findAll(query?: PaginationQuery) {
    const page = Math.max(1, Number(query?.page) || 1);
    const limit = Math.max(1, Number(query?.limit) || 10);
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.contactModel.find().skip(skip).limit(limit).sort({ createdAt: -1 }).lean().exec(),
      this.contactModel.countDocuments(),
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

  async findOne(id: string): Promise<Contact> {
    const contact = await this.contactModel.findById(id).lean().exec();
    if (!contact) {
      throw new NotFoundException(`Contact with ID "${id}" not found`);
    }
    return contact;
  }

  async update(id: string, updateContactDto: UpdateContactDto): Promise<Contact> {
    const updatedContact = await this.contactModel
      .findByIdAndUpdate(id, updateContactDto, {
        new: true,
        runValidators: true,
      })
      .lean()
      .exec();
    if (!updatedContact) {
      throw new NotFoundException(`Contact with ID "${id}" not found`);
    }
    return updatedContact;
  }

  async remove(id: string): Promise<Contact> {
    const deletedContact = await this.contactModel.findByIdAndDelete(id).lean().exec();
    if (!deletedContact) {
      throw new NotFoundException(`Contact with ID "${id}" not found`);
    }
    return deletedContact;
  }
}
