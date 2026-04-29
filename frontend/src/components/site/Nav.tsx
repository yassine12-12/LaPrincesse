import { Link } from "@tanstack/react-router";
import { useAuth } from "@/context/auth-context";

export function Nav() {
  const { user, signOut } = useAuth();

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
            <Link to="/trending" className="transition-colors hover:text-foreground">Trending</Link>
            <Link to="/tooth-gems" className="transition-colors hover:text-foreground">Tooth Gems</Link>
            <Link to="/lab" className="transition-colors hover:text-foreground text-chrome">Open Lab →</Link>
            <Link to="/ar" search={{ color: undefined, shape: undefined, length: undefined }} className="transition-colors hover:text-foreground">AR Try-On</Link>
            <Link to="/book" search={{ designId: undefined }} className="transition-colors hover:text-foreground">Book</Link>
          </div>
          <div className="flex items-center gap-3">
            {user ? (
              <>
                <Link
                  to="/profile"
                  className="text-xs uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:text-foreground"
                >
                  {(user.user_metadata?.name ?? user.email?.split('@')[0] ?? 'Account').split(' ')[0]}
                </Link>
                <button
                  onClick={() => signOut()}
                  className="text-xs uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:text-foreground bg-transparent border-none cursor-pointer"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <Link
                to="/auth"
                className="group relative overflow-hidden rounded-full border border-border bg-foreground px-5 py-2 text-xs uppercase tracking-[0.2em] text-background transition-all hover:scale-[1.02]"
              >
                Sign In
              </Link>
            )}
            {!user && (
              <a
                href="#waitlist"
                className="group relative overflow-hidden rounded-full border border-border px-5 py-2 text-xs uppercase tracking-[0.2em] transition-all hover:scale-[1.02]"
              >
                Join Waitlist
              </a>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}
