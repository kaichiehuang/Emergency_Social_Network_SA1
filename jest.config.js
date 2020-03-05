module.exports = {
  preset: '@shelf/jest-mongodb',
  clearMocks: true,
  coverageDirectory: "coverage",
  testMatch: [
    "**/test/**/*.js",
    '**/?(*.)+(spec|test).+(ts|tsx|js)',
  ]
};
