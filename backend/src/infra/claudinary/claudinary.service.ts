import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary';
import { UploadApiResponse, UploadApiErrorResponse } from 'cloudinary';
const streamifier = require('streamifier');

@Injectable()
export class CloudinaryService {
  constructor(private readonly configService: ConfigService) {
    cloudinary.config({
      cloud_name: this.configService.getOrThrow<string>('CLOUDINARY_NAME'),
      api_key: this.configService.getOrThrow<string>('CLOUDINARY_API_KEY'),
      api_secret: this.configService.getOrThrow<string>(
        'CLOUDINARY_API_SECRET',
      ),
    });
  }

  async uploadFile(
    file: Express.Multer.File,
    folder: 'avatars' | 'products' = 'products',
  ): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: folder,
          transformation:
            folder === 'avatars'
              ? [{ width: 400, height: 400, crop: 'fill', gravity: 'face' }]
              : [{ width: 1000, height: 1000, crop: 'limit' }],
        },
        (error, result) => {
          if (error) return reject(error);
          if (!result)
            return reject(new Error('Cloudinary result is undefined'));
          resolve(result);
        },
      );

      streamifier.createReadStream(file.buffer).pipe(uploadStream);
    });
  }
}
