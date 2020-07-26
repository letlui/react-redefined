module.exports = {
    name: "typescript config",
    transform: {
        '^.+\\.(t|j)sx?$': 'ts-jest'
    },
    testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.(ts?|tsx?)$',
    testURL: "http://localhost/",
    testEnvironment: "node",
    setupFilesAfterEnv: ["<rootDir>test/setup/setupTests.js"],
    transformIgnorePatterns: [
        "\\\\node_modules\\\\"
    ],
};
