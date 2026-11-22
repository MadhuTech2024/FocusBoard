import { ChevronDown } from 'lucide-react'
import Brand from '../common/Brand.jsx'

const breadcrumbLabels = {
  overview: 'Overview',
  tasks: 'My tasks',
  calendar: 'Calendar',
  settings: 'Settings',
}

function Header({ activeItem = 'overview' }) {
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
      <div className="profile-area" role="group" aria-label="User profile">
        <span className="profile-area__avatar" aria-hidden="true">
          JD
        </span>
        <ChevronDown
          className="profile-area__chevron"
          aria-hidden="true"
          size={15}
        />
      </div>
    </header>
  )
}

export default Header
