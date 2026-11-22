import { useEffect, useRef, useState } from 'react'
import { CalendarDays, ChevronDown, X } from 'lucide-react'
import { taskPriorities, taskStatuses } from '../../utils/taskHelpers.js'

function getFormValues(task, defaultStatus, defaultPriority) {
  return {
    title: task?.title ?? '',
    description: task?.description ?? '',
    category: task?.category ?? 'General',
    status: task?.status ?? defaultStatus,
    priority: task?.priority ?? defaultPriority,
    dueDate: task?.dueDate ?? '',
  }
}

function TaskModal({
  task,
  defaultPriority = 'Medium',
  defaultStatus = 'To do',
  onClose,
  onSubmit,
}) {
  const dialogRef = useRef(null)
  const titleRef = useRef(null)
  const returnFocusRef = useRef(null)
  const [values, setValues] = useState(() =>
    getFormValues(task, defaultStatus, defaultPriority),
  )
  const [validationMessage, setValidationMessage] = useState('')
  const isEditing = Boolean(task)

  useEffect(() => {
    const dialog = dialogRef.current
    returnFocusRef.current = document.activeElement
    if (dialog && !dialog.open) {
      dialog.showModal()
    }
    dialog?.focus()

    return () => {
      if (dialog?.open) {
        dialog.close()
      }
      if (returnFocusRef.current?.isConnected) {
        returnFocusRef.current.focus()
      }
    }
  }, [])

  function handleSubmit(event) {
    event.preventDefault()
    const title = values.title.trim()
    if (!title) {
      setValidationMessage('Enter a title to save this task.')
      titleRef.current?.focus()
      return
    }

    onSubmit({
      ...values,
      title,
      description: values.description.trim(),
      category: values.category.trim() || 'General',
    })
  }

  function handleFieldChange(event) {
    const { name, value } = event.target
    setValues((currentValues) => ({ ...currentValues, [name]: value }))
    if (name === 'title' && value.trim()) {
      setValidationMessage('')
    }
  }

  return (
    <dialog
      aria-labelledby="task-modal-title"
      className="task-dialog task-dialog--task-form"
      onKeyDown={(event) => {
        if (event.key === 'Escape') {
          event.preventDefault()
          onClose()
        }
      }}
      tabIndex={-1}
      onCancel={(event) => {
        event.preventDefault()
        onClose()
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          onClose()
        }
      }}
      ref={dialogRef}
    >
      <header className="task-dialog__header">
        <div className="task-dialog__header-copy">
          <h2 id="task-modal-title">
            {isEditing ? 'Edit task' : 'Create new task'}
          </h2>
          <p>Add your task details to stay on top of your work.</p>
        </div>
        <button
          aria-label="Close task form"
          className="task-dialog__close"
          onClick={onClose}
          type="button"
        >
          <X aria-hidden="true" size={14} strokeWidth={2} />
        </button>
      </header>
      <form className="task-dialog__form" onSubmit={handleSubmit} noValidate>
        <label className="task-dialog__field">
          <span>Task Title <span aria-hidden="true">*</span></span>
          <input
            aria-describedby={validationMessage ? 'task-title-error' : undefined}
            aria-invalid={Boolean(validationMessage)}
            autoComplete="off"
            maxLength={120}
            name="title"
            onChange={handleFieldChange}
            placeholder="e.g. Update landing page"
            ref={titleRef}
            required
            value={values.title}
          />
        </label>
        {validationMessage && (
          <p className="task-dialog__error" id="task-title-error" role="alert">
            {validationMessage}
          </p>
        )}
        <label className="task-dialog__field">
          <span>Description</span>
          <textarea
            maxLength={500}
            name="description"
            onChange={handleFieldChange}
            placeholder="Add notes about this task..."
            rows={3}
            value={values.description}
          />
        </label>
        <div className="task-dialog__select-grid">
          <label className="task-dialog__field">
            <span>Status</span>
            <span className="task-dialog__select-control">
              <select
                name="status"
                onChange={handleFieldChange}
                value={values.status}
              >
                {taskStatuses.map((status) => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
              <ChevronDown aria-hidden="true" size={14} />
            </span>
          </label>
          <label className="task-dialog__field">
            <span>Priority</span>
            <span className="task-dialog__select-control">
              <select
                name="priority"
                onChange={handleFieldChange}
                value={values.priority}
              >
                {taskPriorities.map((priority) => (
                  <option key={priority} value={priority}>{priority}</option>
                ))}
              </select>
              <ChevronDown aria-hidden="true" size={14} />
            </span>
          </label>
        </div>
        <label className="task-dialog__field">
          <span>Due date</span>
          <span
            className={`task-dialog__date-control${values.dueDate ? '' : ' is-empty'}`}
          >
            <CalendarDays aria-hidden="true" size={16} />
            {!values.dueDate && (
              <span aria-hidden="true" className="task-dialog__date-placeholder">
                DD / MM / YYYY
              </span>
            )}
            <input
              aria-label="Due date"
              className={`task-dialog__date-input${values.dueDate ? '' : ' is-empty'}`}
              name="dueDate"
              onChange={handleFieldChange}
              type="date"
              value={values.dueDate}
            />
          </span>
        </label>
        <div className="task-dialog__meta-row">
          <p className="task-dialog__required-note">
            <span aria-hidden="true">*</span> Required field
          </p>
          <details className="task-dialog__category">
            <summary aria-label={`Edit category, current value ${values.category}`}>
              Category
            </summary>
            <label className="task-dialog__field">
              <span>Category</span>
              <input
                maxLength={60}
                name="category"
                onChange={handleFieldChange}
                value={values.category}
              />
            </label>
          </details>
        </div>
        <footer className="task-dialog__actions">
          <button
            className="task-dialog__cancel"
            onClick={onClose}
            type="button"
          >
            Cancel
          </button>
          <button className="task-dialog__submit" type="submit">
            {isEditing ? 'Save changes' : 'Create task'}
          </button>
        </footer>
      </form>
    </dialog>
  )
}

export default TaskModal
