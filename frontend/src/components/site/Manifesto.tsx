import gemImg from "@/assets/tooth-gem.jpg";

const lines = [
  "Beauty deserves precision.",
  "Vision deserves a language.",
  "Art deserves an archive.",
  "Clients deserve to be understood.",
];

export function Manifesto() {
  return (
    <section className="relative overflow-hidden border-t border-border py-32 md:py-48">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        <div className="grid gap-16 md:grid-cols-12">
          <div className="md:col-span-5">
            <div className="relative aspect-square overflow-hidden rounded-sm">
              <img
                src={gemImg}
                alt="Crystal gem reflecting light — symbol of the LaPrincesse aesthetic"
                loading="lazy"
                width={1200}
                height={1400}
                className="h-full w-full object-cover"
              />
            </div>
          </div>
          <div className="md:col-span-7 md:pl-12">
            <p className="text-[10px] uppercase tracking-[0.4em] text-muted-foreground">
              <span className="text-chrome">— </span>Manifesto
            </p>
            <div className="mt-8 space-y-6">
              {lines.map((l, i) => (
                <p
                  key={l}
                  className="font-display text-3xl leading-[1.1] md:text-5xl"
                  style={{ opacity: 1 - i * 0.12 }}
                >
                  {l}
                </p>
              ))}
              <p className="font-display text-3xl italic leading-[1.1] text-mirror md:text-5xl">
                LaPrincesse exists for all of it.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
