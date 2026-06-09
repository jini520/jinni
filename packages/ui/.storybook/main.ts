import type { StorybookConfig } from '@storybook/react-vite';
import path from 'path';

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(tsx|ts)'],
  addons: ['@storybook/addon-essentials'],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  viteFinal: (config) => {
    config.css ??= {};
    config.css.preprocessorOptions ??= {};
    config.css.preprocessorOptions.scss ??= {};
    config.css.preprocessorOptions.scss.loadPaths = [
      path.resolve(__dirname, '../src/styles'),
    ];
    return config;
  },
};

export default config;
