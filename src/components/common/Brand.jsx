import { Link } from 'react-router-dom'

function Brand({ className, to = '/' }) {
  return (
    <Link
      aria-label="FocusBoard overview"
      className={className}
      to={to}
    >
      <span className="brand__mark" aria-hidden="true">
        <span />
        <span />
        <span />
        <span />
      </span>
      <span className="brand__name">FocusBoard</span>
    </Link>
  )
}

export default Brand
