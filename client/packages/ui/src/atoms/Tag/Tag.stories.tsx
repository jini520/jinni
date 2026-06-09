import type { Meta, StoryObj } from '@storybook/react';
import { Tag } from './Tag';

const meta: Meta<typeof Tag> = { title: 'Atoms/Tag', component: Tag, tags: ['autodocs'] };
export default meta;
type Story = StoryObj<typeof Tag>;

export const Default: Story = { args: { label: 'TypeScript' } };
export const Colored: Story = { args: { label: 'React', color: 'var(--color-blue)' } };
