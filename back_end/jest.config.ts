import type { Config } from "jest";

const config: Config = {
  preset: "ts-jest",
  testEnvironment: "node",
  setupFilesAfterEnv: ["<rootDir>/tests/setup.ts"],
  testMatch: ["<rootDir>/tests/unit/**/*.test.ts"],
  clearMocks: true,
  collectCoverageFrom: [
    "src/modules/**/*.ts",
    "src/common/**/*.ts",
    "src/middlewares/**/*.ts",
    "!src/**/*.types.ts",
    "!src/**/index.ts",
    "!src/modules/**/*.repository.ts",
    "!src/modules/**/*.route.ts",
  ],
  coverageDirectory: "coverage",
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  transform: {
    "^.+\\.tsx?$": [
      "ts-jest",
      {
        tsconfig: "tsconfig.jest.json",
      },
    ],
  },
};

export default config;
