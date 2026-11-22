function TaskFilters({ filters = {}, onChange }) {
  function updateFilter(event) {
    onChange?.({ ...filters, status: event.target.value })
  }

  return (
    <label>
      <span>Filter tasks</span>
      <select value={filters.status ?? 'all'} onChange={updateFilter}>
        <option value="all">All tasks</option>
        <option value="active">Active</option>
        <option value="completed">Completed</option>
      </select>
    </label>
  )
}

export default TaskFilters
