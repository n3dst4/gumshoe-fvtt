/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
export default {
  // preset: "ts-jest",
  transform: {
    "^.+\\.tsx?$": [
      "ts-jest",
      {
        // isolatedModules: true,
      },
    ],
  },
  testEnvironment: "jsdom",
  setupFiles: ["./jest.setup.js"],
};
