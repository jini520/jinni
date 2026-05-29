import type { Meta, StoryObj } from '@storybook/react';
import { Pill } from './Pill';

const meta: Meta<typeof Pill> = { title: 'Atoms/Pill', component: Pill, tags: ['autodocs'] };
export default meta;
type Story = StoryObj<typeof Pill>;

export const Default: Story = { args: { label: 'AVAILABLE' } };
export const WithDot: Story = { args: { label: 'OPEN TO WORK', dot: true } };
