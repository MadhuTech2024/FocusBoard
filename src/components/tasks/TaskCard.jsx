import { Check, Pencil, Trash2 } from 'lucide-react'

function TaskCard({ task, onToggle, onEdit, onDelete }) {
  return (
    <article>
      <button
        type="button"
        aria-label={task.completed ? 'Mark task incomplete' : 'Complete task'}
        aria-pressed={task.completed}
        onClick={() => onToggle?.(task.id)}
      >
        <Check aria-hidden="true" size={16} />
      </button>
      <div>
        <h3>{task.title}</h3>
        {task.description && <p>{task.description}</p>}
      </div>
      <button type="button" aria-label="Edit task" onClick={() => onEdit?.(task)}>
        <Pencil aria-hidden="true" size={16} />
      </button>
      <button
        type="button"
        aria-label="Delete task"
        onClick={() => onDelete?.(task.id)}
      >
        <Trash2 aria-hidden="true" size={16} />
      </button>
    </article>
  )
}

export default TaskCard
