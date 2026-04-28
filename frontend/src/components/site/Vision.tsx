export function Vision() {
  return (
    <section id="vision" className="relative border-t border-border bg-background py-32 md:py-48">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        <div className="grid gap-16 md:grid-cols-12">
          <div className="md:col-span-4">
            <p className="text-[10px] uppercase tracking-[0.4em] text-muted-foreground">
              <span className="text-chrome">01</span> — Vision
            </p>
            <p className="mt-6 text-xs uppercase tracking-[0.3em] text-foreground/60">
              The end of saying<br />“something like this”
            </p>
          </div>
          <div className="md:col-span-8">
            <h2 className="font-display text-4xl leading-[1.05] md:text-6xl lg:text-7xl">
              Design is a <span className="italic text-mirror">universal language</span>.
              We built a platform where what you imagine
              is what you wear.
            </h2>
            <div className="mt-12 grid gap-10 md:grid-cols-2">
              <p className="text-base text-muted-foreground md:text-lg">
                In every salon, in every city, the same thing happens — clients
                struggle to describe a shape, a finish, a chrome, a vibe. Words
                fail. Photos almost work. Hands pretend to understand.
              </p>
              <p className="text-base text-muted-foreground md:text-lg">
                LaPrincesse replaces translation with composition. You build your
                set visually — shape, length, base, finish, gems, art — and the
                artist executes from a single source of truth.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
