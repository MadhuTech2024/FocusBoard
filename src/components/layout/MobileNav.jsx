import {
  CalendarDays,
  CheckSquare,
  LayoutDashboard,
  Settings,
} from 'lucide-react'
import { NavLink } from 'react-router-dom'

const navigationItems = [
  { id: 'overview', label: 'Overview', to: '/', icon: LayoutDashboard },
  { id: 'tasks', label: 'Tasks', to: '/tasks', icon: CheckSquare },
  { id: 'calendar', label: 'Calendar', to: '/calendar', icon: CalendarDays },
  { id: 'settings', label: 'Settings', to: '/settings', icon: Settings },
]

function MobileNav() {
  return (
    <nav className="mobile-nav" aria-label="Mobile navigation">
      {navigationItems.map(({ id, label, to, icon: Icon }) => (
        <NavLink
          className={({ isActive }) =>
          isActive ? 'mobile-nav__link is-active' : 'mobile-nav__link'
          }
          end
          key={id}
          to={to}
        >
          <Icon aria-hidden="true" size={19} strokeWidth={1.9} />
          <span>{label}</span>
        </NavLink>
      ))}
    </nav>
  )
}

export default MobileNav
