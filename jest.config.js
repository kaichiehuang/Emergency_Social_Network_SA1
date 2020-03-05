module.exports = {
  //line used for jsest-mongodb dependency
  //preset: '@shelf/jest-mongodb',
  clearMocks: true,
  coverageDirectory: "coverage",
  testMatch: [
    "**/test/**/*.js",
    '**/?(*.)+(spec|test).+(ts|tsx|js)',
  ],
  testEnvironment: 'node'
};
