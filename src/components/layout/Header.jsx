import { ChevronDown } from 'lucide-react'
import Brand from '../common/Brand.jsx'

function Header() {
  return (
    <header className="topbar">
      <Brand className="topbar__brand" />
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <ol>
          <li>
            <a href="#workspace">Workspace</a>
          </li>
          <li aria-current="page">Overview</li>
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
