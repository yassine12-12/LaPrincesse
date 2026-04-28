import os

BASE = "/Users/yassinekraiem/Documents/LaPrincesse/app/src"

# ─── page.tsx ────────────────────────────────────────────────────────────────
page = r'''"use client";
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
'''

# ─── lab/page.tsx ─────────────────────────────────────────────────────────────
lab = r'''"use client";
import { useState } from "react";
import Link from "next/link";

const SHAPES = ["Round", "Oval", "Square", "Almond", "Stiletto", "Coffin"];
const LENGTHS = ["Short", "Medium", "Long", "Extra Long"];
const FINISHES = ["Glossy", "Matte", "Chrome", "Holographic", "Velvet"];
const COLORS = [
  "#080808", "#1a1a1a", "#2d2d2d", "#c9a96e", "#e8d5b0", "#d4d4d8",
  "#f4f4f5", "#c4667a", "#8b2252", "#4a1942", "#1e3a5f", "#0d4a2e",
  "#f0ece6", "#a0522d", "#b8860b", "#4b0082",
];

type NailDesign = { color: string; finish: string; hasGem: boolean; hasChrome: boolean };
const defaultNail = (): NailDesign => ({ color: "#1a1a1a", finish: "Glossy", hasGem: false, hasChrome: false });

export default function LabPage() {
  const [shape, setShape] = useState("Oval");
  const [length, setLength] = useState("Medium");
  const [nails, setNails] = useState<NailDesign[]>(Array.from({ length: 10 }, defaultNail));
  const [selected, setSelected] = useState<number | null>(null);
  const [applyAll, setApplyAll] = useState(false);
  const [activeColor, setActiveColor] = useState("#c9a96e");
  const [activeFinish, setActiveFinish] = useState("Glossy");

  const applyColor = (color: string) => {
    setActiveColor(color);
    if (applyAll) {
      setNails(nails.map((n) => ({ ...n, color })));
    } else if (selected !== null) {
      const next = [...nails];
      next[selected] = { ...next[selected], color };
      setNails(next);
    }
  };

  const applyFinish = (finish: string) => {
    setActiveFinish(finish);
    if (applyAll) {
      setNails(nails.map((n) => ({ ...n, finish })));
    } else if (selected !== null) {
      const next = [...nails];
      next[selected] = { ...next[selected], finish };
      setNails(next);
    }
  };

  const toggleGem = () => {
    if (selected === null) return;
    const next = [...nails];
    next[selected] = { ...next[selected], hasGem: !next[selected].hasGem };
    setNails(next);
  };

  const toggleChrome = () => {
    if (selected === null) return;
    const next = [...nails];
    next[selected] = { ...next[selected], hasChrome: !next[selected].hasChrome };
    setNails(next);
  };

  const getNailHeight = () => {
    const map: Record<string, number> = { Short: 52, Medium: 68, Long: 84, "Extra Long": 100 };
    return map[length] ?? 68;
  };

  const getShapeRadius = () => {
    const map: Record<string, string> = {
      Round: "40% 40% 10% 10%",
      Oval: "50% 50% 12% 12%",
      Square: "4px 4px 4px 4px",
      Almond: "50% 50% 20% 20%",
      Stiletto: "50% 50% 0% 0%",
      Coffin: "20% 20% 10% 10%",
    };
    return map[shape] ?? "50% 50% 12% 12%";
  };

  const getFinishStyle = (nail: NailDesign) => {
    if (nail.finish === "Chrome")
      return { background: `linear-gradient(145deg, #fff 0%, ${nail.color} 40%, #888 100%)` };
    if (nail.finish === "Holographic")
      return {
        background: `linear-gradient(135deg, #ff6ec7, #6ec6ff, #c9a96e, ${nail.color})`,
      };
    if (nail.finish === "Matte") return { background: nail.color, filter: "none" };
    return { background: `linear-gradient(145deg, ${nail.color}dd 0%, ${nail.color} 50%, ${nail.color}99 100%)` };
  };

  const FINGER_WIDTHS = [28, 32, 36, 34, 26, 26, 34, 36, 32, 28];
  const HAND_LABELS = ["Pinky", "Ring", "Middle", "Index", "Thumb", "Thumb", "Index", "Middle", "Ring", "Pinky"];

  return (
    <main className="min-h-screen pt-16" style={{ background: "#080808" }}>
      <div className="max-w-7xl mx-auto px-6 py-12">

        {/* Header */}
        <div className="mb-12">
          <p className="mb-2 text-xs tracking-[0.4em] uppercase" style={{ color: "#c9a96e" }}>
            LaPrincesse
          </p>
          <h1
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "clamp(2.5rem, 5vw, 4rem)",
              fontWeight: 300, color: "#f0ece6",
            }}
          >
            3D Nail Lab
          </h1>
          <p className="mt-3 text-sm" style={{ color: "rgba(240,236,230,0.45)" }}>
            Design every nail. Click a nail to select it, then apply colors, textures and accents.
          </p>
        </div>

        <div className="grid lg:grid-cols-[1fr_380px] gap-12">

          {/* Left — Nail Canvas */}
          <div>
            {/* Shape + Length */}
            <div className="flex flex-wrap gap-6 mb-10">
              <div>
                <p className="text-xs tracking-[0.2em] uppercase mb-3" style={{ color: "rgba(240,236,230,0.4)" }}>
                  Shape
                </p>
                <div className="flex flex-wrap gap-2">
                  {SHAPES.map((s) => (
                    <button
                      key={s}
                      onClick={() => setShape(s)}
                      className="px-4 py-2 text-xs tracking-wider uppercase transition-all duration-200"
                      style={{
                        border: shape === s ? "1px solid #c9a96e" : "1px solid rgba(255,255,255,0.1)",
                        color: shape === s ? "#c9a96e" : "rgba(240,236,230,0.5)",
                        background: shape === s ? "rgba(201,169,110,0.08)" : "transparent",
                        borderRadius: "1px",
                      }}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs tracking-[0.2em] uppercase mb-3" style={{ color: "rgba(240,236,230,0.4)" }}>
                  Length
                </p>
                <div className="flex flex-wrap gap-2">
                  {LENGTHS.map((l) => (
                    <button
                      key={l}
                      onClick={() => setLength(l)}
                      className="px-4 py-2 text-xs tracking-wider uppercase transition-all duration-200"
                      style={{
                        border: length === l ? "1px solid #c9a96e" : "1px solid rgba(255,255,255,0.1)",
                        color: length === l ? "#c9a96e" : "rgba(240,236,230,0.5)",
                        background: length === l ? "rgba(201,169,110,0.08)" : "transparent",
                        borderRadius: "1px",
                      }}
                    >
                      {l}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Apply All Toggle */}
            <div className="flex items-center gap-3 mb-8">
              <button
                onClick={() => setApplyAll(!applyAll)}
                className="flex items-center gap-2 text-xs tracking-[0.2em] uppercase transition-all"
                style={{ color: applyAll ? "#c9a96e" : "rgba(240,236,230,0.4)" }}
              >
                <span
                  style={{
                    display: "inline-block", width: 28, height: 16, borderRadius: 8,
                    background: applyAll ? "#c9a96e" : "rgba(255,255,255,0.1)",
                    transition: "background 0.3s",
                    position: "relative",
                  }}
                >
                  <span
                    style={{
                      position: "absolute", top: 2,
                      left: applyAll ? 14 : 2,
                      width: 12, height: 12, borderRadius: "50%",
                      background: "#fff", transition: "left 0.3s",
                    }}
                  />
                </span>
                Apply to all nails
              </button>
              {selected !== null && !applyAll && (
                <span className="text-xs" style={{ color: "rgba(240,236,230,0.3)" }}>
                  • Editing nail {selected + 1} ({HAND_LABELS[selected]})
                </span>
              )}
            </div>

            {/* Hand */}
            <div className="relative flex justify-center">
              <div className="flex items-end gap-1.5" style={{ paddingBottom: 40 }}>
                {nails.map((nail, i) => {
                  const w = FINGER_WIDTHS[i];
                  const h = getNailHeight();
                  const isSelected = selected === i;
                  return (
                    <div
                      key={i}
                      className="flex flex-col items-center gap-1.5 cursor-pointer"
                      onClick={() => { if (!applyAll) setSelected(i === selected ? null : i); }}
                    >
                      {/* Nail plate */}
                      <div
                        style={{
                          width: w,
                          height: h,
                          borderRadius: getShapeRadius(),
                          ...getFinishStyle(nail),
                          position: "relative",
                          transition: "all 0.3s ease",
                          boxShadow: isSelected
                            ? "0 0 0 2px #c9a96e, 0 8px 30px rgba(0,0,0,0.6)"
                            : "0 4px 20px rgba(0,0,0,0.5)",
                          transform: isSelected ? "translateY(-6px) scale(1.05)" : "none",
                        }}
                      >
                        {/* Shine */}
                        <div
                          style={{
                            position: "absolute", top: 4, left: "20%", width: "25%", height: "35%",
                            background: "rgba(255,255,255,0.2)",
                            borderRadius: "50%", filter: "blur(2px)",
                          }}
                        />
                        {/* Gem */}
                        {nail.hasGem && (
                          <div
                            style={{
                              position: "absolute", top: "30%", left: "50%",
                              transform: "translate(-50%,-50%)",
                              width: 6, height: 6, borderRadius: "50%",
                              background: "radial-gradient(circle, #fff 0%, #c9a96e 60%)",
                              boxShadow: "0 0 6px rgba(201,169,110,0.8)",
                            }}
                          />
                        )}
                        {/* Chrome overlay */}
                        {nail.hasChrome && (
                          <div
                            style={{
                              position: "absolute", inset: 0,
                              borderRadius: getShapeRadius(),
                              background: "linear-gradient(135deg, rgba(255,255,255,0.5) 0%, transparent 50%, rgba(255,255,255,0.2) 100%)",
                              mixBlendMode: "overlay",
                            }}
                          />
                        )}
                      </div>
                      {/* Finger */}
                      <div
                        style={{
                          width: w + 4,
                          height: 60,
                          background: "linear-gradient(to bottom, #2a2a2a, #1a1a1a)",
                          borderRadius: "4px 4px 0 0",
                          border: "1px solid rgba(255,255,255,0.06)",
                        }}
                      />
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Nail labels */}
            <div className="flex justify-center gap-1.5 mt-2">
              {FINGER_WIDTHS.map((w, i) => (
                <div
                  key={i}
                  className="text-center"
                  style={{ width: w, fontSize: "0.55rem", color: "rgba(240,236,230,0.2)" }}
                >
                  {i === 4 || i === 5 ? "L" : ""}
                </div>
              ))}
            </div>
          </div>

          {/* Right — Controls */}
          <div className="space-y-8">

            {/* Color */}
            <div
              className="p-6"
              style={{ background: "#111", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "2px" }}
            >
              <p className="text-xs tracking-[0.25em] uppercase mb-4" style={{ color: "rgba(240,236,230,0.5)" }}>
                Color
              </p>
              <div className="grid grid-cols-8 gap-2 mb-4">
                {COLORS.map((c) => (
                  <button
                    key={c}
                    onClick={() => applyColor(c)}
                    style={{
                      width: 28, height: 28, borderRadius: "50%", background: c,
                      border: activeColor === c ? "2px solid #c9a96e" : "1px solid rgba(255,255,255,0.1)",
                      transition: "transform 0.2s",
                      transform: activeColor === c ? "scale(1.2)" : "scale(1)",
                    }}
                  />
                ))}
              </div>
              <input
                type="color"
                value={activeColor}
                onChange={(e) => applyColor(e.target.value)}
                className="w-full h-8 rounded cursor-pointer"
                style={{ background: "none", border: "1px solid rgba(255,255,255,0.1)" }}
              />
            </div>

            {/* Finish */}
            <div
              className="p-6"
              style={{ background: "#111", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "2px" }}
            >
              <p className="text-xs tracking-[0.25em] uppercase mb-4" style={{ color: "rgba(240,236,230,0.5)" }}>
                Finish
              </p>
              <div className="grid grid-cols-2 gap-2">
                {FINISHES.map((f) => (
                  <button
                    key={f}
                    onClick={() => applyFinish(f)}
                    className="py-2 text-xs tracking-wider uppercase transition-all"
                    style={{
                      border: activeFinish === f ? "1px solid #c9a96e" : "1px solid rgba(255,255,255,0.08)",
                      color: activeFinish === f ? "#c9a96e" : "rgba(240,236,230,0.45)",
                      background: activeFinish === f ? "rgba(201,169,110,0.08)" : "transparent",
                      borderRadius: "1px",
                    }}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            {/* Accents */}
            <div
              className="p-6"
              style={{ background: "#111", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "2px" }}
            >
              <p className="text-xs tracking-[0.25em] uppercase mb-4" style={{ color: "rgba(240,236,230,0.5)" }}>
                Accents {selected === null && <span style={{ color: "rgba(240,236,230,0.2)" }}>— select a nail first</span>}
              </p>
              <div className="flex gap-3">
                <button
                  onClick={toggleGem}
                  disabled={selected === null}
                  className="flex-1 py-3 text-xs tracking-wider uppercase transition-all"
                  style={{
                    border: selected !== null && nails[selected]?.hasGem
                      ? "1px solid #c9a96e"
                      : "1px solid rgba(255,255,255,0.08)",
                    color: selected !== null && nails[selected]?.hasGem ? "#c9a96e" : "rgba(240,236,230,0.45)",
                    background: selected !== null && nails[selected]?.hasGem ? "rgba(201,169,110,0.08)" : "transparent",
                    borderRadius: "1px", opacity: selected === null ? 0.3 : 1,
                  }}
                >
                  ✦ Gem
                </button>
                <button
                  onClick={toggleChrome}
                  disabled={selected === null}
                  className="flex-1 py-3 text-xs tracking-wider uppercase transition-all"
                  style={{
                    border: selected !== null && nails[selected]?.hasChrome
                      ? "1px solid #c9a96e"
                      : "1px solid rgba(255,255,255,0.08)",
                    color: selected !== null && nails[selected]?.hasChrome ? "#c9a96e" : "rgba(240,236,230,0.45)",
                    background: selected !== null && nails[selected]?.hasChrome ? "rgba(201,169,110,0.08)" : "transparent",
                    borderRadius: "1px", opacity: selected === null ? 0.3 : 1,
                  }}
                >
                  ◈ Chrome
                </button>
              </div>
            </div>

            {/* Reset */}
            <button
              onClick={() => { setNails(Array.from({ length: 10 }, defaultNail)); setSelected(null); }}
              className="w-full py-3 text-xs tracking-[0.2em] uppercase transition-all"
              style={{ border: "1px solid rgba(255,255,255,0.08)", color: "rgba(240,236,230,0.3)", borderRadius: "1px" }}
            >
              Reset Design
            </button>

            {/* Book CTA */}
            <Link
              href="/book"
              className="block w-full py-4 text-xs tracking-[0.25em] uppercase text-center transition-all"
              style={{
                background: "linear-gradient(135deg, #c9a96e, #e8d5b0)",
                color: "#080808", fontWeight: 500, borderRadius: "1px",
                boxShadow: "0 0 40px rgba(201,169,110,0.2)",
              }}
            >
              Book With This Design →
            </Link>

            <p className="text-xs text-center" style={{ color: "rgba(240,236,230,0.2)" }}>
              Your design will be shared with your artist before your appointment.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
'''

