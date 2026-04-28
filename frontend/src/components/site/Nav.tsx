import { Link } from "@tanstack/react-router";

export function Nav() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div className="glass-strong">
        <nav className="mx-auto flex max-w-[1400px] items-center justify-between px-6 py-4 md:px-10">
          <a href="#top" className="flex items-center gap-2">
            <span className="font-display text-xl tracking-[0.3em] text-chrome">
              LAPRINCESSE
            </span>
          </a>
          <div className="hidden items-center gap-10 text-xs uppercase tracking-[0.25em] text-muted-foreground md:flex">
            <a href="#vision" className="transition-colors hover:text-foreground">Vision</a>
            <a href="#universe" className="transition-colors hover:text-foreground">Universe</a>
            <a href="#lab" className="transition-colors hover:text-foreground">Lab</a>
            <a href="#journey" className="transition-colors hover:text-foreground">Journey</a>
            <Link to="/lab" className="transition-colors hover:text-foreground text-chrome">Open Lab →</Link>
          </div>
          <a
            href="#waitlist"
            className="group relative overflow-hidden rounded-full border border-border bg-foreground px-5 py-2 text-xs uppercase tracking-[0.2em] text-background transition-all hover:scale-[1.02]"
          >
            Join Waitlist
          </a>
        </nav>
      </div>
    </header>
  );
}
