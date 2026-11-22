import { Search } from 'lucide-react'

const statusFilters = [
  { label: 'All tasks', count: '12', value: 'all' },
  { label: 'In progress', value: 'in-progress' },
  { label: 'Completed', value: 'completed' },
]

function TaskFilters({
  activeFilter = 'all',
  onFilterChange,
  searchQuery = '',
  onSearchChange,
  priority = 'all',
  onPriorityChange,
}) {
  return (
    <div className="task-filters">
      <div
        className="task-filters__tabs"
        role="group"
        aria-label="Task status filters"
      >
        {statusFilters.map(({ label, count, value }) => (
          <button
            aria-pressed={activeFilter === value}
            className={activeFilter === value ? 'is-active' : undefined}
            key={value}
            onClick={() => onFilterChange?.(value)}
            type="button"
          >
            <span>{label}</span>
            {count && <span className="task-filters__count">{count}</span>}
          </button>
        ))}
      </div>
      <label className="task-filters__search">
        <Search aria-hidden="true" size={17} />
        <span className="sr-only">Find a task</span>
        <input
          onChange={(event) => onSearchChange?.(event.target.value)}
          placeholder="Find a task..."
          type="search"
          value={searchQuery}
        />
      </label>
      <label className="task-filters__priority">
        <span className="sr-only">Filter by priority</span>
        <select
          onChange={(event) => onPriorityChange?.(event.target.value)}
          value={priority}
        >
          <option value="all">Priority: All</option>
          <option value="High">Priority: High</option>
          <option value="Medium">Priority: Medium</option>
          <option value="Low">Priority: Low</option>
        </select>
      </label>
    </div>
  )
}

export default TaskFilters
