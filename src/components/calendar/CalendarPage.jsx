import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  PencilLine,
} from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

const weekdays = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
]

function toDateKey(date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function parseDateKey(value) {
  if (typeof value !== 'string') {
    return null
  }

  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value)
  if (!match) {
    return null
  }

  const [, yearValue, monthValue, dayValue] = match
  const year = Number(yearValue)
  const month = Number(monthValue)
  const day = Number(dayValue)
  const date = new Date(year, month - 1, day)

  return date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
    ? date
    : null
}

function getToday() {
  return toDateKey(new Date())
}

function getCalendarDays(month) {
  const firstDay = new Date(month.getFullYear(), month.getMonth(), 1)
  const offset = firstDay.getDay()
  const numberOfDays = new Date(
    month.getFullYear(),
    month.getMonth() + 1,
    0,
  ).getDate()
  const cellCount = Math.ceil((offset + numberOfDays) / 7) * 7

  return Array.from(
    { length: cellCount },
    (_, index) =>
      new Date(month.getFullYear(), month.getMonth(), index - offset + 1),
  )
}

function formatLongDate(date) {
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(date)
}

function CalendarPage({ tasks = [], onEditTask, storageError }) {
  const [selectedDate, setSelectedDate] = useState(getToday)
  const [visibleMonth, setVisibleMonth] = useState(() => {
    const today = new Date()
    return new Date(today.getFullYear(), today.getMonth(), 1)
  })
  const dateButtonRefs = useRef(new Map())
  const pendingFocusDateRef = useRef(null)
  const todayKey = getToday()
  const calendarDays = getCalendarDays(visibleMonth)
  const weeks = Array.from(
    { length: calendarDays.length / 7 },
    (_, index) => calendarDays.slice(index * 7, index * 7 + 7),
  )
  const tasksByDate = new Map()

  for (const task of tasks) {
    const dueDate = parseDateKey(task.dueDate)
    if (!dueDate) {
      continue
    }

    const dateKey = toDateKey(dueDate)
    const dateTasks = tasksByDate.get(dateKey) ?? []
    dateTasks.push(task)
    tasksByDate.set(dateKey, dateTasks)
  }

  const selectedTasks = tasksByDate.get(selectedDate) ?? []
  const selectedDateValue = parseDateKey(selectedDate)
  const monthLabel = new Intl.DateTimeFormat('en-US', {
    month: 'long',
    year: 'numeric',
  }).format(visibleMonth)

  useEffect(() => {
    const pendingFocusDate = pendingFocusDateRef.current
    if (!pendingFocusDate) {
      return
    }

    dateButtonRefs.current.get(pendingFocusDate)?.focus()
    pendingFocusDateRef.current = null
  }, [selectedDate, visibleMonth])

  function selectDate(date) {
    const dateKey = toDateKey(date)
    setSelectedDate(dateKey)
    setVisibleMonth(new Date(date.getFullYear(), date.getMonth(), 1))
    pendingFocusDateRef.current = dateKey
  }

  function navigateMonth(offset) {
    const nextMonth = new Date(
      visibleMonth.getFullYear(),
      visibleMonth.getMonth() + offset,
      1,
    )
    const selectedDay = selectedDateValue?.getDate() ?? 1
    const lastDay = new Date(
      nextMonth.getFullYear(),
      nextMonth.getMonth() + 1,
      0,
    ).getDate()
    const nextSelectedDate = new Date(
      nextMonth.getFullYear(),
      nextMonth.getMonth(),
      Math.min(selectedDay, lastDay),
    )

    setVisibleMonth(nextMonth)
    setSelectedDate(toDateKey(nextSelectedDate))
    pendingFocusDateRef.current = null
  }

  function goToToday() {
    const today = new Date()
    setVisibleMonth(new Date(today.getFullYear(), today.getMonth(), 1))
    setSelectedDate(toDateKey(today))
    pendingFocusDateRef.current = null
  }

  function handleDateKeyDown(event, date) {
    let offset

    switch (event.key) {
      case 'ArrowLeft':
        offset = -1
        break
      case 'ArrowRight':
        offset = 1
        break
      case 'ArrowUp':
        offset = -7
        break
      case 'ArrowDown':
        offset = 7
        break
      case 'Home':
        offset = -date.getDay()
        break
      case 'End':
        offset = 6 - date.getDay()
        break
      default:
        return
    }

    event.preventDefault()
    const nextDate = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate() + offset,
    )
    selectDate(nextDate)
  }

  return (
    <main
      aria-labelledby="calendar-title"
      className="dashboard-main calendar-main"
      id="calendar"
    >
      {storageError && (
        <p className="task-storage-error" role="alert">
          {storageError}
        </p>
      )}
      <div className="calendar-page">
        <header className="calendar-page__header">
          <div className="calendar-page__intro">
            <h1 id="calendar-title">Calendar</h1>
            <p>View and organize your tasks by date.</p>
          </div>
          <div className="calendar-page__controls">
            <div className="calendar-page__month-controls">
              <button
                aria-label="Previous month"
                className="calendar-page__month-button"
                onClick={() => navigateMonth(-1)}
                type="button"
              >
                <ChevronLeft aria-hidden="true" size={18} />
              </button>
              <h2 aria-live="polite" className="calendar-page__month-label">
                {monthLabel}
              </h2>
              <button
                aria-label="Next month"
                className="calendar-page__month-button"
                onClick={() => navigateMonth(1)}
                type="button"
              >
                <ChevronRight aria-hidden="true" size={18} />
              </button>
            </div>
            <button
              className="calendar-page__today-button"
              onClick={goToToday}
              type="button"
            >
              Today
            </button>
          </div>
        </header>

        <div className="calendar-page__layout">
          <section
            aria-label={`Calendar for ${monthLabel}`}
            className="calendar-card"
          >
            <table className="calendar-grid">
              <caption className="sr-only">
                {monthLabel} calendar. Use the arrow keys to move between dates.
              </caption>
              <thead>
                <tr>
                  {weekdays.map((weekday) => (
                    <th key={weekday} scope="col">
                      <abbr title={weekday}>{weekday.slice(0, 3)}</abbr>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {weeks.map((week) => (
                  <tr key={toDateKey(week[0])}>
                    {week.map((date) => {
                      const dateKey = toDateKey(date)
                      const isSelected = dateKey === selectedDate
                      const isToday = dateKey === todayKey
                      const isCurrentMonth =
                        date.getMonth() === visibleMonth.getMonth()
                      const dateTaskCount = tasksByDate.get(dateKey)?.length ?? 0
                      const dateLabel = formatLongDate(date)

                      return (
                        <td key={dateKey}>
                          <button
                            aria-current={isToday ? 'date' : undefined}
                            aria-label={`${dateLabel}, ${dateTaskCount} ${
                              dateTaskCount === 1 ? 'task' : 'tasks'
                            }`}
                            aria-pressed={isSelected}
                            className={[
                              'calendar-date',
                              !isCurrentMonth && 'is-outside-month',
                              isToday && 'is-today',
                              isSelected && 'is-selected',
                            ].filter(Boolean).join(' ')}
                            onClick={() => selectDate(date)}
                            onKeyDown={(event) => handleDateKeyDown(event, date)}
                            ref={(element) => {
                              if (element) {
                                dateButtonRefs.current.set(dateKey, element)
                              } else {
                                dateButtonRefs.current.delete(dateKey)
                              }
                            }}
                            tabIndex={isSelected ? 0 : -1}
                            type="button"
                          >
                            <span className="calendar-date__number">
                              {date.getDate()}
                            </span>
                            {dateTaskCount > 0 && (
                              <span
                                aria-hidden="true"
                                className="calendar-date__task-count"
                              >
                                {dateTaskCount}{' '}
                                {dateTaskCount === 1 ? 'task' : 'tasks'}
                              </span>
                            )}
                          </button>
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          <section
            aria-labelledby="calendar-selected-date"
            aria-live="polite"
            className="calendar-tasks-card"
          >
            <header className="calendar-tasks-card__header">
              <div>
                <h2 id="calendar-selected-date">
                  {selectedDateValue ? formatLongDate(selectedDateValue) : ''}
                </h2>
                <p>
                  {selectedTasks.length}{' '}
                  {selectedTasks.length === 1 ? 'task' : 'tasks'} scheduled
                </p>
              </div>
              <CalendarDays aria-hidden="true" size={20} />
            </header>

            {selectedTasks.length > 0 ? (
              <ul className="calendar-task-list">
                {selectedTasks.map((task) => (
                  <li key={task.id}>
                    <button
                      aria-label={`Edit task: ${task.title}`}
                      className="calendar-task"
                      onClick={() => onEditTask(task)}
                      type="button"
                    >
                      <span className="calendar-task__title">
                        {task.title}
                      </span>
                      <span className="calendar-task__details">
                        <span className="calendar-task__category">
                          {task.category}
                        </span>
                        <span
                          className={`task-priority task-priority--${task.priority.toLowerCase()}`}
                        >
                          {task.priority}
                        </span>
                        <span className="calendar-task__status">
                          {task.status}
                        </span>
                      </span>
                      <PencilLine
                        aria-hidden="true"
                        className="calendar-task__edit-icon"
                        size={15}
                      />
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="calendar-tasks-card__empty">
                <CalendarDays aria-hidden="true" size={24} />
                <p>No tasks scheduled for this date.</p>
                <span>Tasks without a due date are not shown here.</span>
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  )
}

export default CalendarPage
