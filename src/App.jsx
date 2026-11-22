
import { CircleCheck, Clock3, ListTodo, Plus } from 'lucide-react'
import { useEffect, useState } from 'react'
import ConfirmDialog from './components/common/ConfirmDialog.jsx'
import CalendarPage from './components/calendar/CalendarPage.jsx'
import SettingsPage from './components/settings/SettingsPage.jsx'
import Header from './components/layout/Header.jsx'
import MobileNav from './components/layout/MobileNav.jsx'
import Sidebar from './components/layout/Sidebar.jsx'
import FocusCarousel from './components/dashboard/FocusCarousel.jsx'
import StatsCards from './components/dashboard/StatsCards.jsx'
import TaskFilters from './components/tasks/TaskFilters.jsx'
import TaskList from './components/tasks/TaskList.jsx'
import TaskModal from './components/tasks/TaskModal.jsx'
import usePreferences from './hooks/usePreferences.js'
import useProfile from './hooks/useProfile.js'
import useTasks from './hooks/useTasks.js'
import { filterTasks, getTaskStats } from './utils/taskHelpers.js'

const navigationItems = ['overview', 'tasks', 'calendar', 'settings']

function getNavigationItem() {
  const hashItem = window.location.hash.slice(1)
  return navigationItems.includes(hashItem) ? hashItem : 'overview'
}

const focusNotes = [
  {
    title: 'Make today count.',
    mobileTitle: 'Make today count',
    subtitle: 'A little focus goes a long way.',
    status: 'next',
    statusLabel: 'NEXT UP',
    taskTitle: 'Design landing page',
    progress: 62,
  },
  {
    title: 'Small steps, big progress.',
    mobileTitle: 'Small steps, big progress',
    subtitle: 'Keep your priorities in view.',
    mobileSubtitle: 'Keep your priorities in view.',
    status: 'in-progress',
    statusLabel: 'IN PROGRESS',
    taskTitle: 'Fix mobile navigation',
    progress: 65,
  },
  {
    title: 'Celebrate the wins.',
    mobileTitle: 'Celebrate the wins',
    subtitle: 'Every completed task moves you forward.',
    mobileSubtitle: 'Every completed task moves you forward.',
    status: 'completed',
    statusLabel: 'COMPLETED',
    taskTitle: 'Onboarding copy',
    progress: 100,
  },
]

