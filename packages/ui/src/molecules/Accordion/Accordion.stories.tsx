import type { Meta, StoryObj } from '@storybook/react';
import { Accordion } from './Accordion';

const meta: Meta<typeof Accordion> = {
  title: 'Molecules/Accordion',
  component: Accordion,
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof Accordion>;

export const Closed: Story = {
  args: { title: '주요 업무', children: '서비스 개발 및 유지보수' },
};
export const Open: Story = {
  args: { title: '주요 업무', children: '서비스 개발 및 유지보수', defaultOpen: true },
};
