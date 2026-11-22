import { Plus } from 'lucide-react'
import TaskFilters from './TaskFilters.jsx'
import TaskList from './TaskList.jsx'

function TaskSection({
  tasks = [],
  activeFilter = 'all',
  onFilterChange,
  searchQuery = '',
  onSearchChange,
  priority = 'all',
  onPriorityChange,
  totalCount = 0,
  onCreateTask,
  onViewAll,
  onEdit,
  onDelete,
  onStatusChange,
  standalone = false,
}) {
  return (
    <section
      aria-labelledby="my-tasks-title"
      className="task-section"
      id={standalone ? undefined : 'tasks'}
    >
      <div className="task-section__heading">
        <div>
          {standalone ? (
            <h1 id="my-tasks-title">My tasks</h1>
          ) : (
            <h2 id="my-tasks-title">My tasks</h2>
          )}
          <p className="task-section__subtitle--desktop">
            Manage and track everything in one place.
          </p>
          <p className="task-section__subtitle--mobile">
            Your priorities for this week
          </p>
        </div>
        {standalone ? (
          <button
            className="primary-action task-section__new-task"
            onClick={onCreateTask}
            type="button"
          >
            <Plus aria-hidden="true" size={16} />
            New task
          </button>
        ) : (
          <button
            className="task-section__view-all"
            onClick={onViewAll}
            type="button"
          >
            View all tasks
          </button>
        )}
        <button
          aria-label="Create a task"
          className="task-section__create"
          onClick={onCreateTask}
          type="button"
        >
          <Plus aria-hidden="true" size={22} />
        </button>
      </div>
      <TaskFilters
        activeFilter={activeFilter}
        onFilterChange={onFilterChange}
        onPriorityChange={onPriorityChange}
        onSearchChange={onSearchChange}
        priority={priority}
        searchQuery={searchQuery}
        totalCount={totalCount}
      />
      <TaskList
        onDelete={onDelete}
        onEdit={onEdit}
        onStatusChange={onStatusChange}
        tasks={tasks}
      />
    </section>
  )
}

export default TaskSection
