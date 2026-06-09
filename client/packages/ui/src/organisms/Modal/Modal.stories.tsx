'use client';
import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Modal } from './Modal';

const meta: Meta<typeof Modal> = { title: 'Organisms/Modal', component: Modal, tags: ['autodocs'] };
export default meta;

export const Default = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <button onClick={() => setOpen(true)} style={{ padding: '8px 16px', cursor: 'pointer' }}>
          Open Modal
        </button>
        <Modal open={open} onClose={() => setOpen(false)}>
          <div style={{ padding: 32, color: 'var(--color-text)' }}>
            <h2>Modal Content</h2>
            <p style={{ marginTop: 12, color: 'var(--color-text-subtle)' }}>Modal body goes here.</p>
          </div>
        </Modal>
      </>
    );
  },
};
