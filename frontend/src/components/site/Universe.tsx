import studioImg from "@/assets/studio-interior.jpg";
import labImg from "@/assets/lab-3d.jpg";
import appImg from "@/assets/app-mockup.jpg";

const pillars = [
  {
    n: "Ⅰ",
    name: "Studio",
    sub: "The flagship salon",
    desc: "Our physical space — black marble, chrome, low light. Where designs become reality, executed by hand-picked artists trained on the LaPrincesse system.",
    img: studioImg,
  },
  {
    n: "Ⅱ",
    name: "Lab",
    sub: "The 3D design system",
    desc: "A real-time visual editor for nails. Shape, length, base color, finish, chrome, French, gems, hand-painted art. Composable, photoreal, made to communicate.",
    img: labImg,
  },
  {
    n: "Ⅲ",
    name: "App",
    sub: "The personal universe",
    desc: "A curated feed of inspiration, your private design archive, public profile, remix culture, and frictionless booking — connected directly to your artist.",
    img: appImg,
  },
];

export function Universe() {
  return (
    <section id="universe" className="relative border-t border-border py-32 md:py-48">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        <div className="mb-20 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-[0.4em] text-muted-foreground">
              <span className="text-chrome">02</span> — The Universe
            </p>
            <h2 className="mt-6 font-display text-5xl leading-[0.95] md:text-7xl">
              Three rooms.<br />One philosophy.
            </h2>
          </div>
          <p className="max-w-md text-sm text-muted-foreground">
            LaPrincesse is not an app, a salon, or a tool. It is the bridge
            between all three — a single ecosystem where vision flows from
            screen to hand to nail.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {pillars.map((p) => (
            <article
              key={p.name}
              className="group relative overflow-hidden rounded-sm border border-border bg-card transition-all duration-700 hover:border-foreground/20"
            >
              <div className="relative aspect-[3/4] overflow-hidden">
                <img
                  src={p.img}
                  alt={`${p.name} — ${p.sub}`}
                  loading="lazy"
                  width={1200}
                  height={1600}
                  className="h-full w-full object-cover transition-transform duration-[1500ms] ease-out group-hover:scale-[1.04]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/30 to-transparent" />
                <div className="absolute left-6 top-6 font-display text-3xl text-chrome">
                  {p.n}
                </div>
              </div>
              <div className="relative -mt-24 p-6 md:p-8">
                <p className="text-[10px] uppercase tracking-[0.4em] text-muted-foreground">
                  {p.sub}
                </p>
                <h3 className="mt-2 font-display text-4xl md:text-5xl">{p.name}</h3>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                  {p.desc}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
