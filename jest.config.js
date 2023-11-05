/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',  
  testEnvironment: 'jsdom',
  roots: ['<rootDir>/test'],  
  setupFilesAfterEnv: ["<rootDir>/setupTests.ts"],
};