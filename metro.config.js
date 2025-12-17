const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Explicitly disable package exports resolution to ensure Convex works.
// Convex's CJS bundle uses internal relative requires (e.g., ../browser/index.js)
// that get blocked when Metro enforces the package's "exports" field.
config.resolver.unstable_enablePackageExports = false;

// Prefer ESM over CJS - ESM builds have cleaner import resolution
config.resolver.resolverMainFields = ['react-native', 'browser', 'module', 'main'];

// Ensure Metro watches node_modules for changes (helps with Convex _generated)
config.watchFolders = config.watchFolders || [];

module.exports = config;