# ─── feed/page.tsx ────────────────────────────────────────────────────────────
feed = r'''"use client";
import { useState } from "react";
import Link from "next/link";

const TAGS = ["All", "Chrome", "Gems", "Minimal", "Editorial", "3D Art", "French", "Seasonal"];

const DESIGNS = [
  { id: 1, title: "Liquid Chrome", tags: ["Chrome"], complexity: "Advanced", duration: "3h", price: "From €120", palette: ["#d4d4d8", "#f4f4f5", "#a1a1aa"], accent: "#d4d4d8" },
  { id: 2, title: "Noir Gems", tags: ["Gems"], complexity: "Medium", duration: "2h", price: "From €80", palette: ["#080808", "#1a1a1a", "#c9a96e"], accent: "#c9a96e" },
  { id: 3, title: "Soft Nude", tags: ["Minimal"], complexity: "Simple", duration: "1h", price: "From €45", palette: ["#e8d5b0", "#d4b896", "#f0ece6"], accent: "#e8d5b0" },
  { id: 4, title: "Crystal Press", tags: ["Gems", "Editorial"], complexity: "Advanced", duration: "4h", price: "From €160", palette: ["#f4f4f5", "#e8d5b0", "#c9a96e"], accent: "#c9a96e" },
  { id: 5, title: "Rose Editorial", tags: ["Editorial"], complexity: "Medium", duration: "2.5h", price: "From €95", palette: ["#c4667a", "#8b2252", "#f0ece6"], accent: "#c4667a" },
  { id: 6, title: "Dark Minimal", tags: ["Minimal"], complexity: "Simple", duration: "1h", price: "From €45", palette: ["#1a1a1a", "#2d2d2d", "#080808"], accent: "#888" },
  { id: 7, title: "Gold Foil", tags: ["Chrome", "Editorial"], complexity: "Advanced", duration: "3.5h", price: "From €140", palette: ["#c9a96e", "#e8d5b0", "#b8860b"], accent: "#c9a96e" },
  { id: 8, title: "Aurora 3D", tags: ["3D Art", "Chrome"], complexity: "Signature", duration: "5h", price: "From €200", palette: ["#6ec6ff", "#ff6ec7", "#c9a96e"], accent: "#6ec6ff" },
  { id: 9, title: "Lace French", tags: ["French"], complexity: "Medium", duration: "2h", price: "From €75", palette: ["#f0ece6", "#e8d5b0", "#fff"], accent: "#e8d5b0" },
];

const COMPLEXITY_COLORS: Record<string, string> = {
  Simple: "#6b9e6b",
  Medium: "#c9a96e",
  Advanced: "#c4667a",
  Signature: "#8b2252",
};

export default function FeedPage() {
  const [activeTag, setActiveTag] = useState("All");
  const [saved, setSaved] = useState<number[]>([]);

  const filtered = activeTag === "All" ? DESIGNS : DESIGNS.filter((d) => d.tags.includes(activeTag));

  const toggleSave = (id: number) =>
    setSaved((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  return (
    <main className="min-h-screen pt-16" style={{ background: "#080808" }}>
      <div className="max-w-7xl mx-auto px-6 py-12">

        {/* Header */}
        <div className="mb-12">
          <p className="mb-2 text-xs tracking-[0.4em] uppercase" style={{ color: "#c9a96e" }}>
            LaPrincesse
          </p>
          <h1
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "clamp(2.5rem, 5vw, 4rem)",
              fontWeight: 300, color: "#f0ece6",
            }}
          >
            Inspiration
          </h1>
          <p className="mt-3 text-sm" style={{ color: "rgba(240,236,230,0.45)" }}>
            Curated nail art. Save a design, remix it, or book it directly.
          </p>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-12">
          {TAGS.map((t) => (
            <button
              key={t}
              onClick={() => setActiveTag(t)}
              className="px-5 py-2 text-xs tracking-[0.2em] uppercase transition-all duration-200"
              style={{
                border: activeTag === t ? "1px solid #c9a96e" : "1px solid rgba(255,255,255,0.08)",
                color: activeTag === t ? "#c9a96e" : "rgba(240,236,230,0.45)",
                background: activeTag === t ? "rgba(201,169,110,0.08)" : "transparent",
                borderRadius: "1px",
              }}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px" style={{ background: "rgba(255,255,255,0.04)" }}>
          {filtered.map((design) => (
            <div
              key={design.id}
              className="group relative"
              style={{ background: "#080808" }}
            >
              {/* Visual swatch */}
              <div
                className="relative overflow-hidden"
                style={{ height: 280 }}
              >
                {/* Abstract nail art preview */}
                <div
                  className="absolute inset-0 transition-transform duration-700 group-hover:scale-105"
                  style={{
                    background: `radial-gradient(ellipse at 30% 40%, ${design.palette[0]}66 0%, transparent 60%), radial-gradient(ellipse at 70% 70%, ${design.palette[1]}44 0%, transparent 50%), linear-gradient(160deg, ${design.palette[0]}22, ${design.palette[2]}33)`,
                  }}
                />
                {/* Nail silhouettes */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 items-end">
                  {[40, 50, 56, 52, 38].map((h, i) => (
                    <div
                      key={i}
                      style={{
                        width: 22 + i * 2,
                        height: h,
                        borderRadius: "50% 50% 10% 10%",
                        background: `linear-gradient(145deg, ${design.palette[0]}cc, ${design.palette[1]})`,
                        boxShadow: `0 4px 20px ${design.accent}44`,
                        position: "relative",
                      }}
                    >
                      <div style={{ position: "absolute", top: 4, left: "25%", width: "20%", height: "25%", background: "rgba(255,255,255,0.25)", borderRadius: "50%", filter: "blur(1px)" }} />
                    </div>
                  ))}
                </div>

                {/* Overlay on hover */}
                <div
                  className="absolute inset-0 flex items-center justify-center gap-3 transition-opacity duration-300"
                  style={{ background: "rgba(8,8,8,0.7)", opacity: 0 }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.opacity = "1")}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.opacity = "0")}
                >
                  <Link
                    href="/lab"
                    className="px-5 py-2 text-xs tracking-[0.2em] uppercase"
                    style={{ background: "linear-gradient(135deg, #c9a96e, #e8d5b0)", color: "#080808", borderRadius: "1px", fontWeight: 500 }}
                  >
                    Remix
                  </Link>
                  <Link
                    href="/book"
                    className="px-5 py-2 text-xs tracking-[0.2em] uppercase"
                    style={{ border: "1px solid rgba(240,236,230,0.3)", color: "#f0ece6", borderRadius: "1px" }}
                  >
                    Book
                  </Link>
                </div>

                {/* Save button */}
                <button
                  onClick={() => toggleSave(design.id)}
                  className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center transition-all"
                  style={{
                    background: saved.includes(design.id) ? "rgba(201,169,110,0.2)" : "rgba(8,8,8,0.6)",
                    border: `1px solid ${saved.includes(design.id) ? "#c9a96e" : "rgba(255,255,255,0.1)"}`,
                    borderRadius: "1px",
                    color: saved.includes(design.id) ? "#c9a96e" : "rgba(240,236,230,0.4)",
                    fontSize: "0.8rem",
                  }}
                >
                  {saved.includes(design.id) ? "✦" : "◇"}
                </button>
              </div>

              {/* Info */}
              <div className="p-5" style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                <div className="flex items-start justify-between mb-2">
                  <h3
                    style={{
                      fontFamily: "'Cormorant Garamond', serif",
                      fontSize: "1.2rem", fontWeight: 300, color: "#f0ece6",
                    }}
                  >
                    {design.title}
                  </h3>
                  <span
                    className="text-xs tracking-wider"
                    style={{ color: COMPLEXITY_COLORS[design.complexity] }}
                  >
                    {design.complexity}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex gap-1.5">
                    {design.palette.map((c, i) => (
                      <div key={i} style={{ width: 12, height: 12, borderRadius: "50%", background: c, border: "1px solid rgba(255,255,255,0.1)" }} />
                    ))}
                  </div>
                  <div className="flex gap-4 text-xs" style={{ color: "rgba(240,236,230,0.35)" }}>
                    <span>{design.duration}</span>
                    <span style={{ color: "#c9a96e" }}>{design.price}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
'''

