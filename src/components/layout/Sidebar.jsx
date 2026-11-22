import {
  CalendarDays,
  CircleDot,
  LayoutGrid,
  List,
} from 'lucide-react'
import Brand from '../common/Brand.jsx'
import ProfileAvatar from '../common/ProfileAvatar.jsx'

const navigationItems = [
  { id: 'overview', label: 'Overview', href: '#overview', icon: LayoutGrid },
  { id: 'tasks', label: 'My tasks', href: '#tasks', icon: List },
  { id: 'calendar', label: 'Calendar', href: '#calendar', icon: CalendarDays },
  { id: 'settings', label: 'Settings', href: '#settings', icon: CircleDot },
]

function Sidebar({
  activeItem = 'overview',
  onNavigate,
  onOpenProfile,
  profile,
}) {
  return (
    <aside className="sidebar">
      <Brand className="sidebar__brand" />
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
      <button
        aria-label={`Open profile settings for ${profile.name}`}
        className="sidebar__profile"
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
