import { useRef, useState } from 'react'
import initialTasks from '../data/initialTasks.js'
import { createTaskId, normalizeTask, normalizeTasks } from '../utils/taskHelpers.js'

const STORAGE_KEY = 'focusboard-tasks'

function readStoredTasks() {
  try {
    const storedTasks = localStorage.getItem(STORAGE_KEY)
    if (storedTasks === null) {
      return { tasks: initialTasks, error: '' }
    }

    const parsedTasks = JSON.parse(storedTasks)
    if (!Array.isArray(parsedTasks)) {
      return {
        tasks: initialTasks,
        error: 'Saved tasks could not be read. They have not been overwritten.',
      }
    }

    const tasks = normalizeTasks(parsedTasks)
    const error =
      tasks.length !== parsedTasks.length
        ? 'Some saved tasks were invalid and were skipped.'
        : ''

    return { tasks, error }
  } catch {
    return {
      tasks: initialTasks,
      error: 'Saved tasks could not be read. They have not been overwritten.',
    }
  }
}

function useTasks() {
  const [storedState] = useState(readStoredTasks)
  const [tasks, setTasks] = useState(storedState.tasks)
  const [storageError, setStorageError] = useState(storedState.error)
  const tasksRef = useRef(storedState.tasks)

  function commitTasks(update) {
    const nextTasks =
      typeof update === 'function' ? update(tasksRef.current) : update
    tasksRef.current = nextTasks
    setTasks(nextTasks)
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(nextTasks))
      setStorageError('')
      return true
    } catch {
      setStorageError('Task changes could not be saved to this browser.')
      return false
    }
  }

  function addTask(task) {
    const normalizedTask = normalizeTask({
      ...task,
      id: task.id || createTaskId(),
    })
    if (!normalizedTask) {
      throw new Error('A task must have a title and unique ID.')
    }

    commitTasks((currentTasks) => {
      if (!currentTasks.some(({ id }) => id === normalizedTask.id)) {
        return [...currentTasks, normalizedTask]
      }

      return [
        ...currentTasks,
        {
          ...normalizedTask,
          id: createTaskId(new Set(currentTasks.map(({ id }) => id))),
        },
      ]
    })
  }

  function updateTask(taskId, updates) {
    commitTasks((currentTasks) =>
      currentTasks.map((task) => {
        if (task.id !== taskId) {
          return task
        }

        const updatedTask = normalizeTask({ ...task, ...updates, id: task.id })
        if (!updatedTask) {
          throw new Error('The task update is invalid.')
        }
        return updatedTask
      }),
    )
  }

  function deleteTask(taskId) {
    commitTasks((currentTasks) =>
      currentTasks.filter((task) => task.id !== taskId),
    )
  }

  function replaceTasks(nextTasks) {
    if (!Array.isArray(nextTasks)) {
      throw new Error('Imported tasks must be provided as an array.')
    }

    const seenIds = new Set()
    const normalizedTasks = nextTasks.map((task) => {
      const normalizedTask = normalizeTask(task)
      if (!normalizedTask || seenIds.has(normalizedTask.id)) {
        throw new Error('Imported tasks must be valid and have unique IDs.')
      }

      seenIds.add(normalizedTask.id)
      return normalizedTask
    })

    return commitTasks(normalizedTasks)
  }

  function resetTasks() {
    return commitTasks(initialTasks.map((task) => ({ ...task })))
  }

  function updateTaskStatus(taskId, status) {
    updateTask(taskId, { status })
  }

  return {
    tasks,
    addTask,
    updateTask,
    deleteTask,
    replaceTasks,
    resetTasks,
    updateTaskStatus,
    storageError,
  }
}

export default useTasks
