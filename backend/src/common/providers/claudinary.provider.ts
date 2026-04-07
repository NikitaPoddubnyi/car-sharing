import { ConfigService } from '@nestjs/config';
import { getClaudinaryConfig } from 'src/config/claudinary.config';

export const CloudinaryProvider = {
  provide: 'CLOUDINARY', 
  useFactory: getClaudinaryConfig,
  inject: [ConfigService],
};