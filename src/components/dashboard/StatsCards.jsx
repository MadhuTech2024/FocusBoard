function StatsCards({ stats = [] }) {
  return (
    <section className="stats-grid" aria-label="Dashboard statistics">
      {stats.map(({ label, value, icon: Icon }) => (
        <article className="stat-card" key={label}>
          {Icon && (
            <span className="stat-card__icon" aria-hidden="true">
              <Icon size={19} strokeWidth={1.9} />
            </span>
          )}
          <div className="stat-card__content">
            <p className="stat-card__label">{label}</p>
            <p className="stat-card__value">{value}</p>
          </div>
        </article>
      ))}
    </section>
  )
}

export default StatsCards
