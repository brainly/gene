// @ts-check
import nextra from 'nextra';

const withNextra = nextra({
  theme: 'nextra-theme-docs',
  themeConfig: './theme.config.tsx',
  staticImage: true,
});

const config = withNextra({
  nx: { svgr: true },
  output: 'export',
  distDir: '../../dist/docs/docs-site/.next',
  images: { unoptimized: true },
});

export default config;
