import type { Config } from "jest";

const config: Config = {
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/tests/setup.ts"],
  transform: {
    "^.+\\.tsx?$": ["ts-jest", { tsconfig: "tsconfig.test.json" }]
  },
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json"],
  moduleNameMapper: {
    // mock CSS modules (if any imports)
    "\\.(css|less|scss|sass)$": "identity-obj-proxy"
  }
  // optional: make test discovery explicit
  // testMatch: ["<rootDir>/src/**/*.test.(ts|tsx)", "<rootDir>/tests/**/*.test.(ts|tsx)"],
};

export default config;
