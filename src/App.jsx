
import { CircleCheck, Clock3, ListTodo, Plus } from 'lucide-react'
import { useState } from 'react'
import Header from './components/layout/Header.jsx'
import MobileNav from './components/layout/MobileNav.jsx'
import Sidebar from './components/layout/Sidebar.jsx'
import FocusCarousel from './components/dashboard/FocusCarousel.jsx'
import StatsCards from './components/dashboard/StatsCards.jsx'
import TaskFilters from './components/tasks/TaskFilters.jsx'
import TaskList from './components/tasks/TaskList.jsx'
import useTasks from './hooks/useTasks.js'
import { filterTasks, getTaskStats } from './utils/taskHelpers.js'
import './App.css'

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

function App({ onCreateTask }) {
  const [activeFilter, setActiveFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [priority, setPriority] = useState('all')
  const { tasks } = useTasks()
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
      value: taskStats.active,
      description: 'Keep the momentum',
      icon: Clock3,
    },
    {
      label: 'Completed',
      value: taskStats.completed,
      description: 'Great work this week',
      icon: CircleCheck,
    },
  ]

  const filteredTasks = filterTasks(
    tasks,
    activeFilter === 'in-progress' ? 'active' : activeFilter,
  ).filter((task) => {
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
      <Sidebar activeItem="overview" />
      <div className="main-shell">
        <Header />
        <main className="dashboard-main" id="overview">
          <div className="dashboard-content">
            <section className="dashboard-intro" aria-labelledby="dashboard-title">
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
                onClick={onCreateTask}
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
                  onClick={onCreateTask}
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
              <TaskList tasks={filteredTasks} />
            </section>
          </div>
        </main>
      </div>
      <MobileNav activeItem="overview" />
    </div>
  )
}

export default App
