import { useEffect, useRef, useState } from 'react'
import { taskPriorities, taskStatuses } from '../utils/taskHelpers.js'

const STORAGE_KEY = 'focusboard-settings'

export const defaultPreferences = {
  theme: 'light',
  defaultPriority: 'Medium',
  defaultStatus: 'To do',
}

function readPreferences() {
  try {
    const storedPreferences = localStorage.getItem(STORAGE_KEY)
    if (storedPreferences === null) {
      return { preferences: defaultPreferences, error: '' }
    }

    const parsedPreferences = JSON.parse(storedPreferences)
    if (
      !parsedPreferences ||
      typeof parsedPreferences !== 'object' ||
      Array.isArray(parsedPreferences)
    ) {
      return {
        preferences: defaultPreferences,
        error: 'Saved preferences could not be read. Defaults are being used.',
      }
    }

    const hasInvalidPreferences =
      (parsedPreferences.theme !== undefined &&
        !['light', 'dark'].includes(parsedPreferences.theme)) ||
      (parsedPreferences.defaultPriority !== undefined &&
        !taskPriorities.includes(parsedPreferences.defaultPriority)) ||
      (parsedPreferences.defaultStatus !== undefined &&
        !taskStatuses.includes(parsedPreferences.defaultStatus))
    const preferences = {
      theme: ['light', 'dark'].includes(parsedPreferences.theme)
        ? parsedPreferences.theme
        : defaultPreferences.theme,
      defaultPriority: taskPriorities.includes(
        parsedPreferences.defaultPriority,
      )
        ? parsedPreferences.defaultPriority
        : defaultPreferences.defaultPriority,
      defaultStatus: taskStatuses.includes(parsedPreferences.defaultStatus)
        ? parsedPreferences.defaultStatus
        : defaultPreferences.defaultStatus,
    }

    return {
      preferences,
      error: hasInvalidPreferences
        ? 'Some saved preferences were invalid. Defaults are being used for those settings.'
        : '',
    }
  } catch {
    return {
      preferences: defaultPreferences,
      error: 'Saved preferences could not be read. Defaults are being used.',
    }
  }
}

function usePreferences() {
  const [storedState] = useState(readPreferences)
  const [preferences, setPreferences] = useState(storedState.preferences)
  const [preferencesError, setPreferencesError] = useState(storedState.error)
  const preferencesRef = useRef(storedState.preferences)

  useEffect(() => {
    document.documentElement.dataset.theme = preferences.theme
  }, [preferences.theme])

  function updatePreferences(updates) {
    const nextPreferences = { ...preferencesRef.current }

    if (updates.theme !== undefined && ['light', 'dark'].includes(updates.theme)) {
      nextPreferences.theme = updates.theme
    }
    if (
      updates.defaultPriority !== undefined &&
      taskPriorities.includes(updates.defaultPriority)
    ) {
      nextPreferences.defaultPriority = updates.defaultPriority
    }
    if (
      updates.defaultStatus !== undefined &&
      taskStatuses.includes(updates.defaultStatus)
    ) {
      nextPreferences.defaultStatus = updates.defaultStatus
    }

    preferencesRef.current = nextPreferences
    setPreferences(nextPreferences)

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(nextPreferences))
      setPreferencesError('')
      return true
    } catch {
      setPreferencesError('Preferences could not be saved in this browser.')
      return false
    }
  }

  return { preferences, preferencesError, updatePreferences }
}

export default usePreferences
