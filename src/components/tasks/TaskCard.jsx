import { CalendarDays, Check, Circle, Flag, MoreHorizontal } from 'lucide-react'

function TaskCard({ task }) {
  return (
    <article className="task-card">
      <div className="task-card__main">
        <span
          aria-label={task.completed ? 'Completed' : 'In progress'}
          className={
            task.completed
              ? 'task-card__status is-completed'
              : 'task-card__status'
          }
          role="img"
        >
          {task.completed ? (
            <Check aria-hidden="true" size={17} />
          ) : (
            <Circle aria-hidden="true" size={19} />
          )}
        </span>
        <div className="task-card__text">
          <h3>{task.title}</h3>
          <p>{task.description}</p>
        </div>
      </div>
      <div className="task-card__meta">
        <span className="task-category">{task.category}</span>
        <span className={`task-priority task-priority--${task.priority.toLowerCase()}`}>
          <Flag aria-hidden="true" size={13} />
          {task.priority}
        </span>
        <span className="task-due-date">
          <CalendarDays aria-hidden="true" size={14} />
          {task.dueDate}
        </span>
        <button
          aria-label={`More actions for ${task.title}`}
          className="task-card__more"
          type="button"
        >
          <MoreHorizontal aria-hidden="true" size={19} />
        </button>
      </div>
    </article>
  )
}

export default TaskCard
