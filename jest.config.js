module.exports = {
  clearMocks: true,
  coverageDirectory: "coverage",
  coverageProvider: "v8",
  testPathIgnorePatterns: [
    "\\\\node_modules\\\\",
    "<rootDir>/cypress/",
  ],
  setupFilesAfterEnv: ['./test/helpers.js'],
};
