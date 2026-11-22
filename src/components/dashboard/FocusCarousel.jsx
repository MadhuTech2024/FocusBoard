import { useRef, useState } from 'react'
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Clock3,
} from 'lucide-react'

const statusIcons = {
  next: Check,
  'in-progress': Clock3,
  completed: Check,
}

function FocusCarousel({ items = [], previewTask, taskCount = 0 }) {
  const [activeIndex, setActiveIndex] = useState(0)
  const touchStartX = useRef(null)

  if (items.length === 0) {
    return null
  }

  function showSlide(index) {
    setActiveIndex((index + items.length) % items.length)
  }

  function handleTouchStart(event) {
    touchStartX.current = event.changedTouches[0]?.clientX ?? null
  }

  function handleTouchEnd(event) {
    const touchEndX = event.changedTouches[0]?.clientX
    if (touchStartX.current === null || touchEndX === undefined) {
      return
    }

    const distance = touchStartX.current - touchEndX
    if (Math.abs(distance) > 40) {
      showSlide(activeIndex + (distance > 0 ? 1 : -1))
    }
    touchStartX.current = null
  }

  const activeItem = items[activeIndex]
  const mobileSubtitle =
    activeItem.status === 'next'
      ? `${taskCount} tasks waiting for your attention.`
      : (activeItem.mobileSubtitle ?? activeItem.subtitle)
  const slideNumber = String(activeIndex + 1).padStart(2, '0')
  const totalSlides = String(items.length).padStart(2, '0')
  const taskTitle = activeItem.taskTitle ?? previewTask?.title
  const progress = activeItem.progress ?? 0
  const StatusIcon = statusIcons[activeItem.status] ?? Check

  return (
    <section
      className="focus-carousel"
      aria-label="Focus Notes"
      onTouchEnd={handleTouchEnd}
      onTouchStart={handleTouchStart}
    >
      <div className="focus-carousel__content">
        <div className="focus-carousel__topline">
          <p className="focus-carousel__label focus-carousel__label--desktop">
            FOCUS NOTES
          </p>
          <p className="focus-carousel__label focus-carousel__label--mobile">
            GOOD AFTERNOON
          </p>
          <p className="focus-carousel__count focus-carousel__count--desktop">
            {slideNumber} / {totalSlides}
          </p>
        </div>
        <div className="focus-carousel__message" aria-live="polite">
          <h2>
            <span className="focus-carousel__text--desktop">
              {activeItem.title}
            </span>
            <span className="focus-carousel__text--mobile">
              {activeItem.mobileTitle ?? activeItem.title}
            </span>
          </h2>
          <p className="focus-carousel__text--desktop">{activeItem.subtitle}</p>
          <p className="focus-carousel__text--mobile">
            {mobileSubtitle}
          </p>
        </div>
        <div className="focus-carousel__footer">
          <div
            className="focus-carousel__indicators"
            role="group"
            aria-label="Focus note slides"
          >
            {items.map((item, index) => (
              <button
                aria-label={`Show focus note ${index + 1}`}
                aria-pressed={activeIndex === index}
                className={
                  activeIndex === index
                    ? 'focus-carousel__indicator is-active'
                    : 'focus-carousel__indicator'
                }
                key={`${item.title}-${index}`}
                onClick={() => showSlide(index)}
                type="button"
              />
            ))}
          </div>
        </div>
        <div className="focus-carousel__mobile-progress">
          <div
            className="focus-carousel__mobile-progress-track"
            role="progressbar"
            aria-label="Today's focus progress"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={progress}
          >
            <span style={{ width: `${progress}%` }} />
          </div>
          <span>{progress}%</span>
        </div>
      </div>
      {taskTitle && (
        <aside
          className="focus-preview"
          aria-label={`${activeItem.statusLabel ?? 'Task'}: ${taskTitle}`}
        >
          <span className="focus-preview__backdrop" aria-hidden="true" />
          <div className="focus-preview__card">
            <div className="focus-preview__topline">
              <span
                className={`focus-preview__status-icon focus-preview__status-icon--${activeItem.status ?? 'next'}`}
                aria-hidden="true"
              >
                <StatusIcon size={10} strokeWidth={2.5} />
              </span>
              <span className="focus-preview__status-label">
                {activeItem.statusLabel ?? 'NEXT UP'}
              </span>
            </div>
            <h3>{taskTitle}</h3>
            <div className="focus-preview__progress-row">
              <div
                className="focus-preview__progress-track"
                role="progressbar"
                aria-label={`${taskTitle} progress`}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={progress}
              >
                <span style={{ width: `${progress}%` }} />
              </div>
              <span className="focus-preview__percentage">{progress}%</span>
            </div>
          </div>
        </aside>
      )}
      <div className="focus-carousel__controls">
        <button
          aria-label="Previous focus note"
          onClick={() => showSlide(activeIndex - 1)}
          type="button"
        >
          <ChevronLeft aria-hidden="true" size={16} />
        </button>
        <button
          aria-label="Next focus note"
          onClick={() => showSlide(activeIndex + 1)}
          type="button"
        >
          <ChevronRight aria-hidden="true" size={16} />
        </button>
      </div>
    </section>
  )
}

export default FocusCarousel
