import { ChevronDown, UserRound } from 'lucide-react'

function Header() {
  return (
    <header className="topbar">
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <ol>
          <li>
            <a href="#workspace">Workspace</a>
          </li>
          <li aria-current="page">Overview</li>
        </ol>
      </nav>
      <div className="profile-area" role="group" aria-label="User profile">
        <span className="profile-area__avatar">
          <UserRound aria-hidden="true" size={18} />
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
