import type { Meta, StoryObj } from '@storybook/react';
import { Badge } from './Badge';

const meta: Meta<typeof Badge> = { title: 'Atoms/Badge', component: Badge, tags: ['autodocs'] };
export default meta;
type Story = StoryObj<typeof Badge>;

export const Default: Story = { args: { label: 'internship' } };
export const Current: Story = { args: { label: 'current', variant: 'current' } };
export const Outline: Story = { args: { label: 'closed',  variant: 'outline' } };
