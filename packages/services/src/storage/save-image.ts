import {logger} from '@app/utils/logger.js';
import {getStorageClient} from './client';

export const publicImageUrl = async (base64Image: string, userId: string) => {
  if (!base64Image) {
    logger.warn(
      'Se intentó guardar una foto sin proporcionar una imagen base64'
    );
    return null;
  }

  const matches = base64Image.match(/^data:image\/([A-Za-z-+/]+);base64,(.+)$/);

  if (!matches || matches.length !== 3) {
    logger.warn('Se proporcionó una imagen base64 con formato inválido');
    return null;
  }

  const imageType = matches[1];
  const buffer = Buffer.from(matches[2], 'base64');
  const fileName = `app/profile/photo/${userId}`;

  const storage = getStorageClient();
  const file = storage.bucket('fastify-app').file(fileName);

  await file.save(buffer, {
    metadata: {
      contentType: `image/${imageType}`,
    },
  });

  return `https://storage.googleapis.com/${file.bucket.name}/${fileName}`;
};
