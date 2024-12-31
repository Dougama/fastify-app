import jwt from 'jsonwebtoken';
import {jwtConfig} from './config';

export function generateToken(payload: object): string {
  return jwt.sign(payload, jwtConfig.secret, {
    expiresIn: jwtConfig.expiresIn,
    algorithm: jwtConfig.algorithm as jwt.Algorithm,
  });
}
