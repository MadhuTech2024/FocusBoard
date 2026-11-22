export function getTaskStats(tasks) {
  const completed = tasks.filter((task) => task.completed).length

  return {
    total: tasks.length,
    completed,
    active: tasks.length - completed,
  }
}

export function filterTasks(tasks, status = 'all') {
  if (status === 'active') {
    return tasks.filter((task) => !task.completed)
  }

  if (status === 'completed') {
    return tasks.filter((task) => task.completed)
  }

  return tasks
}
