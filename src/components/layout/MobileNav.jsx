import {
  CalendarDays,
  CheckSquare,
  LayoutDashboard,
  Settings,
} from 'lucide-react'

const navigationItems = [
  { id: 'overview', label: 'Overview', href: '#overview', icon: LayoutDashboard },
  { id: 'tasks', label: 'Tasks', href: '#tasks', icon: CheckSquare },
  { id: 'calendar', label: 'Calendar', href: '#calendar', icon: CalendarDays },
  { id: 'settings', label: 'Settings', href: '#settings', icon: Settings },
]

function MobileNav({ activeItem = 'overview', onNavigate }) {
  return (
    <nav className="mobile-nav" aria-label="Mobile navigation">
      {navigationItems.map(({ id, label, href, icon: Icon }) => (
        <a
          aria-current={activeItem === id ? 'page' : undefined}
          className="mobile-nav__link"
          href={href}
          key={id}
          onClick={() => onNavigate?.(id)}
        >
          <Icon aria-hidden="true" size={19} strokeWidth={1.9} />
          <span>{label}</span>
        </a>
      ))}
    </nav>
  )
}

export default MobileNav
