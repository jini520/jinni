import type { Meta, StoryObj } from '@storybook/react';
import { Card } from './Card';

const meta: Meta<typeof Card> = { title: 'Organisms/Card', component: Card, tags: ['autodocs'] };
export default meta;
type Story = StoryObj<typeof Card>;

export const Default: Story = {
  args: {
    accent: 'var(--color-pink)',
    onClick: undefined,
    children: (
      <div style={{ minHeight: 200, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-pink)' }}>01</span>
        <div style={{ fontSize: '1.5rem', fontWeight: 600 }}>Project Title</div>
      </div>
    ),
  },
};
export const Clickable: Story = {
  args: { ...Default.args, onClick: () => {} },
};
