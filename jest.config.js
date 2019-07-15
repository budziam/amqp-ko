module.exports = {
    preset: "ts-jest",
    reporters: ["default", "jest-junit"],
    setupFilesAfterEnv: ['<rootDir>/__tests__/setup.ts'],
    testMatch: ['<rootDir>/__tests__/**/*.test.ts'],
};
