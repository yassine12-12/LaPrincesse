import labImg from "@/assets/lab-3d.jpg";
import { Link } from "@tanstack/react-router";

const layers = [
  { label: "Shape", v: "Almond · Stiletto · Coffin · Square" },
  { label: "Length", v: "Natural → XL" },
  { label: "Base", v: "1,400+ couture shades" },
  { label: "Finish", v: "Glossy · Matte · Velvet · Cat-eye" },
  { label: "Chrome", v: "Mirror · Aurora · Iridescent · Holographic" },
  { label: "Gems", v: "Swarovski · Pearls · Tooth gems" },
  { label: "Art", v: "Hand-painted · French · Negative space" },
];

export function Lab() {
  return (
    <section id="lab" className="relative overflow-hidden border-t border-border py-32 md:py-48">
      <div
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{ background: "var(--gradient-glow)" }}
      />
      <div className="relative mx-auto max-w-[1400px] px-6 md:px-10">
        <div className="grid gap-16 md:grid-cols-12 md:gap-12">
          <div className="md:col-span-6">
            <p className="text-[10px] uppercase tracking-[0.4em] text-muted-foreground">
              <span className="text-chrome">03</span> — LaPrincesse Lab
            </p>
            <h2 className="mt-6 font-display text-5xl leading-[0.95] md:text-7xl">
              A 3D atelier<br />
              <span className="italic text-mirror">in your pocket.</span>
            </h2>
            <p className="mt-8 max-w-lg text-base text-muted-foreground md:text-lg">
              The Lab is our visual design system — built so anyone can compose
              a couture set in minutes. Start from a template, remix a
              community piece, or sculpt from zero. Photoreal previews, finger
              by finger.
            </p>

            <div className="mt-12 divide-y divide-border border-y border-border">
              {layers.map((l, i) => (
                <div
                  key={l.label}
                  className="flex items-baseline justify-between py-4"
                >
                  <div className="flex items-baseline gap-6">
                    <span className="font-mono text-xs text-muted-foreground">
                      0{i + 1}
                    </span>
                    <span className="text-xs uppercase tracking-[0.25em]">
                      {l.label}
                    </span>
                  </div>
                  <span className="text-right text-xs text-muted-foreground">
                    {l.v}
                  </span>
                </div>
              ))}
            </div>

            <p className="mt-10 max-w-lg text-xs uppercase tracking-[0.25em] text-muted-foreground">
              MVP: 2D composer with photoreal swatches.<br />
              Phase II: Real-time 3D nails on your own hand via camera.
            </p>

            <Link
              to="/lab"
              className="mt-10 group inline-flex items-center gap-3 rounded-full bg-foreground px-7 py-4 text-xs uppercase tracking-[0.25em] text-background transition-transform hover:scale-[1.02]"
            >
              Open the Lab
              <span className="transition-transform group-hover:translate-x-1">→</span>
            </Link>
          </div>

          <div className="md:col-span-6">
            <div className="sticky top-32">
              <div className="relative aspect-[3/4] overflow-hidden rounded-sm border border-border float-slow">
                <img
                  src={labImg}
                  alt="Liquid chrome 3D rendering representing the Lab design system"
                  loading="lazy"
                  width={1400}
                  height={1600}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-x-6 bottom-6 glass-strong rounded-sm p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                        Composition
                      </p>
                      <p className="mt-1 font-display text-xl">
                        Mirror Chrome · Almond · XL
                      </p>
                    </div>
                    <span className="text-[10px] uppercase tracking-[0.3em] text-rose">
                      ● Live preview
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
