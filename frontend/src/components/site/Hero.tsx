import heroImg from "@/assets/hero-chrome-nails.jpg";

export function Hero() {
  return (
    <section id="top" className="relative min-h-screen w-full overflow-hidden grain">
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src={heroImg}
          alt="Liquid chrome almond nails reflecting iridescent light"
          width={1600}
          height={1920}
          className="h-full w-full object-cover opacity-90"
        />
        <div
          className="absolute inset-0"
          style={{ background: "var(--gradient-fade)" }}
        />
        <div
          className="absolute inset-0"
          style={{ background: "var(--gradient-glow)" }}
        />
      </div>

      {/* Top bar marker */}
      <div className="relative z-10 flex min-h-screen flex-col">
        <div className="flex-1" />

        <div className="mx-auto w-full max-w-[1400px] px-6 pb-20 md:px-10 md:pb-32">
          <p className="reveal mb-6 text-[10px] uppercase tracking-[0.4em] text-muted-foreground md:text-xs">
            <span className="text-chrome">— </span>
            A new era of beauty design
          </p>
          <h1 className="reveal reveal-delay-1 font-display text-[14vw] leading-[0.9] md:text-[8.5vw] lg:text-[7.5rem]">
            <span className="block text-chrome">Wear your</span>
            <span className="block italic text-mirror">vision.</span>
          </h1>
          <div className="reveal reveal-delay-2 mt-10 flex max-w-2xl flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <p className="text-base text-muted-foreground md:text-lg">
              LaPrincesse is a luxury platform where you design your nails visually —
              then artists bring them to life. No language barriers. No miscommunication.
              Only your taste, executed.
            </p>
          </div>
          <div className="reveal reveal-delay-3 mt-10 flex flex-wrap items-center gap-4">
            <a
              href="#waitlist"
              className="group inline-flex items-center gap-3 rounded-full bg-foreground px-7 py-4 text-xs uppercase tracking-[0.25em] text-background transition-transform hover:scale-[1.02]"
            >
              Request access
              <span className="transition-transform group-hover:translate-x-1">→</span>
            </a>
            <a
              href="#vision"
              className="inline-flex items-center gap-3 rounded-full border border-border px-7 py-4 text-xs uppercase tracking-[0.25em] text-foreground/80 transition-colors hover:bg-secondary"
            >
              Explore the universe
            </a>
          </div>
        </div>

        {/* Bottom ticker */}
        <div className="relative z-10 border-t border-border bg-ink/60 backdrop-blur-md">
          <div className="overflow-hidden whitespace-nowrap py-3">
            <div className="marquee inline-flex gap-12 text-[10px] uppercase tracking-[0.45em] text-muted-foreground">
              {Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="inline-flex gap-12">
                  <span>Studio</span><span>·</span>
                  <span>Lab</span><span>·</span>
                  <span>App</span><span>·</span>
                  <span>Chrome</span><span>·</span>
                  <span>Tooth Gems</span><span>·</span>
                  <span>Almond</span><span>·</span>
                  <span>Stiletto</span><span>·</span>
                  <span>Couture Nails</span><span>·</span>
                  <span>Editorial Beauty</span><span>·</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
