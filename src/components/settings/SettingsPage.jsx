import { useRef, useState } from 'react'
import {
  AlertCircle,
  Database,
  Download,
  Moon,
  Palette,
  RotateCcw,
  SlidersHorizontal,
  Sun,
  Upload,
} from 'lucide-react'
import ConfirmDialog from '../common/ConfirmDialog.jsx'
import ProfileSettings from './ProfileSettings.jsx'
import initialTasks from '../../data/initialTasks.js'
import { parseTaskBackup } from '../../utils/taskBackup.js'
import { taskPriorities, taskStatuses } from '../../utils/taskHelpers.js'

function getTaskCountLabel(count) {
  return `${count} ${count === 1 ? 'task' : 'tasks'}`
}

function SettingsPage({
  tasks,
  preferences,
  preferencesError,
  storageError,
  profile,
  profileError,
  onSaveProfile,
  onPreferencesChange,
  onReplaceTasks,
  onResetTasks,
}) {
  const fileInputRef = useRef(null)
  const [pendingAction, setPendingAction] = useState(null)
  const [feedback, setFeedback] = useState(null)

  function updatePreference(updates) {
    const saved = onPreferencesChange(updates)
    setFeedback({
      type: saved ? 'success' : 'error',
      message: saved
        ? 'Preference saved.'
        : 'Preference changed but could not be saved in this browser.',
    })
  }

  function exportTasks() {
    const backup = new Blob([JSON.stringify(tasks, null, 2)], {
      type: 'application/json',
    })
    const downloadUrl = URL.createObjectURL(backup)
    const link = document.createElement('a')
    link.href = downloadUrl
    link.download = 'focusboard-backup.json'
    document.body.append(link)
    link.click()
    link.remove()
    window.setTimeout(() => URL.revokeObjectURL(downloadUrl), 1000)
    setFeedback({
      type: 'success',
      message: `Exported ${getTaskCountLabel(tasks.length)} to focusboard-backup.json.`,
    })
  }

  async function handleImportSelection(event) {
    const input = event.currentTarget
    const file = input.files?.[0]
    if (!file) {
      return
    }

    try {
      const backup = parseTaskBackup(await file.text())
      if (!backup.valid) {
        setFeedback({ type: 'error', message: backup.error })
        return
      }

      setFeedback(null)
      setPendingAction({ type: 'import', tasks: backup.tasks })
    } catch {
      setFeedback({
        type: 'error',
        message: 'The selected file could not be read.',
      })
    } finally {
      input.value = ''
    }
  }

  function confirmPendingAction() {
    if (!pendingAction) {
      return
    }

    try {
      if (pendingAction.type === 'reset') {
        const saved = onResetTasks()
        setFeedback({
          type: saved ? 'success' : 'error',
          message: saved
            ? 'Tasks were reset to the original sample data.'
            : 'Tasks were reset in this session but could not be saved in this browser.',
        })
      } else {
        const saved = onReplaceTasks(pendingAction.tasks)
        setFeedback({
          type: saved ? 'success' : 'error',
          message: saved
            ? `Imported ${getTaskCountLabel(pendingAction.tasks.length)}.`
            : 'Tasks were imported in this session but could not be saved in this browser.',
        })
      }
    } catch (error) {
      setFeedback({
        type: 'error',
        message:
          error instanceof Error
            ? error.message
            : 'The task data could not be updated.',
      })
    } finally {
      setPendingAction(null)
    }
  }

  const isResetAction = pendingAction?.type === 'reset'

  return (
    <main
      aria-labelledby="settings-title"
      className="dashboard-main settings-main"
      id="settings"
    >
      <div className="settings-page">
        <header className="settings-page__header">
          <h1 id="settings-title">Settings</h1>
          <p>Personalize FocusBoard and manage your task data.</p>
        </header>

        <section
          aria-labelledby="profile-settings-title"
          className="settings-card"
          id="profile-settings"
        >
          <ProfileSettings
            onSaveProfile={onSaveProfile}
            profile={profile}
            profileError={profileError}
          />
        </section>

        {storageError && (
          <div className="settings-page__error" role="alert">
            <AlertCircle aria-hidden="true" size={18} />
            <span>{storageError}</span>
          </div>
        )}
        {preferencesError && (
          <div className="settings-page__error" role="alert">
            <AlertCircle aria-hidden="true" size={18} />
            <span>{preferencesError}</span>
          </div>
        )}

        <section
          aria-labelledby="settings-appearance-title"
          className="settings-card"
        >
          <header className="settings-card__heading">
            <div className="settings-card__icon">
              <SlidersHorizontal aria-hidden="true" size={18} />
            </div>
            <div>
              <h2 id="settings-appearance-title">Appearance</h2>
              <p>Choose how FocusBoard looks on this device.</p>
            </div>
          </header>
          <fieldset className="settings-theme-options">
            <legend>Color theme</legend>
            <label
              className={`settings-theme-option${preferences.theme === 'light' ? ' is-selected' : ''}`}
            >
              <input
                checked={preferences.theme === 'light'}
                name="theme"
                onChange={() => updatePreference({ theme: 'light' })}
                type="radio"
                value="light"
              />
              <Sun aria-hidden="true" size={18} />
              <span>Light</span>
            </label>
            <label
              className={`settings-theme-option${preferences.theme === 'dark' ? ' is-selected' : ''}`}
            >
              <input
                checked={preferences.theme === 'dark'}
                name="theme"
                onChange={() => updatePreference({ theme: 'dark' })}
                type="radio"
                value="dark"
              />
              <Moon aria-hidden="true" size={18} />
              <span>Dark</span>
            </label>
          </fieldset>
        </section>

        <section
          aria-labelledby="settings-task-preferences-title"
          className="settings-card"
        >
          <header className="settings-card__heading">
            <div className="settings-card__icon">
              <Palette aria-hidden="true" size={18} />
            </div>
            <div>
              <h2 id="settings-task-preferences-title">Task preferences</h2>
              <p>Set the starting values for tasks you create.</p>
            </div>
          </header>
          <div className="settings-preference-grid">
            <label className="settings-field">
              <span>Default priority</span>
              <select
                onChange={(event) =>
                  updatePreference({ defaultPriority: event.target.value })
                }
                value={preferences.defaultPriority}
              >
                {taskPriorities.map((priority) => (
                  <option key={priority} value={priority}>
                    {priority}
                  </option>
                ))}
              </select>
            </label>
            <label className="settings-field">
              <span>Default status</span>
              <select
                onChange={(event) =>
                  updatePreference({ defaultStatus: event.target.value })
                }
                value={preferences.defaultStatus}
              >
                {taskStatuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </section>

        <section
          aria-labelledby="settings-data-title"
          className="settings-card"
        >
          <header className="settings-card__heading">
            <div className="settings-card__icon">
              <Database aria-hidden="true" size={18} />
            </div>
            <div>
              <h2 id="settings-data-title">Data management</h2>
              <p>Back up your tasks or restore them from a FocusBoard file.</p>
            </div>
          </header>

          <div className="settings-data-actions">
            <button
              className="settings-action-button"
              onClick={exportTasks}
              type="button"
            >
              <Download aria-hidden="true" size={17} />
              <span>Export tasks</span>
            </button>
            <button
              className="settings-action-button"
              onClick={() => fileInputRef.current?.click()}
              type="button"
            >
              <Upload aria-hidden="true" size={17} />
              <span>Import tasks</span>
            </button>
            <input
              accept=".json,application/json"
              aria-label="Choose a FocusBoard task backup"
              className="sr-only"
              onChange={handleImportSelection}
              ref={fileInputRef}
              tabIndex={-1}
              type="file"
            />
          </div>

          <div className="settings-storage-note">
            <Database aria-hidden="true" size={17} />
            <p>
              Tasks are stored locally in this browser using localStorage. They
              are not synced across devices.
            </p>
          </div>

          <div className="settings-reset-row">
            <div>
              <h3>Reset tasks</h3>
              <p>Replace your current tasks with the original sample tasks.</p>
            </div>
            <button
              className="settings-reset-button"
              onClick={() => {
                setFeedback(null)
                setPendingAction({ type: 'reset' })
              }}
              type="button"
            >
              <RotateCcw aria-hidden="true" size={16} />
              <span>Reset tasks</span>
            </button>
          </div>
        </section>

        {feedback && (
          <p
            className={`settings-feedback settings-feedback--${feedback.type}`}
            role={feedback.type === 'error' ? 'alert' : 'status'}
          >
            {feedback.message}
          </p>
        )}
      </div>

      <ConfirmDialog
        cancelLabel="Cancel"
        confirmLabel={isResetAction ? 'Reset tasks' : 'Replace tasks'}
        message={
          isResetAction
            ? `This will replace your current tasks with the ${getTaskCountLabel(initialTasks.length)} from the original sample data. Your theme and preferences will not change.`
            : `This will replace your current ${getTaskCountLabel(tasks.length)} with ${getTaskCountLabel(pendingAction?.tasks.length ?? 0)} from the selected backup. Your theme and preferences will not change.`
        }
        onCancel={() => setPendingAction(null)}
        onConfirm={confirmPendingAction}
        open={Boolean(pendingAction)}
        title={isResetAction ? 'Reset all tasks?' : 'Replace current tasks?'}
      />
    </main>
  )
}

export default SettingsPage
