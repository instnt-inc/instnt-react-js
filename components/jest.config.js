/** @type {import('@jest/types').Config.InitialOptions} */
module.exports = {
  testEnvironment: 'jsdom',
  roots: ['<rootDir>/src'],
  testMatch: ['**/__tests__/**/*.test.{ts,tsx}'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  transform: {
    '^.+\\.tsx?$': ['ts-jest', {
      diagnostics: {
        ignoreDiagnostics: [2786, 6133],
      },
      tsconfig: {
        esModuleInterop: true,
        noUnusedLocals: false,
        noUnusedParameters: false,
      },
    }],
  },
};
