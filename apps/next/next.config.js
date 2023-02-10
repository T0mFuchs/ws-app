const isDev = process.env.NODE_ENV === "development";

const unoCSS = require('@unocss/webpack').default;

/** @type {import('next').NextConfig} */
const nextConfig = {
  swcMinify: true,
  reactStrictMode: true,
  webpack: (config, { isServer }) => {
    // * https://webpack.js.org/configuration/cache/
    // disable cache for hmr to work with unocss
    config.cache = isDev ? false : true;
    config.plugins.push(
      unoCSS(),
    );
    config.experiments = {
      ...config.experiments,
      topLevelAwait: true,
    };
    if (!isDev && !isServer) {
      config.resolve.alias = {
        ...config.resolve.alias,
        "react/jsx-runtime.js": "preact/compat/jsx-runtime",
        react: "preact/compat",
        "react-dom/test-utils": "preact/test-utils",
        "react-dom": "preact/compat",
      };
    };
    return config;
  },
  env: {
    API_URL: process.env.API_URL,
  },
  experimental: {
    transpilePackages: ['@unocss/core', "@packages/types"],
  }
};

module.exports = nextConfig;