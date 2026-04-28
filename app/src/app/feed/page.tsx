"use client";
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
