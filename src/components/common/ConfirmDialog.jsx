import { useEffect, useRef } from 'react'

function ConfirmDialog({
  open,
  title = 'Are you sure?',
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
}) {
  const dialogRef = useRef(null)
  const cancelRef = useRef(null)

  useEffect(() => {
    if (!open) {
      return undefined
    }

    const dialog = dialogRef.current
    if (dialog && !dialog.open) {
      dialog.showModal()
    }
    cancelRef.current?.focus()

    return () => {
      if (dialog?.open) {
        dialog.close()
      }
    }
  }, [open])

  if (!open) {
    return null
  }

  return (
    <dialog
      aria-describedby={message ? 'confirm-message' : undefined}
      aria-labelledby="confirm-title"
      className="task-dialog task-dialog--confirmation"
      onCancel={(event) => {
        event.preventDefault()
        onCancel()
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          onCancel()
        }
      }}
      ref={dialogRef}
    >
      <div className="task-dialog__header">
        <h2 id="confirm-title">{title}</h2>
      </div>
      {message && (
        <p className="task-dialog__confirmation-message" id="confirm-message">
          {message}
        </p>
      )}
      <footer className="task-dialog__actions">
        <button
          className="task-dialog__cancel"
          onClick={onCancel}
          ref={cancelRef}
          type="button"
        >
          {cancelLabel}
        </button>
        <button
          className="task-dialog__delete"
          onClick={onConfirm}
          type="button"
        >
          {confirmLabel}
        </button>
      </footer>
    </dialog>
  )
}

export default ConfirmDialog
