function TaskModal({ open, title = 'Task details', children, onClose, onSubmit }) {
  if (!open) {
    return null
  }

  function handleSubmit(event) {
    event.preventDefault()
    onSubmit?.(event)
  }

  return (
    <div role="presentation">
      <section role="dialog" aria-modal="true" aria-labelledby="task-modal-title">
        <h2 id="task-modal-title">{title}</h2>
        <form onSubmit={handleSubmit}>
          {children}
          <button type="button" onClick={onClose}>
            Cancel
          </button>
          {onSubmit && <button type="submit">Save task</button>}
        </form>
      </section>
    </div>
  )
}

export default TaskModal
