import { Bell, Search } from 'lucide-react'

function Header({ onSearch }) {
  return (
    <header>
      <label>
        <Search aria-hidden="true" size={18} />
        <span className="sr-only">Search tasks</span>
        <input
          type="search"
          placeholder="Search tasks"
          onChange={(event) => onSearch?.(event.target.value)}
        />
      </label>
      <button type="button" aria-label="Notifications">
        <Bell aria-hidden="true" size={18} />
      </button>
    </header>
  )
}

export default Header
