import jwt from 'jsonwebtoken';
import {jwtConfig} from './config';

export function verifyToken<T = object>(token: string): T {
  try {
    return jwt.verify(token, jwtConfig.secret, {
      algorithms: [jwtConfig.algorithm as jwt.Algorithm],
    }) as T;
  } catch (err) {
    throw new Error('Invalid or expired token');
  }
}
