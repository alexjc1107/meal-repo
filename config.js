"use strict";
exports.DATABASE_URL =
    process.env.DATABASE_URL || "mongodb://localhost:27017/meal-repo";
exports.TEST_DATABASE_URL =
    process.env.TEST_DATABASE_URL || "mongodb://localhost:27017/test-meal-repo";
exports.PORT = process.env.PORT || 8080;