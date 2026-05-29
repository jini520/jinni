'use client';

import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import styles from './modal.module.scss';

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
}

export function Modal({ open, onClose, children, className }: ModalProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div className={styles.overlay} onClick={onClose}>
      <div
        className={[styles.modal, className].filter(Boolean).join(' ')}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal
      >
        <div className={styles.closeRow}>
          <button className={styles.close} onClick={onClose} aria-label="닫기">✕</button>
        </div>
        {children}
      </div>
    </div>,
    document.body,
  );
}
