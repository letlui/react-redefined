module.exports = {
  name: 'typescript config',
  setupFilesAfterEnv: ['<rootDir>setup/setupTests.js'],
  transform: {
    '^.+\\.(t|j)sx?$': 'ts-jest',
  },
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.(ts?|tsx?)$',
  testURL: 'http://localhost/',
  testEnvironment: 'node',
  transformIgnorePatterns: [
    '\\\\node_modules\\\\',
  ],
};
