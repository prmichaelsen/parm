// eslint-disable-next-line no-undef
module.exports = {
  name: 'function-image-host',
  preset: '../../jest.config.js',
  transform: {
    '^.+\\.[tj]sx?$': 'ts-jest',
  },
  testMatch: ['**/+(*.)+(spec|test|e2e).+(ts|js|e2e)?(x)'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'html','json'],
  coverageDirectory: '../../coverage/apps/demo-app',
  setupFiles: ['./src/environments/development.js']
};
