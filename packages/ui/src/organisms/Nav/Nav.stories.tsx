import type { Meta, StoryObj } from '@storybook/react';
import { Nav } from './Nav';

const meta: Meta<typeof Nav> = { title: 'Organisms/Nav', component: Nav, tags: ['autodocs'] };
export default meta;
type Story = StoryObj<typeof Nav>;

const links = [
  { label: 'About',    href: '#about' },
  { label: 'Skills',   href: '#skills' },
  { label: 'Projects', href: '#projects' },
  { label: 'Career',   href: '#career' },
];

export const Dark: Story  = { args: { links, theme: 'dark' } };
export const Light: Story = { args: { links, theme: 'light' } };
export const WithToggle: Story = {
  args: { links, theme: 'dark', onToggleTheme: () => {} },
};
