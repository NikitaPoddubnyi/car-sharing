import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import { CLOUDINARY_OPTIONS_SYMBOL } from 'src/common/providers/claudinary.provider';
const streamifier = require('streamifier');

@Injectable()
export class CloudinaryService {
  constructor(
    @Inject(CLOUDINARY_OPTIONS_SYMBOL)
    private readonly cloudinaryInstance: typeof cloudinary,
  ) {}

  async uploadFile(
    file: Express.Multer.File,
    folder: 'avatars' | 'vehicles' | 'licenses' = 'vehicles',
  ): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: folder,
          transformation:
            folder === 'avatars'
              ? [{ width: 400, height: 400, crop: 'fill', gravity: 'face' }]
              : folder === 'licenses'
                ? [{ width: 1200, height: 800, crop: 'limit' }]
                : [{ width: 820, height: 490, crop: 'limit' }],
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

  async uploadFiles(
    files: Express.Multer.File[],
    folder: 'cars' | 'bikes',
  ): Promise<UploadApiResponse[]> {
    const uploadPromises = files.map((file) => {
      return new Promise<UploadApiResponse>((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: folder,
            transformation: [{ width: 820, height: 490, crop: 'limit' }],
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
    });

    return Promise.all(uploadPromises);
  }

  async deleteFile(publicId: string) {
    return new Promise((resolve, reject) => {
      cloudinary.uploader.destroy(publicId, (error, result) => {
        if (error) return reject(error);

        if (result.result !== 'ok') {
          return reject(
            new BadRequestException(`Cloudinary: ${result.result}`),
          );
        }

        resolve(result);
      });
    });
  }
}
