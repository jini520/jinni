import type { Meta, StoryObj } from '@storybook/react';
import { ProgressBar } from './ProgressBar';

const meta: Meta<typeof ProgressBar> = {
  title: 'Organisms/ProgressBar',
  component: ProgressBar,
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof ProgressBar>;

export const Default: Story = { args: {} };
export const CustomAccent: Story = {
  args: { accent: 'linear-gradient(90deg, var(--color-pink), var(--color-purple))' },
};
