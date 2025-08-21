import {
  Controller,
  Post,
  Get,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
  Body,
  Query,
  Res,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiConsumes, ApiBody, ApiTags, ApiQuery } from '@nestjs/swagger';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { Response } from 'express';
import axios from 'axios';

@ApiTags('Image')
@Controller('image')
export class ImageController {
  constructor(private readonly cloudinaryService: CloudinaryService) {}

  @Post('upload')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary' },
        folder: { type: 'string', example: 'user_avatars' },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  uploadImage(@UploadedFile() file: Express.Multer.File, @Body('folder') folder?: string) {
    if (!file) throw new BadRequestException('File is required');
    return this.cloudinaryService.uploadFile(file, folder);
  }

  @Get('proxy-image')
  @ApiQuery({
    name: 'url',
    description: 'Cloudinary image URL',
    example: 'https://res.cloudinary.com/your-cloud-name/image/upload/v1234567890/sample.jpg',
    required: true,
  })
  async proxyImage(@Query('url') url: string, @Res() res: Response) {
    try {
      // Validate URL
      if (!url) {
        throw new BadRequestException('URL parameter is required');
      }

      // Validate if it's a Cloudinary URL
      if (!url.includes('cloudinary.com')) {
        throw new BadRequestException('Only Cloudinary URLs are allowed');
      }

      // Fetch image from Cloudinary
      const response = await axios({
        method: 'GET',
        url: url,
        responseType: 'stream',
        timeout: 10000, // 10 seconds timeout
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; NestJS-Proxy/1.0)',
        },
      });

      // Set appropriate headers
      res.set({
        'Content-Type': response.headers['content-type'] || 'image/jpeg',
        'Content-Length': response.headers['content-length'],
        'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
        'Access-Control-Allow-Origin': '*',
      });

      // Pipe the image stream to response
      response.data.pipe(res);
    } catch (error) {
      if (error.response?.status === 404) {
        throw new HttpException('Image not found', HttpStatus.NOT_FOUND);
      } else if (error.code === 'ECONNABORTED') {
        throw new HttpException('Request timeout', HttpStatus.REQUEST_TIMEOUT);
      } else if (error.code === 'ENOTFOUND') {
        throw new HttpException('Invalid URL or network error', HttpStatus.BAD_REQUEST);
      } else {
        console.error('Proxy image error:', error.message);
        throw new HttpException('Failed to fetch image', HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  }
}
