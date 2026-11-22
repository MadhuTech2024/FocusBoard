import { ChevronDown } from 'lucide-react'
import Brand from '../common/Brand.jsx'
import ProfileAvatar from '../common/ProfileAvatar.jsx'

const breadcrumbLabels = {
  overview: 'Overview',
  tasks: 'My tasks',
  calendar: 'Calendar',
  settings: 'Settings',
}

function Header({
  activeItem = 'overview',
  onOpenProfile,
  profile,
}) {
  return (
    <header className="topbar">
      <Brand className="topbar__brand" />
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <ol>
          <li>
            <a href="#workspace">Workspace</a>
          </li>
          <li aria-current="page">{breadcrumbLabels[activeItem] ?? 'Overview'}</li>
        </ol>
      </nav>
      <button
        aria-label={`Open profile settings for ${profile.name}`}
        className="profile-area"
        onClick={onOpenProfile}
        type="button"
      >
        <ProfileAvatar
          avatar={profile.avatar}
          className="profile-area__avatar"
          name={profile.name}
        />
        <ChevronDown
          className="profile-area__chevron"
          aria-hidden="true"
          size={15}
        />
      </button>
    </header>
  )
}

export default Header
