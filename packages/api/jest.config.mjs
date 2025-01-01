/** @type {import('ts-jest').JestConfigWithTsJest} */
export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: {
    '^@app/utils/(.*)$': '<rootDir>/../utils/src/$1', // Ajusta la ruta al paquete utils
    '^@app/(.*)$': '<rootDir>/../$1/src',
  },
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        useESM: true,
      },
    ],
  },
  extensionsToTreatAsEsm: ['.ts'],
  moduleFileExtensions: ['ts', 'js', 'json'],
  testMatch: ['**/src/**/__tests__/**/*.test.ts'],
  moduleDirectories: ['node_modules', 'src'],
  rootDir: '.',
};