# ─── book/page.tsx ─────────────────────────────────────────────────────────────
book = r'''"use client";
import { useState } from "react";

const SERVICES = [
  { id: "gel", name: "Gel Manicure", duration: "1h", price: 45 },
  { id: "gel-art", name: "Gel + Nail Art", duration: "2–3h", price: 95 },
  { id: "chrome", name: "Chrome Finish", duration: "2.5h", price: 110 },
  { id: "gems", name: "Gem Placement", duration: "3h", price: 130 },
  { id: "signature", name: "Signature 3D Set", duration: "4–5h", price: 185 },
];

const ARTISTS = [
  { id: "sofia", name: "Sofia L.", specialty: "Chrome & Editorial", available: true },
  { id: "nina", name: "Nina K.", specialty: "Gems & 3D Art", available: true },
  { id: "lena", name: "Lena M.", specialty: "Minimal & Nail Health", available: false },
];

const TIMES = ["10:00", "11:00", "12:00", "14:00", "15:00", "16:00", "17:00"];

const DAYS = Array.from({ length: 7 }, (_, i) => {
  const d = new Date(2026, 3, 28 + i);
  return {
    date: d.getDate(),
    day: d.toLocaleDateString("en", { weekday: "short" }),
    full: d.toISOString().split("T")[0],
  };
});

export default function BookPage() {
  const [step, setStep] = useState(1);
  const [service, setService] = useState("");
  const [artist, setArtist] = useState("");
  const [day, setDay] = useState("");
  const [time, setTime] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [note, setNote] = useState("");
  const [done, setDone] = useState(false);

  const selectedService = SERVICES.find((s) => s.id === service);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setDone(true);
  };

  if (done) {
    return (
      <main className="min-h-screen pt-16 flex items-center justify-center" style={{ background: "#080808" }}>
        <div className="text-center px-6" style={{ maxWidth: 520 }}>
          <div className="mb-8 text-5xl" style={{ color: "#c9a96e" }}>✦</div>
          <h1
            className="mb-4"
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "3rem", fontWeight: 300, color: "#f0ece6",
            }}
          >
            Reservation Confirmed
          </h1>
          <p className="mb-8 text-sm leading-relaxed" style={{ color: "rgba(240,236,230,0.5)" }}>
            Your appointment has been reserved. Your artist will review your design and confirm within 2 hours.
          </p>
          <div
            className="p-6 mb-8 text-left"
            style={{ background: "#111", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "2px" }}
          >
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <p style={{ color: "rgba(240,236,230,0.3)" }}>Service</p>
                <p style={{ color: "#f0ece6" }}>{selectedService?.name}</p>
              </div>
              <div>
                <p style={{ color: "rgba(240,236,230,0.3)" }}>Artist</p>
                <p style={{ color: "#f0ece6" }}>{ARTISTS.find((a) => a.id === artist)?.name}</p>
              </div>
              <div>
                <p style={{ color: "rgba(240,236,230,0.3)" }}>Date & Time</p>
                <p style={{ color: "#f0ece6" }}>{day} at {time}</p>
              </div>
              <div>
                <p style={{ color: "rgba(240,236,230,0.3)" }}>Total</p>
                <p style={{ color: "#c9a96e" }}>€{selectedService?.price}</p>
              </div>
            </div>
          </div>
          <p className="text-xs" style={{ color: "rgba(240,236,230,0.25)" }}>
            A confirmation has been sent to {email}
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen pt-16" style={{ background: "#080808" }}>
      <div style={{ maxWidth: 800, margin: "0 auto", padding: "48px 24px" }}>

        {/* Header */}
        <div className="mb-12">
          <p className="mb-2 text-xs tracking-[0.4em] uppercase" style={{ color: "#c9a96e" }}>LaPrincesse</p>
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(2.5rem, 5vw, 4rem)", fontWeight: 300, color: "#f0ece6" }}>
            Reserve
          </h1>
          <p className="mt-3 text-sm" style={{ color: "rgba(240,236,230,0.45)" }}>
            Your design is already saved. Complete your reservation below.
          </p>
        </div>

        {/* Progress */}
        <div className="flex items-center gap-3 mb-12">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center gap-3">
              <div
                className="flex items-center justify-center text-xs"
                style={{
                  width: 32, height: 32, borderRadius: "50%",
                  border: step >= s ? "1px solid #c9a96e" : "1px solid rgba(255,255,255,0.1)",
                  color: step >= s ? "#c9a96e" : "rgba(240,236,230,0.3)",
                  background: step === s ? "rgba(201,169,110,0.1)" : "transparent",
                }}
              >
                {s}
              </div>
              <span className="text-xs tracking-wider uppercase" style={{ color: step >= s ? "rgba(240,236,230,0.6)" : "rgba(240,236,230,0.2)" }}>
                {s === 1 ? "Service" : s === 2 ? "Schedule" : "Details"}
              </span>
              {s < 3 && <div style={{ width: 40, height: 1, background: step > s ? "rgba(201,169,110,0.4)" : "rgba(255,255,255,0.08)" }} />}
            </div>
          ))}
        </div>

        {/* Step 1 — Service + Artist */}
        {step === 1 && (
          <div className="space-y-8">
            <div>
              <p className="text-xs tracking-[0.2em] uppercase mb-4" style={{ color: "rgba(240,236,230,0.4)" }}>Choose Service</p>
              <div className="space-y-2">
                {SERVICES.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setService(s.id)}
                    className="w-full flex items-center justify-between p-5 text-left transition-all"
                    style={{
                      border: service === s.id ? "1px solid #c9a96e" : "1px solid rgba(255,255,255,0.07)",
                      background: service === s.id ? "rgba(201,169,110,0.05)" : "#111",
                      borderRadius: "1px",
                    }}
                  >
                    <div>
                      <p className="text-sm mb-1" style={{ color: "#f0ece6", fontFamily: "'Cormorant Garamond', serif", fontSize: "1.1rem" }}>{s.name}</p>
                      <p className="text-xs" style={{ color: "rgba(240,236,230,0.35)" }}>{s.duration}</p>
                    </div>
                    <span className="text-sm" style={{ color: "#c9a96e" }}>€{s.price}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-xs tracking-[0.2em] uppercase mb-4" style={{ color: "rgba(240,236,230,0.4)" }}>Choose Artist</p>
              <div className="grid grid-cols-3 gap-3">
                {ARTISTS.map((a) => (
                  <button
                    key={a.id}
                    onClick={() => a.available && setArtist(a.id)}
                    disabled={!a.available}
                    className="p-4 text-left transition-all"
                    style={{
                      border: artist === a.id ? "1px solid #c9a96e" : "1px solid rgba(255,255,255,0.07)",
                      background: artist === a.id ? "rgba(201,169,110,0.05)" : "#111",
                      borderRadius: "1px",
                      opacity: a.available ? 1 : 0.35,
                    }}
                  >
                    <div
                      className="w-10 h-10 rounded-full mb-3 flex items-center justify-center text-xs"
                      style={{ background: "rgba(201,169,110,0.15)", color: "#c9a96e", border: "1px solid rgba(201,169,110,0.2)" }}
                    >
                      {a.name[0]}
                    </div>
                    <p className="text-xs font-medium mb-1" style={{ color: "#f0ece6" }}>{a.name}</p>
                    <p className="text-xs" style={{ color: "rgba(240,236,230,0.35)", fontSize: "0.65rem" }}>{a.specialty}</p>
                    {!a.available && <p className="text-xs mt-1" style={{ color: "rgba(240,236,230,0.25)", fontSize: "0.6rem" }}>Unavailable</p>}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => service && artist && setStep(2)}
              className="w-full py-4 text-xs tracking-[0.25em] uppercase transition-all"
              style={{
                background: service && artist ? "linear-gradient(135deg, #c9a96e, #e8d5b0)" : "rgba(255,255,255,0.05)",
                color: service && artist ? "#080808" : "rgba(240,236,230,0.3)",
                fontWeight: 500, borderRadius: "1px",
              }}
            >
              Continue →
            </button>
          </div>
        )}

        {/* Step 2 — Date + Time */}
        {step === 2 && (
          <div className="space-y-8">
            <div>
              <p className="text-xs tracking-[0.2em] uppercase mb-4" style={{ color: "rgba(240,236,230,0.4)" }}>Select Date</p>
              <div className="flex gap-2">
                {DAYS.map((d) => (
                  <button
                    key={d.full}
                    onClick={() => setDay(d.full)}
                    className="flex-1 py-4 flex flex-col items-center gap-1 transition-all"
                    style={{
                      border: day === d.full ? "1px solid #c9a96e" : "1px solid rgba(255,255,255,0.07)",
                      background: day === d.full ? "rgba(201,169,110,0.08)" : "#111",
                      borderRadius: "1px",
                    }}
                  >
                    <span className="text-xs" style={{ color: "rgba(240,236,230,0.35)" }}>{d.day}</span>
                    <span className="text-lg" style={{ fontFamily: "'Cormorant Garamond', serif", color: day === d.full ? "#c9a96e" : "#f0ece6" }}>{d.date}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-xs tracking-[0.2em] uppercase mb-4" style={{ color: "rgba(240,236,230,0.4)" }}>Select Time</p>
              <div className="grid grid-cols-4 gap-2">
                {TIMES.map((t) => (
                  <button
                    key={t}
                    onClick={() => setTime(t)}
                    className="py-3 text-xs tracking-wider transition-all"
                    style={{
                      border: time === t ? "1px solid #c9a96e" : "1px solid rgba(255,255,255,0.07)",
                      color: time === t ? "#c9a96e" : "rgba(240,236,230,0.5)",
                      background: time === t ? "rgba(201,169,110,0.08)" : "#111",
                      borderRadius: "1px",
                    }}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={() => setStep(1)} className="flex-1 py-4 text-xs tracking-[0.2em] uppercase" style={{ border: "1px solid rgba(255,255,255,0.07)", color: "rgba(240,236,230,0.4)", borderRadius: "1px" }}>
                ← Back
              </button>
              <button
                onClick={() => day && time && setStep(3)}
                className="flex-1 py-4 text-xs tracking-[0.25em] uppercase transition-all"
                style={{
                  background: day && time ? "linear-gradient(135deg, #c9a96e, #e8d5b0)" : "rgba(255,255,255,0.05)",
                  color: day && time ? "#080808" : "rgba(240,236,230,0.3)",
                  fontWeight: 500, borderRadius: "1px",
                }}
              >
                Continue →
              </button>
            </div>
          </div>
        )}

        {/* Step 3 — Details */}
        {step === 3 && (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <p className="text-xs tracking-[0.2em] uppercase mb-4" style={{ color: "rgba(240,236,230,0.4)" }}>Your Details</p>
              <div className="space-y-4">
                {[
                  { label: "Full Name", value: name, setter: setName, placeholder: "Your name", type: "text" },
                  { label: "Email", value: email, setter: setEmail, placeholder: "your@email.com", type: "email" },
                ].map((field) => (
                  <div key={field.label}>
                    <label className="block text-xs tracking-wider uppercase mb-2" style={{ color: "rgba(240,236,230,0.35)" }}>
                      {field.label}
                    </label>
                    <input
                      type={field.type}
                      value={field.value}
                      onChange={(e) => field.setter(e.target.value)}
                      placeholder={field.placeholder}
                      required
                      className="w-full px-4 py-3 text-sm outline-none transition-all"
                      style={{
                        background: "#111", border: "1px solid rgba(255,255,255,0.08)",
                        color: "#f0ece6", borderRadius: "1px",
                      }}
                      onFocus={(e) => ((e.target as HTMLInputElement).style.borderColor = "rgba(201,169,110,0.4)")}
                      onBlur={(e) => ((e.target as HTMLInputElement).style.borderColor = "rgba(255,255,255,0.08)")}
                    />
                  </div>
                ))}
                <div>
                  <label className="block text-xs tracking-wider uppercase mb-2" style={{ color: "rgba(240,236,230,0.35)" }}>
                    Notes for your artist (optional)
                  </label>
                  <textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Any references, preferences, or special requests..."
                    rows={3}
                    className="w-full px-4 py-3 text-sm outline-none transition-all resize-none"
                    style={{
                      background: "#111", border: "1px solid rgba(255,255,255,0.08)",
                      color: "#f0ece6", borderRadius: "1px",
                    }}
                    onFocus={(e) => ((e.target as HTMLTextAreaElement).style.borderColor = "rgba(201,169,110,0.4)")}
                    onBlur={(e) => ((e.target as HTMLTextAreaElement).style.borderColor = "rgba(255,255,255,0.08)")}
                  />
                </div>
              </div>
            </div>

            {/* Summary */}
            <div className="p-5" style={{ background: "#111", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "1px" }}>
              <p className="text-xs tracking-[0.2em] uppercase mb-4" style={{ color: "rgba(240,236,230,0.4)" }}>Summary</p>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div><p style={{ color: "rgba(240,236,230,0.3)" }}>Service</p><p style={{ color: "#f0ece6" }}>{selectedService?.name}</p></div>
                <div><p style={{ color: "rgba(240,236,230,0.3)" }}>Artist</p><p style={{ color: "#f0ece6" }}>{ARTISTS.find((a) => a.id === artist)?.name}</p></div>
                <div><p style={{ color: "rgba(240,236,230,0.3)" }}>Date</p><p style={{ color: "#f0ece6" }}>{day}</p></div>
                <div><p style={{ color: "rgba(240,236,230,0.3)" }}>Time</p><p style={{ color: "#f0ece6" }}>{time}</p></div>
                <div className="col-span-2"><p style={{ color: "rgba(240,236,230,0.3)" }}>Total</p><p style={{ color: "#c9a96e", fontSize: "1.1rem", fontFamily: "'Cormorant Garamond', serif" }}>€{selectedService?.price}</p></div>
              </div>
            </div>

            <div className="flex gap-3">
              <button type="button" onClick={() => setStep(2)} className="flex-1 py-4 text-xs tracking-[0.2em] uppercase" style={{ border: "1px solid rgba(255,255,255,0.07)", color: "rgba(240,236,230,0.4)", borderRadius: "1px" }}>
                ← Back
              </button>
              <button
                type="submit"
                className="flex-1 py-4 text-xs tracking-[0.25em] uppercase"
                style={{ background: "linear-gradient(135deg, #c9a96e, #e8d5b0)", color: "#080808", fontWeight: 500, borderRadius: "1px" }}
              >
                Confirm Reservation
              </button>
            </div>
          </form>
        )}
      </div>
    </main>
  );
}
'''

os.makedirs(f"{BASE}/app/lab", exist_ok=True)
os.makedirs(f"{BASE}/app/feed", exist_ok=True)
os.makedirs(f"{BASE}/app/book", exist_ok=True)
os.makedirs(f"{BASE}/components", exist_ok=True)

with open(f"{BASE}/app/page.tsx", "w") as f:
    f.write(page)
with open(f"{BASE}/app/lab/page.tsx", "w") as f:
    f.write(lab)
with open(f"{BASE}/app/feed/page.tsx", "w") as f:
    f.write(feed)
with open(f"{BASE}/app/book/page.tsx", "w") as f:
    f.write(book)

print("All files written successfully!")
