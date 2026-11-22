function StatsCards({ stats = [] }) {
  return (
    <section aria-label="Dashboard statistics">
      {stats.map(({ label, value }) => (
        <article key={label}>
          <h2>{label}</h2>
          <p>{value}</p>
        </article>
      ))}
    </section>
  )
}

export default StatsCards
