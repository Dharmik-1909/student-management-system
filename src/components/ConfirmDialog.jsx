import React, { useEffect } from 'react';

export default function ConfirmDialog({ title, children, confirmLabel = 'Delete', busy = false, onConfirm, onCancel }) {
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape' && !busy) onCancel();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [busy, onCancel]);

  return (
    <>
      <div className="modal-backdrop-sms" onClick={busy ? undefined : onCancel} />
      <div className="modal show d-block" role="dialog" aria-modal="true" aria-labelledby="confirm-title" tabIndex="-1">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h2 className="modal-title h5" id="confirm-title">{title}</h2>
            </div>
            <div className="modal-body">{children}</div>
            <div className="modal-footer">
              <button type="button" className="btn btn-outline-secondary" onClick={onCancel} disabled={busy}>
                Cancel
              </button>
              <button type="button" className="btn btn-danger" onClick={onConfirm} disabled={busy} autoFocus>
                {busy && <span className="spinner-border spinner-border-sm me-2" aria-hidden="true" />}
                {confirmLabel}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
