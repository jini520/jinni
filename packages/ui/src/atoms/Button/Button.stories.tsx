import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';

const meta: Meta<typeof Button> = {
  title: 'Atoms/Button',
  component: Button,
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story  = { args: { variant: 'primary', children: 'Click me' } };
export const Ghost: Story    = { args: { variant: 'ghost',   children: 'Cancel' } };
export const Outline: Story  = { args: { variant: 'outline', children: 'Outline' } };
export const Small: Story    = { args: { size: 'sm', children: 'Small' } };
export const Large: Story    = { args: { size: 'lg', children: 'Large' } };
export const Disabled: Story = { args: { variant: 'primary', disabled: true, children: 'Disabled' } };
