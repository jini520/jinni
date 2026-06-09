import type { Meta, StoryObj } from '@storybook/react';
import { Chip } from './Chip';

const meta: Meta<typeof Chip> = { title: 'Molecules/Chip', component: Chip, tags: ['autodocs'] };
export default meta;
type Story = StoryObj<typeof Chip>;

export const TextOnly: Story = { args: { label: 'TypeScript' } };
export const WithAccent: Story = { args: { label: 'React', accent: 'var(--color-blue)' } };