function App() {
  const [activeNavItem, setActiveNavItem] = useState(getNavigationItem)
  const [activeFilter, setActiveFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [priority, setPriority] = useState('all')
  const [taskDialogOpen, setTaskDialogOpen] = useState(false)
  const [editingTask, setEditingTask] = useState(null)
  const [taskToDelete, setTaskToDelete] = useState(null)
  const [focusProfile, setFocusProfile] = useState(false)
  const { preferences, preferencesError, updatePreferences } = usePreferences()
  const { profile, profileError, saveProfile } = useProfile()
  const {
    tasks,
    addTask,
    updateTask,
    deleteTask,
    replaceTasks,
    resetTasks,
    updateTaskStatus,
    storageError,
  } = useTasks()
  const isCalendarPage = activeNavItem === 'calendar'
  const isSettingsPage = activeNavItem === 'settings'
  const taskStats = getTaskStats(tasks)
  const stats = [
    {
      label: 'Total tasks',
      value: taskStats.total,
      description: 'Across all projects',
      icon: ListTodo,
    },
    {
      label: 'In progress',
      value: taskStats.inProgress,
      description: 'Keep the momentum',
      icon: Clock3,
    },
    {
      label: 'Completed',
      value: taskStats.completed,
      description: `${taskStats.completionPercentage}% completion rate`,
      icon: CircleCheck,
    },
  ]

  useEffect(() => {
    function syncNavigation() {
      setActiveNavItem(getNavigationItem())
    }

    window.addEventListener('hashchange', syncNavigation)
    return () => window.removeEventListener('hashchange', syncNavigation)
  }, [])

  function openCreateTask() {
    setEditingTask(null)
    setTaskDialogOpen(true)
  }

  function openProfileSettings() {
    setActiveNavItem('settings')
    setFocusProfile(true)
    if (window.location.hash !== '#settings') {
      window.location.hash = '#settings'
    }
  }

  function openEditTask(task) {
    setEditingTask(task)
    setTaskDialogOpen(true)
  }

  function handleTaskSubmit(task) {
    if (editingTask) {
      updateTask(editingTask.id, task)
    } else {
      addTask(task)
    }
    setTaskDialogOpen(false)
    setEditingTask(null)
  }

  function handleDeleteTask() {
    if (taskToDelete) {
      deleteTask(taskToDelete.id)
      setTaskToDelete(null)
    }
  }

  const filteredTasks = filterTasks(tasks, activeFilter).filter((task) => {
    const query = searchQuery.trim().toLowerCase()
    const matchesSearch =
      !query ||
      [task.title, task.description, task.category, task.priority]
        .join(' ')
        .toLowerCase()
        .includes(query)
    const matchesPriority = priority === 'all' || task.priority === priority

    return matchesSearch && matchesPriority
  })

  return (
    <div className="app-shell">
      <Sidebar
        activeItem={activeNavItem}
        onNavigate={setActiveNavItem}
        onOpenProfile={openProfileSettings}
        profile={profile}
      />
      <div className="main-shell">
        <Header
          activeItem={activeNavItem}
          onOpenProfile={openProfileSettings}
          profile={profile}
        />
        {isCalendarPage ? (
          <CalendarPage
            onEditTask={openEditTask}
            storageError={storageError}
            tasks={tasks}
          />
        ) : isSettingsPage ? (
          <SettingsPage
            focusProfile={focusProfile}
            onPreferencesChange={updatePreferences}
            onProfileFocusHandled={() => setFocusProfile(false)}
            onSaveProfile={saveProfile}
            onReplaceTasks={replaceTasks}
            onResetTasks={resetTasks}
            profile={profile}
            profileError={profileError}
            preferences={preferences}
            preferencesError={preferencesError}
            storageError={storageError}
            tasks={tasks}
          />
        ) : (
          <main className="dashboard-main" id="overview">
            {storageError && (
              <p className="task-storage-error" role="alert">
                {storageError}
              </p>
            )}
            <div className="dashboard-content">
              <section
                className="dashboard-intro"
                aria-labelledby="dashboard-title"
              >
                <div className="dashboard-intro__copy">
                  <h1 className="dashboard-intro__title" id="dashboard-title">
                    Your work,<br className="mobile-only-break" /> in focus.
                  </h1>
                  <p className="dashboard-intro__subtitle dashboard-intro__subtitle--desktop">
                    Plan your day, stay organized, and celebrate small wins.
                  </p>
                  <p className="dashboard-intro__subtitle dashboard-intro__subtitle--mobile">
                    Stay organized and keep moving forward.
                  </p>
                </div>
                <button
                  className="primary-action"
                  type="button"
                  onClick={openCreateTask}
                >
                  New task
                </button>
              </section>

              <FocusCarousel items={focusNotes} taskCount={taskStats.total} />

              <StatsCards stats={stats} />

              <section
                className="task-section"
                id="tasks"
                aria-labelledby="my-tasks-title"
              >
                <div className="task-section__heading">
                  <div>
                    <h2 id="my-tasks-title">My tasks</h2>
                    <p className="task-section__subtitle--desktop">
                      Manage and track everything in one place.
                    </p>
                    <p className="task-section__subtitle--mobile">
                      Your priorities for this week
                    </p>
                  </div>
                  <button
                    className="task-section__view-all"
                    onClick={() => {
                      setActiveFilter('all')
                      setSearchQuery('')
                      setPriority('all')
                    }}
                    type="button"
                  >
                    View all tasks
                  </button>
                  <button
                    aria-label="Create a task"
                    className="task-section__create"
                    onClick={openCreateTask}
                    type="button"
                  >
                    <Plus aria-hidden="true" size={22} />
                  </button>
                </div>
                <TaskFilters
                  activeFilter={activeFilter}
                  onFilterChange={setActiveFilter}
                  searchQuery={searchQuery}
                  onSearchChange={setSearchQuery}
                  priority={priority}
                  onPriorityChange={setPriority}
                  totalCount={taskStats.total}
                />
                <TaskList
                  onDelete={setTaskToDelete}
                  onEdit={openEditTask}
                  onStatusChange={updateTaskStatus}
                  tasks={filteredTasks}
                />
              </section>
            </div>
          </main>
        )}
      </div>
      <MobileNav activeItem={activeNavItem} onNavigate={setActiveNavItem} />
      {taskDialogOpen && (
        <TaskModal
          key={editingTask?.id ?? 'new-task'}
          onClose={() => {
            setTaskDialogOpen(false)
            setEditingTask(null)
          }}
          onSubmit={handleTaskSubmit}
          defaultPriority={preferences.defaultPriority}
          defaultStatus={preferences.defaultStatus}
          task={editingTask}
        />
      )}
      <ConfirmDialog
        cancelLabel="Keep task"
        confirmLabel="Delete task"
        message={
          taskToDelete
            ? `“${taskToDelete.title}” will be permanently removed.`
            : ''
        }
        onCancel={() => setTaskToDelete(null)}
        onConfirm={handleDeleteTask}
        open={Boolean(taskToDelete)}
        title="Delete this task?"
      />
    </div>
  )
}

export default App
