
import { ArrowRight, CircleCheck, Clock3, ListTodo, Plus } from 'lucide-react'
import { useState } from 'react'
import Header from './components/layout/Header.jsx'
import MobileNav from './components/layout/MobileNav.jsx'
import Sidebar from './components/layout/Sidebar.jsx'
import FocusCarousel from './components/dashboard/FocusCarousel.jsx'
import StatsCards from './components/dashboard/StatsCards.jsx'
import TaskFilters from './components/tasks/TaskFilters.jsx'
import TaskList from './components/tasks/TaskList.jsx'
import initialTasks from './data/initialTasks.js'
import { filterTasks } from './utils/taskHelpers.js'
import './App.css'

const focusNotes = [
  {
    title: 'Make today count.',
    subtitle: 'A little focus goes a long way.',
  },
  {
    title: 'One thing at a time.',
    subtitle: 'Give your next priority your full attention.',
  },
  {
    title: 'Make space to focus.',
    subtitle: 'Small, steady steps add up to meaningful progress.',
  },
]

const referenceStats = [
  {
    label: 'Total tasks',
    value: 12,
    description: 'Across all projects',
    icon: ListTodo,
  },
  {
    label: 'In progress',
    value: 5,
    description: 'Keep the momentum',
    icon: Clock3,
  },
  {
    label: 'Completed',
    value: 7,
    description: 'Great work this week',
    icon: CircleCheck,
  },
]

function App({ onCreateTask }) {
  const [activeFilter, setActiveFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [priority, setPriority] = useState('all')

  const filteredTasks = filterTasks(
    initialTasks,
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
                  Your work, in focus.
                </h1>
                <p className="dashboard-intro__subtitle">
                  Bring your priorities together and make room for meaningful
                  progress.
                </p>
              </div>
              <button
                className="primary-action"
                type="button"
                onClick={onCreateTask}
              >
                <Plus aria-hidden="true" size={18} />
                <span>New Task</span>
              </button>
            </section>

            <FocusCarousel items={focusNotes} previewTask={initialTasks[0]} />

            <StatsCards stats={referenceStats} />

            <section
              className="task-section"
              id="tasks"
              aria-labelledby="my-tasks-title"
            >
              <div className="task-section__heading">
                <div>
                  <h2 id="my-tasks-title">My Tasks</h2>
                  <p>Keep track of what needs your attention.</p>
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
                  View all Tasks
                  <ArrowRight aria-hidden="true" size={14} />
                </button>
              </div>
              <TaskFilters
                activeFilter={activeFilter}
                onFilterChange={setActiveFilter}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                priority={priority}
                onPriorityChange={setPriority}
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
