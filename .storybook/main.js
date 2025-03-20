const { join } = require('path');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

module.exports = {
  core: {
    builder: 'webpack5',
  },
  addons: [
    '@storybook/addon-knobs',
    '@storybook/addon-actions',
    '@storybook/addon-backgrounds',
    '@storybook/addon-viewport',
    '@storybook/addon-storysource',
    join(__dirname, './events/register.jsx'),
    '@storybook/addon-links',
    'storybook-addon-next-router',
  ],
  previewHead: (head) => `
    ${head}
    <link href="brainly-style-guide/css/style-guide.css" rel="stylesheet"/>
    <script src="brainly-style-guide/images/icons.js" defer></script>
    <script src="brainly-style-guide/images/subjects-icons.js" defer></script>
    <script src="brainly-style-guide/images/subjects-mono-icons.js" defer></script>
    <script src="brainly-style-guide/images/math-symbols-icons.js" defer></script>
    <script src="brainly-style-guide/images/mobile-icons.js" defer></script>
    <script>
      window.jsData = {
        styleGuideAssets: {
          logo: {
            big: 'brainly-style-guide/images/logos/brainly-5c4a769505.svg',
            plus:
              'brainly-style-guide/images/logos/brainly-plus-0768e10846.svg',
            small:
              'brainly-style-guide/images/logos/brainly-mobile-6879551770.svg',
          },
        },
      };
    </script>
  `,
  managerHead: (head) => `
    ${head}
    <link rel="icon" type="image/x-icon" href="brainly-style-guide/images/favicons/brainly/favicon.ico">
    <link rel="icon" sizes="192x192" href="brainly-style-guide/images/favicons/brainly/favicon-hd.png">
    <meta name="theme-color" content="#ffffff">
  `,

  env: (config) => ({
    ...config,
    NEXT_PUBLIC_ENV: 'local',
  }),

  webpackFinal: async (config) => {
    // removes default file-loader
    const rules = config.module.rules.filter(
      (rule) => !rule.loader || !rule.loader.includes('file-loader'),
    );

    const tsPaths = new TsconfigPathsPlugin({
      configFile: './tsconfig.base.json',
    });

    return {
      ...config,
      node: {
        __dirname: true,
        __filename: true,
      },
      resolve: {
        ...config.resolve,
        extensions: ['.mjs', '.ts', '.tsx', '.js', '.jsx'],
        plugins: [...(config.resolve.plugins ?? []), tsPaths],
        fallback: {
          ...(config.resolve || {}).fallback,
          fs: false,
          stream: false,
          os: false,
          zlib: false,
        },
      },
      module: {
        ...config.module,
        rules: [
          {
            test: /\.tsx?$/,
            use: [
              {
                loader: require.resolve('babel-loader'),
                options: {
                  rootMode: 'upward',
                  presets: [
                    // runtime is automatic by default in babel 8+
                    ['@babel/preset-react', {runtime: 'automatic'}],
                    [
                      '@nx/react/babel',
                      {runtime: 'automatic', useBuiltIns: 'usage'},
                    ],
                  ],
                },
              },
            ],
            enforce: 'pre',
          },
          ...rules,
          {
            test: /\.scss$/,
            use: [
              'style-loader',
              {
                loader: 'css-loader',
                options: {
                  modules: {
                    localIdentName: '[name]__[local]___[hash:base64:5]',
                  },
                },
              },
              'sass-loader',
            ],
          },
          {
            test: /\.svg$/,
            exclude: /node_modules/,
            use: 'svg-inline-loader/?classPrefix=_[hash:4]__',
          },
          {
            test: /\.(jpe?g|png|gif)$/i,
            use: [
              {
                loader: 'file-loader',
                options: {
                  name: '[name].[hash:8].[ext]',
                },
              },
            ],
            type: 'javascript/auto',
          },
          {
            test: /\.mjs$/,
            include: /node_modules/,
            type: 'javascript/auto',
          },
        ],
      },
    };
  },
};
