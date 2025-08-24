import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
  Body,
  Res,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiConsumes, ApiBody, ApiTags } from '@nestjs/swagger';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { Response } from 'express';
import axios from 'axios';
import { ProxyImageDto } from './dto/proxy-image.dto';

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

  @Post('proxy-image-encoded')
  @ApiBody({ type: ProxyImageDto })
  async proxyImageEncoded(@Body() proxyImageDto: ProxyImageDto, @Res() res: Response) {
    const { encodedUrl } = proxyImageDto;
    try {
      // Validate encoded URL
      if (!encodedUrl) {
        throw new BadRequestException('Encoded URL parameter is required');
      }

      // Decode Base64 URL
      let url: string;
      try {
        url = Buffer.from(encodedUrl, 'base64').toString('utf-8');
      } catch (error) {
        throw new BadRequestException('Invalid Base64 encoding');
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
