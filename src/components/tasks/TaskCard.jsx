import {
  CalendarDays,
  Check,
  Clock3,
  MoreHorizontal,
  Square,
} from 'lucide-react'
import { taskStatuses, formatDueDate } from '../../utils/taskHelpers.js'

const statusIcons = {
  'To do': Square,
  'In progress': Clock3,
  Completed: Check,
}

function TaskCard({ task, onEdit, onDelete, onStatusChange }) {
  const statusIndex = taskStatuses.indexOf(task.status)
  const nextStatus = taskStatuses[(statusIndex + 1) % taskStatuses.length]
  const StatusIcon = statusIcons[task.status] ?? Square

  function closeMenu(event) {
    const menu = event.currentTarget.closest('details')
    if (menu) {
      menu.open = false
    }
  }

  return (
    <article className="task-card">
      <div className="task-card__main">
        <button
          aria-label={`Set ${task.title} status to ${nextStatus}. Current status: ${task.status}`}
          className={`task-card__status${task.status === 'Completed' ? ' is-completed' : ''}${task.status === 'In progress' ? ' is-in-progress' : ''}`}
          onClick={() => onStatusChange(task.id, nextStatus)}
          title={`Current status: ${task.status}. Activate to set ${nextStatus}.`}
          type="button"
        >
          <StatusIcon aria-hidden="true" size={17} />
        </button>
        <div className="task-card__text">
          <h3>{task.title}</h3>
          <p>{task.description}</p>
        </div>
      </div>
      <div className="task-card__meta">
        <span className="task-category">{task.category}</span>
        <span
          className={`task-priority task-priority--${task.priority.toLowerCase()}`}
        >
          {task.priority}
        </span>
        <span className="task-due-date">
          <CalendarDays aria-hidden="true" size={14} />
          {formatDueDate(task.dueDate)}
        </span>
        <details className="task-card__actions">
          <summary
            aria-label={`Actions for ${task.title}`}
            className="task-card__more"
          >
            <MoreHorizontal aria-hidden="true" size={19} />
          </summary>
          <div
            aria-label={`${task.title} actions`}
            className="task-card__menu"
            role="group"
          >
            <button
              onClick={(event) => {
                closeMenu(event)
                onEdit(task)
              }}
              type="button"
            >
              Edit task
            </button>
            <button
              className="task-card__menu-delete"
              onClick={(event) => {
                closeMenu(event)
                onDelete(task)
              }}
              type="button"
            >
              Delete task
            </button>
          </div>
        </details>
      </div>
    </article>
  )
}

export default TaskCard
