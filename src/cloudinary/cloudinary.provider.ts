import { v2 as cloudinary } from 'cloudinary';

export const CloudinaryProvider = {
  provide: 'CLOUDINARY',
  useFactory: () => {
    return cloudinary.config({
      cloud_name: 'daqwg8oql',
      api_key: '571933744629575',
      api_secret: 'uhLQSxv2s0VGCVsIVT7c6LDvs1U',
    });
  },
};
