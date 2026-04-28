import { useState } from "react";

export function Waitlist() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "ok">("idle");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setStatus("ok");
    setEmail("");
  };

  return (
    <section
      id="waitlist"
      className="relative overflow-hidden border-t border-border py-32 md:py-48"
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: "var(--gradient-glow)" }}
      />
      <div className="relative mx-auto max-w-3xl px-6 text-center md:px-10">
        <p className="text-[10px] uppercase tracking-[0.4em] text-muted-foreground">
          — Founding members
        </p>
        <h2 className="mt-6 font-display text-5xl leading-[0.95] md:text-7xl">
          Be among the<br />
          <span className="italic text-mirror">first hundred.</span>
        </h2>
        <p className="mx-auto mt-8 max-w-lg text-base text-muted-foreground md:text-lg">
          The first chapter opens by invitation. Founding members receive early
          access to the Lab, priority bookings at the Studio, and limited
          editions reserved exclusively for them.
        </p>

        <form
          onSubmit={submit}
          className="mx-auto mt-12 flex max-w-xl flex-col gap-3 sm:flex-row"
        >
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your email address"
            className="flex-1 rounded-full border border-border bg-card/60 px-6 py-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-foreground/30 focus:outline-none"
          />
          <button
            type="submit"
            className="rounded-full bg-foreground px-8 py-4 text-xs uppercase tracking-[0.25em] text-background transition-transform hover:scale-[1.02]"
          >
            Request invite
          </button>
        </form>
        {status === "ok" && (
          <p className="mt-6 text-xs uppercase tracking-[0.3em] text-rose">
            ● You're on the list. Welcome.
          </p>
        )}
      </div>
    </section>
  );
}
