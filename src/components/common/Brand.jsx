function Brand({ className, href = '#overview' }) {
  return (
    <a
      aria-label="FocusBoard overview"
      className={className}
      href={href}
    >
      <span className="brand__mark" aria-hidden="true">
        <span />
        <span />
        <span />
        <span />
      </span>
      <span className="brand__name">FocusBoard</span>
    </a>
  )
}

export default Brand
