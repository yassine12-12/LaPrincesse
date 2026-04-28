"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Home" },
  { href: "/lab", label: "3D Lab" },
  { href: "/feed", label: "Inspiration" },
  { href: "/book", label: "Book" },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-700"
        style={{
          background: scrolled
            ? "rgba(8,8,8,0.92)"
            : "transparent",
          backdropFilter: scrolled ? "blur(20px)" : "none",
          borderBottom: scrolled ? "1px solid rgba(255,255,255,0.06)" : "none",
        }}
      >
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div
              className="w-6 h-6 rounded-full"
              style={{
                background: "linear-gradient(135deg, #c9a96e, #e8d5b0, #d4d4d8)",
              }}
            />
            <span
              className="text-base tracking-[0.25em] uppercase"
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontWeight: 300,
                color: "#f0ece6",
                letterSpacing: "0.3em",
              }}
            >
              LaPrincesse
            </span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-8">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="text-xs tracking-[0.2em] uppercase transition-all duration-300"
                style={{
                  color:
                    pathname === l.href
                      ? "#c9a96e"
                      : "rgba(240,236,230,0.5)",
                  fontWeight: 400,
                }}
                onMouseEnter={(e) =>
                  ((e.target as HTMLElement).style.color = "#c9a96e")
                }
                onMouseLeave={(e) =>
                  ((e.target as HTMLElement).style.color =
                    pathname === l.href
                      ? "#c9a96e"
                      : "rgba(240,236,230,0.5)")
                }
              >
                {l.label}
              </Link>
            ))}
            <Link
              href="/book"
              className="px-5 py-2 text-xs tracking-[0.2em] uppercase transition-all duration-300"
              style={{
                border: "1px solid rgba(201,169,110,0.4)",
                color: "#c9a96e",
                borderRadius: "1px",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.background =
                  "rgba(201,169,110,0.1)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.background = "transparent";
              }}
            >
              Reserve
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden flex flex-col gap-1.5 p-2"
            onClick={() => setOpen(!open)}
            aria-label="Menu"
          >
            <span
              className="block w-5 h-px transition-all duration-300"
              style={{
                background: "#c9a96e",
                transform: open ? "rotate(45deg) translate(2px, 2px)" : "",
              }}
            />
            <span
              className="block w-5 h-px transition-all duration-300"
              style={{
                background: "#c9a96e",
                opacity: open ? 0 : 1,
              }}
            />
            <span
              className="block w-5 h-px transition-all duration-300"
              style={{
                background: "#c9a96e",
                transform: open ? "rotate(-45deg) translate(2px, -2px)" : "",
              }}
            />
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div
        className="fixed inset-0 z-40 md:hidden transition-all duration-500"
        style={{
          opacity: open ? 1 : 0,
          pointerEvents: open ? "all" : "none",
          background: "rgba(8,8,8,0.98)",
          backdropFilter: "blur(20px)",
        }}
      >
        <div className="flex flex-col items-center justify-center h-full gap-10">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="text-4xl tracking-wider"
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontWeight: 300,
                color: pathname === l.href ? "#c9a96e" : "#f0ece6",
              }}
            >
              {l.label}
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
