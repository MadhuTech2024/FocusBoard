import { useEffect, useState } from 'react'
import initialTasks from '../data/initialTasks.js'

const STORAGE_KEY = 'focusboard-tasks'

function readStoredTasks() {
  const storedTasks = localStorage.getItem(STORAGE_KEY)

  if (!storedTasks) {
    return initialTasks
  }

  const parsedTasks = JSON.parse(storedTasks)
  if (!Array.isArray(parsedTasks)) {
    throw new Error('Stored FocusBoard tasks must be an array.')
  }

  return parsedTasks
}

function useTasks() {
  const [tasks, setTasks] = useState(readStoredTasks)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
  }, [tasks])

  function addTask(task) {
    const newTask = { ...task, id: task.id ?? crypto.randomUUID() }
    setTasks((currentTasks) => [...currentTasks, newTask])
  }

  function updateTask(taskId, updates) {
    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === taskId ? { ...task, ...updates } : task,
      ),
    )
  }

  function deleteTask(taskId) {
    setTasks((currentTasks) =>
      currentTasks.filter((task) => task.id !== taskId),
    )
  }

  function toggleTask(taskId) {
    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task,
      ),
    )
  }

  return { tasks, addTask, updateTask, deleteTask, toggleTask }
}

export default useTasks
