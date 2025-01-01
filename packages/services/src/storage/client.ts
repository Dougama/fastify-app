import logger from '@app/utils/logger.js';
import {Storage} from '@google-cloud/storage';

let storageClient: Storage | null = null;

class MockStorage {
  bucket(name: string) {
    return {
      file: (fileName: string) => ({
        save: async (buffer: Buffer, options: any) => {
          console.log(`Mock save file ${fileName} to bucket ${name}`);
          return Promise.resolve();
        },
        bucket: {
          name: name
        }
      })
    };
  }
}

export const getStorageClient = () => {
  try {
    if (process.env.NODE_ENV === 'staging') {
      return new MockStorage() as unknown as Storage;
    }

    if (!storageClient) {
      storageClient = new Storage();
    }
    return storageClient;
  } catch (error) {
    logger.error('Error al inicializar el cliente de Storage:', error);
    throw error;
  }
};
