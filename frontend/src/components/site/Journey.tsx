const steps = [
  {
    n: "01",
    title: "Discover",
    desc: "Scroll an editorial feed of curated sets. No noise, no algorithm chaos — only taste.",
  },
  {
    n: "02",
    title: "Compose",
    desc: "Open the Lab. Build a set finger-by-finger, or remix a piece from the community.",
  },
  {
    n: "03",
    title: "Book",
    desc: "Time, price, and difficulty are calculated automatically from your design’s complexity.",
  },
  {
    n: "04",
    title: "Wear",
    desc: "Your artist receives your exact composition — shape, finish, chrome, gem placement.",
  },
  {
    n: "05",
    title: "Archive",
    desc: "Every set you wear is saved to your private universe. Re-book in one tap.",
  },
];

export function Journey() {
  return (
    <section id="journey" className="relative border-t border-border py-32 md:py-48">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        <div className="mb-20">
          <p className="text-[10px] uppercase tracking-[0.4em] text-muted-foreground">
            <span className="text-chrome">04</span> — The Journey
          </p>
          <h2 className="mt-6 font-display text-5xl leading-[0.95] md:text-7xl">
            From inspiration<br />to execution.
          </h2>
        </div>

        <div className="grid gap-px bg-border md:grid-cols-5">
          {steps.map((s) => (
            <div
              key={s.n}
              className="group relative bg-background p-8 transition-colors duration-500 hover:bg-card md:p-10"
            >
              <p className="font-mono text-xs text-muted-foreground">{s.n}</p>
              <h3 className="mt-8 font-display text-3xl md:text-4xl">{s.title}</h3>
              <p className="mt-4 text-sm text-muted-foreground">{s.desc}</p>
              <div
                className="mt-10 h-px w-8 transition-all duration-700 group-hover:w-full"
                style={{ background: "var(--gradient-chrome)" }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
