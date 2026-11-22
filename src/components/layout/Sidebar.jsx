import {
  CalendarDays,
  CircleDot,
  LayoutGrid,
  List,
} from 'lucide-react'
import { NavLink } from 'react-router-dom'
import Brand from '../common/Brand.jsx'
import ProfileAvatar from '../common/ProfileAvatar.jsx'

const navigationItems = [
  { id: 'overview', label: 'Overview', to: '/', icon: LayoutGrid },
  { id: 'tasks', label: 'My tasks', to: '/tasks', icon: List },
  { id: 'calendar', label: 'Calendar', to: '/calendar', icon: CalendarDays },
  { id: 'settings', label: 'Settings', to: '/settings', icon: CircleDot },
]

function Sidebar({
  activeItem = 'overview',
  onOpenProfile,
  profile,
}) {
  return (
    <aside className="sidebar">
      <Brand className="sidebar__brand" />
      <p className="sidebar__section-label">WORKSPACE</p>
      <nav className="sidebar__nav" aria-label="Primary navigation">
        {navigationItems.map(({ id, label, to, icon: Icon }) => (
          <NavLink
            className={({ isActive }) =>
              isActive ? 'sidebar__link is-active' : 'sidebar__link'
            }
            end
            key={id}
            to={to}
          >
            <Icon aria-hidden="true" size={16} strokeWidth={1.8} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>
      <button
        aria-label={`Open profile settings for ${profile.name}`}
        aria-current={activeItem === 'profile' ? 'page' : undefined}
        className={`sidebar__profile${activeItem === 'profile' ? ' is-active' : ''}`}
        onClick={onOpenProfile}
        type="button"
      >
        <ProfileAvatar
          avatar={profile.avatar}
          className="sidebar__profile-avatar"
          name={profile.name}
        />
        <span className="sidebar__profile-copy">
          <span className="sidebar__profile-name">{profile.name}</span>
          <span className="sidebar__profile-subtitle">
            {profile.email || 'Local profile'}
          </span>
        </span>
      </button>
    </aside>
  )
}

export default Sidebar
