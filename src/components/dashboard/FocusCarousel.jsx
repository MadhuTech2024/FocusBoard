import { useState } from 'react'
import { CalendarDays, ChevronLeft, ChevronRight } from 'lucide-react'

function FocusCarousel({ items = [], previewTask }) {
  const [activeIndex, setActiveIndex] = useState(0)

  if (items.length === 0) {
    return null
  }

  function showSlide(index) {
    setActiveIndex((index + items.length) % items.length)
  }

  const activeItem = items[activeIndex]
  const slideNumber = String(activeIndex + 1).padStart(2, '0')
  const totalSlides = String(items.length).padStart(2, '0')

  return (
    <section className="focus-carousel" aria-label="Focus Notes">
      <div className="focus-carousel__content">
        <div className="focus-carousel__topline">
          <p className="focus-carousel__label">FOCUS NOTES</p>
          <p className="focus-carousel__count">
            <span>{slideNumber}</span> / {totalSlides}
          </p>
        </div>
        <div className="focus-carousel__message" aria-live="polite">
          <h2>{activeItem.title}</h2>
          <p>{activeItem.subtitle}</p>
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
          <div className="focus-carousel__controls">
            <button
              aria-label="Previous focus note"
              onClick={() => showSlide(activeIndex - 1)}
              type="button"
            >
              <ChevronLeft aria-hidden="true" size={18} />
            </button>
            <button
              aria-label="Next focus note"
              onClick={() => showSlide(activeIndex + 1)}
              type="button"
            >
              <ChevronRight aria-hidden="true" size={18} />
            </button>
          </div>
        </div>
      </div>
      {previewTask && (
        <aside className="focus-preview" aria-label="Task preview">
          <div className="focus-preview__topline">
            <span>UP NEXT</span>
            {previewTask.dueDate && (
              <span className="focus-preview__date">
                <CalendarDays aria-hidden="true" size={13} />
                {previewTask.dueDate}
              </span>
            )}
          </div>
          <h3>{previewTask.title}</h3>
          <p>{previewTask.description}</p>
          {previewTask.category && (
            <span className="focus-preview__category">{previewTask.category}</span>
          )}
        </aside>
      )}
    </section>
  )
}

export default FocusCarousel
