import TaskCard from './TaskCard.jsx'

function TaskList({ tasks = [] }) {
  if (tasks.length === 0) {
    return <p className="task-list__empty">No tasks match these filters.</p>
  }

  return (
    <ul className="task-list">
      {tasks.map((task) => (
        <li key={task.id}>
          <TaskCard task={task} />
        </li>
      ))}
    </ul>
  )
}

export default TaskList
