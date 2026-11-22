import { BarChart3, CheckSquare, LayoutDashboard, Settings } from 'lucide-react'

const navigationItems = [
  { label: 'Dashboard', icon: LayoutDashboard },
  { label: 'Tasks', icon: CheckSquare },
  { label: 'Reports', icon: BarChart3 },
  { label: 'Settings', icon: Settings },
]

function Sidebar() {
  return (
    <aside aria-label="Main navigation">
      <nav>
        {navigationItems.map(({ label, icon: Icon }) => (
          <a href="#" key={label}>
            <Icon aria-hidden="true" size={18} />
            <span>{label}</span>
          </a>
        ))}
      </nav>
    </aside>
  )
}

export default Sidebar
