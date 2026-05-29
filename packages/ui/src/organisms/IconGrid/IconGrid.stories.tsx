import type { Meta, StoryObj } from '@storybook/react';
import { IconGrid } from './IconGrid';

const meta: Meta<typeof IconGrid> = {
  title: 'Organisms/IconGrid',
  component: IconGrid,
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof IconGrid>;

export const Default: Story = {
  args: {
    rows: [
      {
        label: 'Frontend',
        subLabel: 'WEB',
        items: [
          { name: 'React',      accent: 'var(--color-blue)' },
          { name: 'TypeScript', accent: 'var(--color-indigo)' },
          { name: 'Next.js',    accent: 'var(--color-text)' },
        ],
      },
      {
        label: '백엔드',
        subLabel: 'BACKEND',
        items: [
          { name: 'Spring Boot', accent: 'var(--color-green)' },
          { name: 'PostgreSQL',  accent: 'var(--color-blue)' },
        ],
      },
    ],
  },
};
