import { Search } from 'lucide-react'

const statusFilters = [
  { label: 'All tasks', mobileLabel: 'All', value: 'all' },
  { label: 'In progress', mobileLabel: 'In progress', value: 'in-progress' },
  { label: 'Completed', mobileLabel: 'Completed', value: 'completed' },
]

function TaskFilters({
  activeFilter = 'all',
  onFilterChange,
  searchQuery = '',
  onSearchChange,
  priority = 'all',
  onPriorityChange,
  totalCount = 0,
}) {
  return (
    <div className="task-filters">
      <div
        className="task-filters__tabs"
        role="group"
        aria-label="Task status filters"
      >
        {statusFilters.map(({ label, mobileLabel, value }) => (
          <button
            aria-pressed={activeFilter === value}
            className={activeFilter === value ? 'is-active' : undefined}
            key={value}
            onClick={() => onFilterChange?.(value)}
            type="button"
          >
            <span className="task-filters__label--desktop">{label}</span>
            {mobileLabel && (
              <span className="task-filters__label--mobile">{mobileLabel}</span>
            )}
            {value === 'all' && (
              <span className="task-filters__count">{totalCount}</span>
            )}
          </button>
        ))}
      </div>
      <div className="task-filters__search">
        <Search aria-hidden="true" size={17} />
        <input
          aria-label="Find a task"
          className="task-filters__input--desktop"
          onChange={(event) => onSearchChange?.(event.target.value)}
          placeholder="Find a task..."
          type="search"
          value={searchQuery}
        />
        <input
          aria-label="Search tasks"
          className="task-filters__input--mobile"
          onChange={(event) => onSearchChange?.(event.target.value)}
          placeholder="Search tasks..."
          type="search"
          value={searchQuery}
        />
      </div>
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
