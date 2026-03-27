// src/cloudinary/cloudinary.service.ts
import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';

@Injectable()
export class CloudinaryService {
  async uploadPdf(file: Express.Multer.File): Promise<string> {
    return new Promise((resolve, reject) => {
      // Cloudinary không nhận buffer trực tiếp
      // phải convert sang stream
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'cv', // lưu vào folder 'cv' trên Cloudinary
          resource_type: 'raw', // 'raw' vì là PDF, không phải image
          format: 'pdf',
        },
        (error, result) => {
          // eslint-disable-next-line @typescript-eslint/prefer-promise-reject-errors
          if (error) reject(error);
          else if (!result) reject(new Error('Upload failed'));
          else resolve(result.secure_url);
        },
      );

      // Convert buffer → stream rồi pipe vào uploadStream
      const readable = new Readable();
      readable.push(file.buffer);
      readable.push(null);
      readable.pipe(uploadStream);
    });
  }
}
