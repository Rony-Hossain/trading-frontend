import nextJest from 'next/jest.js'

const createJestConfig = nextJest({ dir: './' })

const customJestConfig = {
  displayName: 'trading-web',
  moduleDirectories: ['node_modules', '<rootDir>/'],
  setupFilesAfterEnv: ['<rootDir>/tests/setup-tests.ts'],
  testEnvironment: 'jsdom',
}

export default createJestConfig(customJestConfig)
