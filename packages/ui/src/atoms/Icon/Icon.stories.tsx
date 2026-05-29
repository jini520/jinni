import type { Meta, StoryObj } from '@storybook/react';
import { Icon } from './Icon';

const meta: Meta<typeof Icon> = { title: 'Atoms/Icon', component: Icon, tags: ['autodocs'] };
export default meta;
type Story = StoryObj<typeof Icon>;

const SVG_SRC = "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'><circle cx='12' cy='12' r='10' fill='%23007AFF'/></svg>";

export const Default: Story = { args: { src: SVG_SRC, alt: 'circle', size: 32 } };
export const Small: Story   = { args: { src: SVG_SRC, alt: 'circle', size: 16 } };
export const Large: Story   = { args: { src: SVG_SRC, alt: 'circle', size: 48 } };
