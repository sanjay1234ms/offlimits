"use client";

import { ShieldAlert } from "lucide-react";
import { Modal } from "./Modal";

interface AgeGateModalProps {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

/** One-time "Are you 18 or older?" confirmation for the 18+ filter. */
export function AgeGateModal({ open, onConfirm, onCancel }: AgeGateModalProps) {
  return (
    <Modal
      open={open}
      onClose={onCancel}
      hideClose
      dismissable={false}
      title="Are you 18 or older?"
    >
      <div className="mt-3 flex flex-col gap-5">
        <p className="flex items-start gap-2 text-sm text-muted">
          <ShieldAlert
            className="mt-0.5 h-4 w-4 shrink-0 text-accent"
            aria-hidden
          />
          The <strong className="text-foreground">18+</strong> category contains
          mature, adults-only prompts. Confirm your age to continue.
        </p>

        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button type="button" onClick={onCancel} className="btn-ghost">
            No, take me back
          </button>
          <button type="button" onClick={onConfirm} className="btn-primary">
            Yes, I&apos;m 18 or older
          </button>
        </div>
      </div>
    </Modal>
  );
}
