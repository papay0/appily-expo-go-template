const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Store the original resolver
const originalResolveRequest = config.resolver.resolveRequest;

// Override resolver to mock convex/server (server-only module that crashes in React Native)
config.resolver.resolveRequest = (context, moduleName, platform) => {
  // Mock convex/server and all its submodules
  if (moduleName === 'convex/server' || moduleName.startsWith('convex/server/')) {
    return {
      type: 'empty',
    };
  }

  // Use original resolver for everything else
  if (originalResolveRequest) {
    return originalResolveRequest(context, moduleName, platform);
  }
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
