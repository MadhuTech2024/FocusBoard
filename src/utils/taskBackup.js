import { normalizeTask, taskPriorities, taskStatuses } from './taskHelpers.js'

const taskFields = [
  'id',
  'title',
  'description',
  'category',
  'status',
  'priority',
  'dueDate',
]

function isValidDueDate(value) {
  if (value === '') {
    return true
  }

  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
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

export function validateTaskBackup(value) {
  if (!Array.isArray(value)) {
    return { valid: false, tasks: [], error: 'The backup must contain a task array.' }
  }

  const seenIds = new Set()
  const tasks = []

  for (const [index, record] of value.entries()) {
    if (
      !record ||
      typeof record !== 'object' ||
      Array.isArray(record) ||
      taskFields.some((field) => !Object.hasOwn(record, field)) ||
      Object.keys(record).some((field) => !taskFields.includes(field))
    ) {
      return {
        valid: false,
        tasks: [],
        error: `Task ${index + 1} does not match the FocusBoard task format.`,
      }
    }

    if (
      typeof record.id !== 'string' ||
      !record.id.trim() ||
      typeof record.title !== 'string' ||
      !record.title.trim() ||
      typeof record.description !== 'string' ||
      typeof record.category !== 'string' ||
      !record.category.trim() ||
      !taskStatuses.includes(record.status) ||
      !taskPriorities.includes(record.priority) ||
      !isValidDueDate(record.dueDate)
    ) {
      return {
        valid: false,
        tasks: [],
        error: `Task ${index + 1} contains invalid or missing values.`,
      }
    }

    const task = normalizeTask(record)
    if (!task) {
      return {
        valid: false,
        tasks: [],
        error: `Task ${index + 1} could not be validated.`,
      }
    }
    if (seenIds.has(task.id)) {
      return {
        valid: false,
        tasks: [],
        error: `Duplicate task ID found: ${task.id}.`,
      }
    }

    seenIds.add(task.id)
    tasks.push(task)
  }

  return { valid: true, tasks, error: '' }
}

export function parseTaskBackup(content) {
  let parsedBackup
  try {
    parsedBackup = JSON.parse(content)
  } catch {
    return { valid: false, tasks: [], error: 'The selected file is not valid JSON.' }
  }

  return validateTaskBackup(parsedBackup)
}
