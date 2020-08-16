module.exports = {
  name: 'babel config',
  setupFilesAfterEnv: ['<rootDir>setup/setupTests.js'],
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.(js?|jsx?)$',
  testURL: 'http://localhost/',
  testEnvironment: 'node',
  transformIgnorePatterns: [
    '\\\\node_modules\\\\',
  ],
  modulePathIgnorePatterns: ['/lib'],
};
