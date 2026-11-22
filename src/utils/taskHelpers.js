export const taskStatuses = ['To do', 'In progress', 'Completed']
export const taskPriorities = ['Low', 'Medium', 'High']

const monthNames = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
]

function isValidDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false
  }

  const [year, month, day] = value.split('-').map(Number)
  const date = new Date(year, month - 1, day)
  return (
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
  )
}

function normalizeDueDate(value) {
  if (typeof value !== 'string') {
    return ''
  }

  const trimmed = value.trim()
  if (isValidDate(trimmed)) {
    return trimmed
  }

  const legacyDate = /^(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+(\d{1,2})$/i.exec(
    trimmed,
  )
  if (!legacyDate) {
    return ''
  }

  const month = monthNames.findIndex(
    (name) => name.toLowerCase() === legacyDate[1].toLowerCase(),
  )
  const day = Number(legacyDate[2])
  const year = new Date().getFullYear()
  const date = new Date(year, month, day)
  if (date.getMonth() !== month || date.getDate() !== day) {
    return ''
  }

  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

export function normalizeTask(task) {
  if (!task || typeof task !== 'object' || Array.isArray(task)) {
    return null
  }

  const id = typeof task.id === 'string' ? task.id.trim() : ''
  const title = typeof task.title === 'string' ? task.title.trim() : ''
  if (!id || !title) {
    return null
  }

  const status = taskStatuses.includes(task.status)
    ? task.status
    : task.completed === true
      ? 'Completed'
      : task.completed === false
        ? 'In progress'
        : 'To do'
  const priority = taskPriorities.includes(task.priority)
    ? task.priority
    : 'Medium'

  return {
    id,
    title,
    description:
      typeof task.description === 'string' ? task.description.trim() : '',
    category:
      typeof task.category === 'string' && task.category.trim()
        ? task.category.trim()
        : 'General',
    status,
    priority,
    dueDate: normalizeDueDate(task.dueDate),
  }
}

export function normalizeTasks(tasks) {
  const seenIds = new Set()
  const normalizedTasks = []

  for (const task of tasks) {
    const normalizedTask = normalizeTask(task)
    if (!normalizedTask) {
      continue
    }

    if (seenIds.has(normalizedTask.id)) {
      normalizedTask.id = createTaskId(seenIds)
    }
    seenIds.add(normalizedTask.id)
    normalizedTasks.push(normalizedTask)
  }

  return normalizedTasks
}

export function createTaskId(existingIds = new Set()) {
  let id
  do {
    id =
      typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
        ? crypto.randomUUID()
        : `task-${Date.now()}-${Math.random().toString(36).slice(2)}`
  } while (existingIds.has(id))

  return id
}

export function formatDueDate(value) {
  if (!isValidDate(value)) {
    return value || 'No due date'
  }

  const date = new Date(`${value}T00:00:00`)
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
  }).format(date)
}

export function getTaskStats(tasks) {
  const completed = tasks.filter((task) => task.status === 'Completed').length
  const inProgress = tasks.filter(
    (task) => task.status === 'In progress',
  ).length

  return {
    total: tasks.length,
    completed,
    inProgress,
    toDo: tasks.filter((task) => task.status === 'To do').length,
    completionPercentage: tasks.length
      ? Math.round((completed / tasks.length) * 100)
      : 0,
  }
}

export function filterTasks(tasks, status = 'all') {
  if (status === 'in-progress') {
    return tasks.filter((task) => task.status === 'In progress')
  }

  if (status === 'completed') {
    return tasks.filter((task) => task.status === 'Completed')
  }

  return tasks
}
