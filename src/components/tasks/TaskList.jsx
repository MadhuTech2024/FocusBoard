import TaskCard from './TaskCard.jsx'

function TaskList({ tasks = [], onToggleTask, onEditTask, onDeleteTask }) {
  if (tasks.length === 0) {
    return <p>No tasks to show.</p>
  }

  return (
    <ul>
      {tasks.map((task) => (
        <li key={task.id}>
          <TaskCard
            task={task}
            onToggle={onToggleTask}
            onEdit={onEditTask}
            onDelete={onDeleteTask}
          />
        </li>
      ))}
    </ul>
  )
}

export default TaskList
