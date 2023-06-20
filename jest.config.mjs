/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
export default {
  preset: "ts-jest",
  // transform: {
  //   "^.+\\.[tj]sx?$": [
  //     "ts-jest",
  //     {
  //       // isolatedModules: true,
  //     },
  //   ],
  // },
  transformIgnorePatterns: ["node_modules/.pnpm/(?!nanoid)"],
  testEnvironment: "jsdom",
  setupFiles: ["./jest.setup.js"],
};
