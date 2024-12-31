import logger from '@app/utils/logger.js';
import {Storage} from '@google-cloud/storage';

let storageClient: Storage | null = null;

export const getStorageClient = () => {
  try {
    if (!storageClient) {
      storageClient = new Storage();
    }
    return storageClient;
  } catch (error) {
    logger.error('Error al inicializar el cliente de Storage:', error);
    throw error;
  }
};
