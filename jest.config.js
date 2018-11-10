module.exports = {
  transform: {
    '^.+\\.(js|jsx)$': './node_modules/babel-jest',
  },
  roots: ['<rootDir>/test'],
  setupTestFrameworkScriptFile: '<rootDir>/test/setupEnzyme.js',
  transformIgnorePatterns: ['[/\\\\]node_modules[/\\\\].+\\.(js|jsx)$'],
  moduleFileExtensions: ['js', 'json', 'jsx'],
};
