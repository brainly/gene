const withNextra = require('nextra')({
  theme: 'nextra-theme-docs',
  themeConfig: './theme.config.tsx',
  unstable_staticImage: true,
});
const nextConfig = {
  ...withNextra(),
  distDir: '../../dist/docs/docs-site/.next',
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;