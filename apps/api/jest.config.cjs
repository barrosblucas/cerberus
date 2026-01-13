/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: "node",
  rootDir: ".",
  testRegex: ".*.spec.ts$",
  transform: { "^.+.(t|j)s$": ["ts-jest", { tsconfig: "tsconfig.json" }] },
  moduleNameMapper: {
    "^@repo/(.*)$": "<rootDir>/../../packages/$1/src",
  },
};
