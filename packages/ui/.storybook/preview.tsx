import type { Preview } from '@storybook/react';
import '../src/styles/index.scss';

const preview: Preview = {
  globalTypes: {
    theme: {
      description: 'Theme',
      toolbar: {
        title: 'Theme',
        items: ['light', 'dark'],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: {
    theme: 'dark',
  },
  decorators: [
    (Story, context) => (
      <div
        data-theme={context.globals.theme ?? 'dark'}
        style={{ padding: '2rem', minHeight: '100vh', background: 'var(--color-bg)', color: 'var(--color-text)' }}
      >
        <Story />
      </div>
    ),
  ],
};

export default preview;
