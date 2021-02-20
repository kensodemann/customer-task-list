module.exports = {
  preset: 'jest-preset-angular',
  transform: {
    '^.+\\.(ts|js|html)$': 'ts-jest',
  },
  testPathIgnorePatterns: ['/node_modules/', '/plugins/'],
  transformIgnorePatterns: ['node_modules/(?!@ionic-native)'],
  moduleFileExtensions: ['ts', 'js', 'html'],
  moduleNameMapper: {
    '^@app/(.*)$': '<rootDir>/src/app/$1',
    '^@env/(.*)$': '<rootDir>/src/environments/$1',
    '^@test/(.*)$': '<rootDir>/test/$1',
  },
  collectCoverageFrom: [
    'src/app/**/*.{ts,tsx}',
    '!**/index.{ts,tsx}',
    '!**/*.mock.{ts,tsx}',
    '!**/*.module.{ts,tsx}',
    '!**/*.spec.{ts,tsx}',
  ],
  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/tsconfig.spec.json',
      diagnostics: false,
      stringifyContentPathRegex: '\\.html$',
      astTransformers: {
        before: [
          'jest-preset-angular/build/InlineFilesTransformer',
          'jest-preset-angular/build/StripStylesTransformer',
        ],
      },
    },
  },
  setupFilesAfterEnv: ['./src/test-setup.ts'],
};
