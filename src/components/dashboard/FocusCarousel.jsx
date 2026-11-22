function FocusCarousel({ items = [] }) {
  return (
    <section aria-label="Focus suggestions">
      {items.map((item) => (
        <article key={item.id}>
          <h2>{item.title}</h2>
          {item.description && <p>{item.description}</p>}
        </article>
      ))}
    </section>
  )
}

export default FocusCarousel
