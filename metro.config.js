const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Explicitly disable package exports resolution to ensure Convex works.
// Convex's CJS bundle uses internal relative requires (e.g., ../browser/index.js)
// that get blocked when Metro enforces the package's "exports" field.
config.resolver.unstable_enablePackageExports = false;

module.exports = config;
