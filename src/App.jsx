
import { CircleCheck, Clock3, ListTodo } from 'lucide-react'
import { useState } from 'react'
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import ConfirmDialog from './components/common/ConfirmDialog.jsx'
import CalendarPage from './components/calendar/CalendarPage.jsx'
import ProfilePage from './components/settings/ProfilePage.jsx'
import SettingsPage from './components/settings/SettingsPage.jsx'
import Header from './components/layout/Header.jsx'
import MobileNav from './components/layout/MobileNav.jsx'
import Sidebar from './components/layout/Sidebar.jsx'
import FocusCarousel from './components/dashboard/FocusCarousel.jsx'
import StatsCards from './components/dashboard/StatsCards.jsx'
import TaskSection from './components/tasks/TaskSection.jsx'
import TaskModal from './components/tasks/TaskModal.jsx'
import usePreferences from './hooks/usePreferences.js'
import useProfile from './hooks/useProfile.js'
import useTasks from './hooks/useTasks.js'
import { filterTasks, getTaskStats } from './utils/taskHelpers.js'

const focusNotes = [
  {
    title: 'Make today count.',
    mobileTitle: 'Make today count',
    subtitle: 'A little focus goes a long way.',
    status: 'next',
    statusLabel: 'NEXT UP',
    taskTitle: 'Design landing page',
  },
  {
    title: 'Small steps, big progress.',
    mobileTitle: 'Small steps, big progress',
    subtitle: 'Keep your priorities in view.',
    mobileSubtitle: 'Keep your priorities in view.',
    status: 'in-progress',
    statusLabel: 'IN PROGRESS',
    taskTitle: 'Fix mobile navigation',
  },
  {
    title: 'Celebrate the wins.',
    mobileTitle: 'Celebrate the wins',
    subtitle: 'Every completed task moves you forward.',
    mobileSubtitle: 'Every completed task moves you forward.',
    status: 'completed',
    statusLabel: 'COMPLETED',
    taskTitle: 'Onboarding copy',
  },
]

function App() {
  const location = useLocation()
  const navigate = useNavigate()
  const currentPath = location.pathname.replace(/\/+$/, '') || '/'
  const routePages = {
    '/': 'overview',
    '/tasks': 'tasks',
    '/calendar': 'calendar',
    '/settings': 'settings',
    '/profile': 'profile',
  }
  const activeNavItem = routePages[currentPath] ?? 'overview'
  const [activeFilter, setActiveFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [priority, setPriority] = useState('all')
  const [taskDialogOpen, setTaskDialogOpen] = useState(false)
  const [editingTask, setEditingTask] = useState(null)
  const [taskToDelete, setTaskToDelete] = useState(null)
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

  function openCreateTask() {
    setEditingTask(null)
    setTaskDialogOpen(true)
  }

  function openProfileSettings() {
    navigate('/profile')
  }

  function openAllTasks() {
    setActiveFilter('all')
    setSearchQuery('')
    setPriority('all')
    navigate('/tasks')
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
  const taskSectionProps = {
    activeFilter,
    onCreateTask: openCreateTask,
    onDelete: setTaskToDelete,
    onEdit: openEditTask,
    onFilterChange: setActiveFilter,
    onPriorityChange: setPriority,
    onSearchChange: setSearchQuery,
    onStatusChange: updateTaskStatus,
    onViewAll: openAllTasks,
    priority,
    searchQuery,
    tasks: filteredTasks,
    totalCount: taskStats.total,
  }

  return (
    <div className="app-shell">
      <Sidebar
        activeItem={activeNavItem}
        onOpenProfile={openProfileSettings}
        profile={profile}
      />
      <div className="main-shell">
        <Header
          activeItem={activeNavItem}
          onOpenProfile={openProfileSettings}
          profile={profile}
        />
        <Routes>
          <Route
            element={
              <main className="dashboard-main" id="overview">
                {storageError && (
                  <p className="task-storage-error" role="alert">
                    {storageError}
                  </p>
                )}
                <div className="dashboard-content">
                  <section
                    aria-labelledby="dashboard-title"
                    className="dashboard-intro"
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
                      onClick={openCreateTask}
                      type="button"
                    >
                      New task
                    </button>
                  </section>
                  <FocusCarousel
                    completionPercentage={taskStats.completionPercentage}
                    items={focusNotes}
                    taskCount={taskStats.total}
                  />
                  <StatsCards stats={stats} />
                  <TaskSection {...taskSectionProps} />
                </div>
              </main>
            }
            path="/"
          />
          <Route
            element={
              <main className="dashboard-main tasks-main">
                {storageError && (
                  <p className="task-storage-error" role="alert">
                    {storageError}
                  </p>
                )}
                <TaskSection {...taskSectionProps} standalone />
              </main>
            }
            path="/tasks"
          />
          <Route
            element={
              <CalendarPage
                onEditTask={openEditTask}
                storageError={storageError}
                tasks={tasks}
              />
            }
            path="/calendar"
          />
          <Route
            element={
              <SettingsPage
                onPreferencesChange={updatePreferences}
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
            }
            path="/settings"
          />
          <Route
            element={
              <ProfilePage
                onSaveProfile={saveProfile}
                profile={profile}
                profileError={profileError}
              />
            }
            path="/profile"
          />
          <Route element={<Navigate replace to="/" />} path="*" />
        </Routes>
      </div>
      <MobileNav />
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
