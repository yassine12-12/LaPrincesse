const mvp = [
  "2D composer with photoreal swatches",
  "Shape, length, base color, finish",
  "Chrome, French, negative-space, gems",
  "Per-finger composition",
  "Public + private design archive",
  "Booking with auto-calculated time & price",
];

const phase2 = [
  "Real-time 3D nails on your own hand (camera AR)",
  "Photoreal material engine — chrome, cat-eye, velvet",
  "Tooth gem placement preview",
  "Remix culture: fork any public design",
  "Artist marketplace beyond the flagship Studio",
  "AI mood-board → composition generator",
];

export function ComingNext() {
  return (
    <section
      id="coming-next"
      className="relative overflow-hidden border-t border-border py-32 md:py-48"
    >
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        <div className="mb-20 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-[0.4em] text-muted-foreground">
              <span className="text-chrome">05</span> — Coming Next
            </p>
            <h2 className="mt-6 font-display text-5xl leading-[0.95] md:text-7xl">
              Built in chapters.<br />
              <span className="italic text-mirror">Released with intent.</span>
            </h2>
          </div>
          <p className="max-w-md text-sm text-muted-foreground">
            We are launching the foundation first — a 2D composer refined to the
            millimeter — then layering the 3D experience on top. Every chapter
            ships only when it feels couture.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* MVP — Now */}
          <article className="relative overflow-hidden rounded-sm border border-border bg-card p-8 md:p-12">
            <div className="flex items-center justify-between">
              <p className="text-[10px] uppercase tracking-[0.4em] text-rose">
                ● Chapter I — Now
              </p>
              <span className="font-mono text-xs text-muted-foreground">MVP</span>
            </div>
            <h3 className="mt-8 font-display text-4xl md:text-5xl">
              The 2D Composer
            </h3>
            <p className="mt-4 max-w-md text-sm text-muted-foreground">
              A flat, fast, photoreal canvas. Build a complete set finger-by-finger
              using curated swatches and finishes — exactly the way artists already
              read references.
            </p>
            <ul className="mt-10 divide-y divide-border border-y border-border">
              {mvp.map((item, i) => (
                <li
                  key={item}
                  className="flex items-baseline gap-6 py-4 text-sm"
                >
                  <span className="font-mono text-xs text-muted-foreground">
                    0{i + 1}
                  </span>
                  <span className="text-foreground/90">{item}</span>
                </li>
              ))}
            </ul>
          </article>

          {/* Phase II — Next */}
          <article
            className="relative overflow-hidden rounded-sm border border-border p-8 md:p-12"
            style={{ background: "var(--gradient-glow)" }}
          >
            <div
              className="pointer-events-none absolute inset-0 opacity-40"
              style={{ background: "var(--gradient-glow)" }}
            />
            <div className="relative">
              <div className="flex items-center justify-between">
                <p className="text-[10px] uppercase tracking-[0.4em] text-chrome">
                  ◌ Chapter II — Next
                </p>
                <span className="font-mono text-xs text-muted-foreground">
                  Phase II
                </span>
              </div>
              <h3 className="mt-8 font-display text-4xl md:text-5xl">
                <span className="italic text-mirror">3D Previews</span>
              </h3>
              <p className="mt-4 max-w-md text-sm text-muted-foreground">
                A real-time 3D engine for nails. Photoreal materials, AR try-on,
                and a remix economy — turning every design into a living object
                you can rotate, light, and try on.
              </p>
              <ul className="mt-10 divide-y divide-border border-y border-border">
                {phase2.map((item, i) => (
                  <li
                    key={item}
                    className="flex items-baseline gap-6 py-4 text-sm"
                  >
                    <span className="font-mono text-xs text-muted-foreground">
                      0{i + 1}
                    </span>
                    <span className="text-foreground/90">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </article>
        </div>

        <p className="mt-12 text-center text-[10px] uppercase tracking-[0.4em] text-muted-foreground">
          Founding members shape the roadmap — your feedback ships the next chapter.
        </p>
      </div>
    </section>
  );
}
