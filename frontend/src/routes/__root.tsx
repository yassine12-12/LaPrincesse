import { Outlet, Link, createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";
import { AuthProvider } from "@/context/auth-context";

import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error }: { error: Error }) {
  return (
    <div style={{ minHeight: '100vh', background: '#080808', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: '"Inter", sans-serif', padding: 24, textAlign: 'center' }}>
      <div>
        <div style={{ fontFamily: '"Fraunces", serif', fontSize: 32, fontStyle: 'italic', color: '#fff', marginBottom: 12 }}>Something went wrong.</div>
        <div style={{ color: 'rgba(255,100,100,0.7)', fontSize: 12, marginBottom: 28, maxWidth: 360, lineHeight: 1.6 }}>{error.message}</div>
        <a href="/" style={{ padding: '11px 28px', borderRadius: 100, background: '#fff', color: '#000', textDecoration: 'none', fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', fontFamily: '"JetBrains Mono", monospace', fontWeight: 700 }}>Go Home</a>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "LaPrincesse — Design Your Nails. Wear Your Vision." },
      {
        name: "description",
        content:
          "LaPrincesse is a luxury beauty platform where you design your nails visually, then have artists execute them in real life. Studio. Lab. App.",
      },
      { name: "author", content: "LaPrincesse" },
      { property: "og:title", content: "LaPrincesse — Wear Your Vision" },
      {
        property: "og:description",
        content: "Design as a universal language. Nails, tooth gems, and aesthetic services — re-imagined.",
      },
      { property: "og:type", content: "website" },
      { property: "og:image", content: "https://laprincesse.com/og-image.jpg" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "theme-color", content: "#080808" },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
      { rel: "icon", type: "image/x-icon", href: "/favicon.ico" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300&family=Fraunces:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap",
      },
      {
        rel: "stylesheet",
        href: appCss,
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  return (
    <AuthProvider>
      <Outlet />
    </AuthProvider>
  );
}
