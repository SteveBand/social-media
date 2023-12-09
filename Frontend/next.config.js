/** @type {import('next').NextConfig} */
const path = require("path");
const nextConfig = {
  reactStrictMode: true,
  sassOptions: {
    includePaths: [path.join(__dirname, "styles")],
  },
  // webpack: (config) => {
  //   config.resolve.fallback = {
  //     "mongodb-client-encryption": false,
  //     aws4: false,
  //   };
  //   return config;
  // },
};

module.exports = nextConfig;
