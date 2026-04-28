export function Footer() {
  return (
    <footer className="border-t border-border bg-ink py-16">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <p className="font-display text-3xl tracking-[0.25em] text-chrome">
              LAPRINCESSE
            </p>
            <p className="mt-4 max-w-sm text-sm text-muted-foreground">
              Studio. Lab. App. A new era of beauty design — where vision is the
              only language that matters.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-8 md:col-span-7">
            <div>
              <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                Universe
              </p>
              <ul className="mt-4 space-y-3 text-sm">
                <li><a href="#vision" className="hover:text-foreground/100">Vision</a></li>
                <li><a href="#universe" className="hover:text-foreground/100">Studio</a></li>
                <li><a href="#lab" className="hover:text-foreground/100">Lab</a></li>
                <li><a href="#waitlist" className="hover:text-foreground/100">App</a></li>
              </ul>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                Connect
              </p>
              <ul className="mt-4 space-y-3 text-sm">
                <li><a href="#" className="hover:text-foreground/100">Instagram</a></li>
                <li><a href="#" className="hover:text-foreground/100">TikTok</a></li>
                <li><a href="#" className="hover:text-foreground/100">Press</a></li>
                <li><a href="#" className="hover:text-foreground/100">Careers</a></li>
              </ul>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                Legal
              </p>
              <ul className="mt-4 space-y-3 text-sm">
                <li><a href="#" className="hover:text-foreground/100">Privacy</a></li>
                <li><a href="#" className="hover:text-foreground/100">Terms</a></li>
                <li><a href="#" className="hover:text-foreground/100">Cookies</a></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 text-[10px] uppercase tracking-[0.3em] text-muted-foreground md:flex-row">
          <p>© {new Date().getFullYear()} LaPrincesse — All rights reserved</p>
          <p>Designed in the dark.</p>
        </div>
      </div>
    </footer>
  );
}
