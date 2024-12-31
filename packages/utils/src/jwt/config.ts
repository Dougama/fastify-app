export const jwtConfig = {
  secret: process.env.JWT_SECRET || 'ABC_XYZ_123_789',
  expiresIn: '1h',
  algorithm: 'HS256',
};
