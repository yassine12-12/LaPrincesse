"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";

const WORDS = ["Designed.", "Perfected.", "Yours."];

function AnimatedWord() {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setIndex((i) => (i + 1) % WORDS.length);
        setVisible(true);
      }, 400);
    }, 2400);
    return () => clearInterval(interval);
  }, []);
  return (
    <span
      className="gradient-text"
      style={{
        display: "inline-block",
        transition: "opacity 0.4s ease, transform 0.4s ease",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(10px)",
      }}
    >
      {WORDS[index]}
    </span>
  );
}

export default function HomePage() {
  const heroRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;
    const fn = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 30;
      const y = (e.clientY / window.innerHeight - 0.5) * 30;
      el.style.transform = `translate(${x}px, ${y}px)`;
    };
    window.addEventListener("mousemove", fn);
    return () => window.removeEventListener("mousemove", fn);
  }, []);

  return (
    <main>
      {/* ── HERO ── */}
      <section
        className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
        style={{ background: "#080808" }}
      >
        <div
          className="absolute pointer-events-none"
          style={{
            width: 600, height: 600, top: "10%", left: "50%",
            transform: "translateX(-50%)",
            background: "radial-gradient(circle, rgba(201,169,110,0.07) 0%, transparent 70%)",
            filter: "blur(40px)", borderRadius: "50%",
          }}
        />
        <div
          className="absolute pointer-events-none"
          style={{
            width: 300, height: 300, bottom: "20%", right: "15%",
            background: "radial-gradient(circle, rgba(196,102,122,0.05) 0%, transparent 70%)",
            filter: "blur(30px)", borderRadius: "50%",
          }}
        />
        <div
          ref={heroRef}
          className="absolute pointer-events-none"
          style={{ width: 400, height: 400, top: "25%", left: "60%", transition: "transform 0.7s ease" }}
        >
          <div
            className="w-full h-full animate-float"
            style={{
              background: "conic-gradient(from 180deg, #c9a96e22, #d4d4d822, #c4667a11, #c9a96e22)",
              filter: "blur(60px)", borderRadius: "50%",
            }}
          />
        </div>
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)",
            backgroundSize: "80px 80px",
          }}
        />

        <div className="relative z-10 text-center px-6" style={{ maxWidth: 900, margin: "0 auto" }}>
          <p
            className="mb-8 tracking-[0.4em] uppercase text-xs"
            style={{ color: "#c9a96e", fontWeight: 400 }}
          >
            Luxury Nail Experience
          </p>
          <h1
            className="mb-6"
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontWeight: 300,
              fontSize: "clamp(3.5rem, 10vw, 8rem)",
              lineHeight: 1,
              color: "#f0ece6",
            }}
          >
            Nail Art. <br />
            <AnimatedWord />
          </h1>
          <p
            className="mx-auto mb-12"
            style={{ maxWidth: 480, color: "rgba(240,236,230,0.5)", fontSize: "1rem", lineHeight: 1.7 }}
          >
            Design your exact nails in 3D. No guessing. No miscommunication.
            Just pure creative precision — from screen to salon.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/lab"
              className="px-8 py-4 text-xs tracking-[0.25em] uppercase text-center"
              style={{
                background: "linear-gradient(135deg, #c9a96e, #e8d5b0)",
                color: "#080808", fontWeight: 500, borderRadius: "1px",
                minWidth: 200, boxShadow: "0 0 40px rgba(201,169,110,0.15)",
              }}
            >
              Open 3D Lab
            </Link>
            <Link
              href="/feed"
              className="px-8 py-4 text-xs tracking-[0.25em] uppercase text-center"
              style={{
                border: "1px solid rgba(240,236,230,0.15)",
                color: "rgba(240,236,230,0.7)", borderRadius: "1px", minWidth: 200,
              }}
            >
              Explore Designs
            </Link>
          </div>
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
          <span className="text-xs tracking-[0.3em] uppercase" style={{ color: "rgba(240,236,230,0.2)" }}>
            Scroll
          </span>
          <div
            className="w-px h-12 animate-pulse"
            style={{ background: "linear-gradient(to bottom, rgba(201,169,110,0.4), transparent)" }}
          />
        </div>
      </section>

      {/* ── STATS ── */}
      <section
        className="py-16"
        style={{
          borderTop: "1px solid rgba(255,255,255,0.05)",
          borderBottom: "1px solid rgba(255,255,255,0.05)",
        }}
      >
        <div className="max-w-4xl mx-auto px-6 grid grid-cols-3 gap-8 text-center">
          {[
            { value: "3D", label: "Design System" },
            { value: "∞", label: "Combinations" },
            { value: "01", label: "Studio" },
          ].map((s) => (
            <div key={s.label}>
              <div
                className="gradient-text mb-1"
                style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "3rem", fontWeight: 300 }}
              >
                {s.value}
              </div>
              <div className="text-xs tracking-[0.2em] uppercase" style={{ color: "rgba(240,236,230,0.4)" }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="py-32 px-6" style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div className="text-center mb-20">
          <p className="mb-4 text-xs tracking-[0.4em] uppercase" style={{ color: "#c9a96e" }}>
            The Platform
          </p>
          <h2
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "clamp(2.5rem, 5vw, 4rem)",
              fontWeight: 300, color: "#f0ece6",
            }}
          >
            From Imagination
            <br />
            <em>to Reality</em>
          </h2>
        </div>
        <div className="grid md:grid-cols-3" style={{ gap: "1px", background: "rgba(255,255,255,0.05)" }}>
          {[
            {
              icon: "✦", title: "3D Nail Lab",
              desc: "Design your exact nails in real-time 3D. Every shape, color, gem and texture — before you sit in the chair.",
              href: "/lab",
            },
            {
              icon: "◈", title: "Inspiration Feed",
              desc: "A curated, editorial collection of nail art. Save, remix, and make it yours.",
              href: "/feed",
            },
            {
              icon: "◇", title: "Precision Booking",
              desc: "Your design connects directly to your appointment. Your artist sees exactly what you want.",
              href: "/book",
            },
          ].map((f) => (
            <Link
              href={f.href}
              key={f.title}
              className="group block transition-all duration-500"
              style={{ background: "#080808", padding: "40px" }}
            >
              <div className="mb-6 text-2xl" style={{ color: "#c9a96e" }}>{f.icon}</div>
              <h3
                className="mb-4"
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: "1.6rem", fontWeight: 300, color: "#f0ece6",
                }}
              >
                {f.title}
              </h3>
              <p className="text-sm leading-relaxed mb-6" style={{ color: "rgba(240,236,230,0.45)" }}>
                {f.desc}
              </p>
              <span className="text-xs tracking-[0.25em] uppercase" style={{ color: "#c9a96e" }}>
                Explore →
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* ── MANIFESTO ── */}
      <section className="py-32 px-6 text-center" style={{ background: "#0a0a0a" }}>
        <div style={{ maxWidth: 700, margin: "0 auto" }}>
          <p className="mb-6 text-xs tracking-[0.4em] uppercase" style={{ color: "#c9a96e" }}>
            Our Philosophy
          </p>
          <blockquote
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "clamp(1.8rem, 4vw, 3rem)",
              fontWeight: 300, color: "#f0ece6", lineHeight: 1.3, fontStyle: "italic",
            }}
          >
            &ldquo;Beauty begins with precision.
            <br />
            Every detail, designed by you.&rdquo;
          </blockquote>
          <div className="divider mt-12" style={{ maxWidth: 200, margin: "3rem auto 0" }} />
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="py-32 px-6" style={{ maxWidth: 1000, margin: "0 auto" }}>
        <div className="text-center mb-20">
          <p className="mb-4 text-xs tracking-[0.4em] uppercase" style={{ color: "#c9a96e" }}>
            How It Works
          </p>
          <h2
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "clamp(2rem, 4vw, 3.5rem)",
              fontWeight: 300, color: "#f0ece6",
            }}
          >
            Inspiration → Creation
            <br />→ Booking → <em>Reality</em>
          </h2>
        </div>
        <div className="grid md:grid-cols-4 gap-8">
          {[
            { step: "01", title: "Discover", desc: "Browse curated nail art from our editorial feed" },
            { step: "02", title: "Design", desc: "Build your look in the 3D Lab with full control" },
            { step: "03", title: "Book", desc: "Reserve with your exact design attached" },
            { step: "04", title: "Experience", desc: "Your artist executes your vision with precision" },
          ].map((p) => (
            <div key={p.step} className="text-center">
              <div
                className="mx-auto mb-6 flex items-center justify-center"
                style={{
                  width: 48, height: 48, borderRadius: "50%",
                  border: "1px solid rgba(201,169,110,0.3)",
                  color: "#c9a96e", fontSize: "0.7rem", letterSpacing: "0.2em",
                }}
              >
                {p.step}
              </div>
              <h4
                className="mb-3"
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: "1.3rem", fontWeight: 300, color: "#f0ece6",
                }}
              >
                {p.title}
              </h4>
              <p className="text-xs leading-relaxed" style={{ color: "rgba(240,236,230,0.4)" }}>
                {p.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section
        className="py-32 px-6 text-center relative overflow-hidden"
        style={{ background: "#0d0d0d" }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "radial-gradient(ellipse at center, rgba(201,169,110,0.05) 0%, transparent 70%)",
          }}
        />
        <div className="relative z-10" style={{ maxWidth: 560, margin: "0 auto" }}>
          <h2
            className="mb-6"
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "clamp(2.5rem, 5vw, 4rem)",
              fontWeight: 300, color: "#f0ece6",
            }}
          >
            Ready to Design
            <br />
            <em style={{ color: "#c9a96e" }}>Your Nails?</em>
          </h2>
          <p className="mb-10 text-sm" style={{ color: "rgba(240,236,230,0.45)" }}>
            Open the 3D Lab and create your next appointment design.
          </p>
          <Link
            href="/lab"
            className="inline-block px-12 py-5 text-xs tracking-[0.3em] uppercase"
            style={{
              background: "linear-gradient(135deg, #c9a96e, #e8d5b0)",
              color: "#080808", fontWeight: 500, borderRadius: "1px",
            }}
          >
            Enter The Lab
          </Link>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="py-12 px-6" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <span
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "1.1rem", color: "rgba(240,236,230,0.4)", letterSpacing: "0.3em",
            }}
          >
            LaPrincesse
          </span>
          <p className="text-xs" style={{ color: "rgba(240,236,230,0.2)" }}>
            © 2026 LaPrincesse. All rights reserved.
          </p>
        </div>
      </footer>
    </main>
  );
}
