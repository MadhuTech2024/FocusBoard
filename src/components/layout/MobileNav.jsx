import { BarChart3, CheckSquare, LayoutDashboard } from 'lucide-react'

const navigationItems = [
  { label: 'Home', icon: LayoutDashboard },
  { label: 'Tasks', icon: CheckSquare },
  { label: 'Reports', icon: BarChart3 },
]

function MobileNav() {
  return (
    <nav aria-label="Mobile navigation">
      {navigationItems.map(({ label, icon: Icon }) => (
        <a href="#" key={label}>
          <Icon aria-hidden="true" size={18} />
          <span>{label}</span>
        </a>
      ))}
    </nav>
  )
}

export default MobileNav
