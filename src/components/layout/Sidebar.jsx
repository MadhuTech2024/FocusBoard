import {
  CalendarDays,
  CircleDot,
  LayoutGrid,
  List,
} from 'lucide-react'

const navigationItems = [
  { id: 'overview', label: 'Overview', href: '#overview', icon: LayoutGrid },
  { id: 'tasks', label: 'My tasks', href: '#tasks', icon: List },
  { id: 'calendar', label: 'Calendar', href: '#calendar', icon: CalendarDays },
  { id: 'settings', label: 'Settings', href: '#settings', icon: CircleDot },
]

function Sidebar({ activeItem = 'overview', onNavigate }) {
  return (
    <aside className="sidebar">
      <a className="sidebar__brand" href="#overview" aria-label="FocusBoard overview">
        <span className="sidebar__brand-mark" aria-hidden="true">
          <span />
          <span />
          <span />
          <span />
        </span>
        <span>FocusBoard</span>
      </a>
      <p className="sidebar__section-label">WORKSPACE</p>
      <nav className="sidebar__nav" aria-label="Primary navigation">
        {navigationItems.map(({ id, label, href, icon: Icon }) => (
          <a
            aria-current={activeItem === id ? 'page' : undefined}
            className="sidebar__link"
            href={href}
            key={id}
            onClick={() => onNavigate?.(id)}
          >
            <Icon aria-hidden="true" size={16} strokeWidth={1.8} />
            <span>{label}</span>
          </a>
        ))}
      </nav>
    </aside>
  )
}

export default Sidebar
