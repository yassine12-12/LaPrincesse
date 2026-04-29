import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import React, { useState } from "react";

export const Route = createFileRoute("/tooth-gems")({
  head: () => ({
    meta: [
      { title: "Tooth Gems — LaPrincesse" },
      { name: "description", content: "Design your tooth gem placement. Choose from Swarovski and Preciosa crystals." },
    ],
  }),
  component: ToothGemsPage,
});

const fraunces = "\"Fraunces\", \"Georgia\", serif";
const mono = "\"JetBrains Mono\", ui-monospace, monospace";
const sans = "\"Inter\", \"Helvetica Neue\", sans-serif";

const GEM_CATALOG = [
  { id: "crystal",  name: "Crystal Clear", brand: "Swarovski", size: "SS5",  tint: "radial-gradient(circle at 35% 28%, #fff 0%, #d8d8de 30%, #6a6a72 70%, #fff 100%)" },
  { id: "diamond",  name: "White Diamond", brand: "Swarovski", size: "SS5",  tint: "radial-gradient(circle at 35% 28%, #f8fcff 0%, #c0d0e8 40%, #8090b0 80%)" },
  { id: "aurora",   name: "Aurora Borealis", brand: "Swarovski", size: "SS5", tint: "radial-gradient(circle at 30% 25%, #fff 0%, #d0e8ff 22%, #e8c8ff 44%, #c8ffd8 66%, #fff 100%)" },
  { id: "rose",     name: "Rose Pink",     brand: "Swarovski", size: "SS7",  tint: "radial-gradient(circle at 35% 28%, #ffb8d0 0%, #e85888 60%, #c03060 100%)" },
  { id: "ruby",     name: "Siam Red",      brand: "Swarovski", size: "SS5",  tint: "radial-gradient(circle at 35% 28%, #ff8888 0%, #8a0a12 60%, #aa2030 100%)" },
  { id: "sapphire", name: "Sapphire",      brand: "Swarovski", size: "SS5",  tint: "radial-gradient(circle at 35% 28%, #8090ff 0%, #08163a 60%, #2040a0 100%)" },
  { id: "emerald",  name: "Emerald",       brand: "Swarovski", size: "SS7",  tint: "radial-gradient(circle at 35% 28%, #88ffb0 0%, #08402a 60%, #1a7050 100%)" },
  { id: "amethyst", name: "Amethyst",      brand: "Swarovski", size: "SS5",  tint: "radial-gradient(circle at 35% 28%, #e0a0ff 0%, #500858 60%, #9030a0 100%)" },
  { id: "topaz",    name: "Golden Topaz",  brand: "Swarovski", size: "SS7",  tint: "radial-gradient(circle at 35% 28%, #ffe080 0%, #a07828 60%, #806020 100%)" },
  { id: "onyx",     name: "Jet Flatback",  brand: "Preciosa",  size: "SS5",  tint: "radial-gradient(circle at 35% 28%, #4a4a4e 0%, #0a0a0a 60%, #2a2a2e 100%)" },
  { id: "gold",     name: "24K Gold Foil", brand: "Nail Art",  size: "SS3",  tint: "radial-gradient(circle at 35% 28%, #fff8d0 0%, #c8a050 50%, #8a6020 100%)" },
  { id: "silver",   name: "Silver Foil",   brand: "Nail Art",  size: "SS3",  tint: "radial-gradient(circle at 35% 28%, #fff 0%, #d8d8e0 40%, #888 100%)" },
];

const GEM_SIZES = ["SS3", "SS5", "SS7", "SS10"];

const TOOTH_POSITIONS = [
  { id: "ul2", name: "Upper Left Lateral",  x: 28, y: 42 },
  { id: "ul1", name: "Upper Left Central",  x: 42, y: 36 },
  { id: "ur1", name: "Upper Right Central", x: 58, y: 36 },
  { id: "ur2", name: "Upper Right Lateral", x: 72, y: 42 },
];

type PlacedGem = { positionId: string; gemId: string; size: string };

function ToothMockup({ placed, onPlace, activePos }: {
  placed: PlacedGem[];
  onPlace: (posId: string) => void;
  activePos: string | null;
}) {
  const getGemAt = (posId: string) => placed.find(p => p.positionId === posId);

  return (
    <div style={{ width: "100%", maxWidth: 360, margin: "0 auto", position: "relative" }}>
      {/* Lips + teeth mockup */}
      <svg viewBox="0 0 200 100" style={{ width: "100%", display: "block" }}>
        {/* Lower lip shadow */}
        <ellipse cx="100" cy="92" rx="62" ry="14" fill="rgba(0,0,0,0.25)" />
        {/* Upper lip */}
        <path d="M38 56 Q58 44 80 50 Q100 54 100 54 Q100 54 120 50 Q142 44 162 56 Q145 70 100 72 Q55 70 38 56Z" fill="#c47090" />
        {/* Lower lip */}
        <path d="M38 56 Q55 78 100 82 Q145 78 162 56 Q145 70 100 72 Q55 70 38 56Z" fill="#d4809a" />
        {/* Teeth area */}
        <clipPath id="teethClip">
          <ellipse cx="100" cy="62" rx="52" ry="18" />
        </clipPath>
        <rect x="48" y="44" width="104" height="36" fill="#f8f4ee" clipPath="url(#teethClip)" rx="4" />
        {/* Tooth dividers */}
        {[72, 87, 100, 113, 128].map(x => (
          <line key={x} x1={x} y1="44" x2={x} y2="80" stroke="rgba(180,160,140,0.25)" strokeWidth="0.7" clipPath="url(#teethClip)" />
        ))}
        {/* Gem spots */}
        {TOOTH_POSITIONS.map(pos => {
          const gem = getGemAt(pos.id);
          const isActive = activePos === pos.id;
          return (
            <g key={pos.id} style={{ cursor: "pointer" }} onClick={() => onPlace(pos.id)}>
              {/* Hit area */}
              <circle cx={pos.x * 2} cy={pos.y} r="9" fill="transparent" />
              {gem ? (
                <>
                  <circle cx={pos.x * 2} cy={pos.y} r="5.5"
                    fill="rgba(0,0,0,0.15)"
                    style={{ filter: "blur(1.5px)" }}
                  />
                  <circle cx={pos.x * 2} cy={pos.y} r="5"
                    fill={GEM_CATALOG.find(g => g.id === gem.gemId)?.tint ?? "#fff"}
                    stroke="rgba(255,255,255,0.6)" strokeWidth="0.5"
                  />
                  {/* Sparkle */}
                  <circle cx={pos.x * 2 - 1.5} cy={pos.y - 1.5} r="1.2" fill="rgba(255,255,255,0.8)" />
                </>
              ) : (
                <circle cx={pos.x * 2} cy={pos.y} r="4"
                  fill={isActive ? "rgba(255,255,255,0.25)" : "rgba(255,255,255,0.08)"}
                  stroke={isActive ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.2)"}
                  strokeWidth="0.8"
                  strokeDasharray={isActive ? "none" : "2 2"}
                />
              )}
            </g>
          );
        })}
      </svg>
      <div style={{ textAlign: "center", fontSize: 10, color: "rgba(255,255,255,0.25)", fontFamily: mono, letterSpacing: 1.5, marginTop: 8 }}>
        Tap a tooth to place a gem
      </div>
    </div>
  );
}

function ToothGemsPage() {
  const navigate = useNavigate();
  const [placed, setPlaced] = useState<PlacedGem[]>([]);
  const [activePos, setActivePos] = useState<string | null>(null);
  const [selectedGem, setSelectedGem] = useState(GEM_CATALOG[0].id);
  const [selectedSize, setSelectedSize] = useState("SS5");
  const [filterBrand, setFilterBrand] = useState<string | null>(null);

  const handlePlace = (posId: string) => {
    setActivePos(posId === activePos ? null : posId);
  };

  const handleApplyGem = () => {
    if (!activePos) return;
    setPlaced(prev => {
      const filtered = prev.filter(p => p.positionId !== activePos);
      return [...filtered, { positionId: activePos, gemId: selectedGem, size: selectedSize }];
    });
    setActivePos(null);
  };

  const handleRemoveGem = (posId: string) => {
    setPlaced(prev => prev.filter(p => p.positionId !== posId));
  };

  const filteredGems = filterBrand ? GEM_CATALOG.filter(g => g.brand === filterBrand) : GEM_CATALOG;
  const brands = Array.from(new Set(GEM_CATALOG.map(g => g.brand)));

  return (
    <div style={{ minHeight: "100vh", background: "#080808", fontFamily: sans, color: "#fff" }}>
      {/* Nav */}
      <div style={{ borderBottom: "1px solid rgba(255,255,255,0.06)", padding: "18px 28px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, background: "rgba(8,8,8,0.95)", backdropFilter: "blur(12px)", zIndex: 10 }}>
        <Link to="/lab" style={{ color: "rgba(255,255,255,0.35)", textDecoration: "none", fontSize: 10, letterSpacing: 2, textTransform: "uppercase", fontFamily: mono }}>← Nail Lab</Link>
        <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
          <span style={{ fontFamily: fraunces, fontSize: 16, fontStyle: "italic" }}>Tooth Gems</span>
          <span style={{ fontSize: 9, color: "rgba(255,255,255,0.3)", letterSpacing: 2, textTransform: "uppercase", fontFamily: mono }}>by laPrincesse</span>
        </div>
        <button
          onClick={() => navigate({ to: "/book", search: { designId: undefined } })}
          style={{ padding: "8px 18px", borderRadius: 100, background: "#fff", color: "#000", border: "none", fontSize: 9, letterSpacing: 2, textTransform: "uppercase", fontFamily: mono, fontWeight: 700, cursor: "pointer" }}
        >
          Book
        </button>
      </div>

      <div style={{ maxWidth: 700, margin: "0 auto", padding: "40px 24px 100px" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <h1 style={{ fontFamily: fraunces, fontSize: 38, fontStyle: "italic", fontWeight: 300, color: "#fff", margin: "0 0 10px", lineHeight: 1.1 }}>
            Design Your Gems
          </h1>
          <p style={{ color: "rgba(255,255,255,0.35)", fontSize: 12, fontFamily: sans, lineHeight: 1.7 }}>
            Choose a position on the teeth, select your crystal, and book your appointment.
          </p>
        </div>

        {/* Mockup */}
        <div style={{ marginBottom: 36 }}>
          <ToothMockup placed={placed} onPlace={handlePlace} activePos={activePos} />
        </div>

        {/* Placed gems list */}
        {placed.length > 0 && (
          <div style={{ marginBottom: 28, padding: "16px 18px", borderRadius: 14, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}>
            <div style={{ fontSize: 9, letterSpacing: 2, textTransform: "uppercase", color: "rgba(255,255,255,0.35)", fontFamily: mono, marginBottom: 12 }}>Placed Gems</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {placed.map(p => {
                const gem = GEM_CATALOG.find(g => g.id === p.gemId);
                const pos = TOOTH_POSITIONS.find(t => t.id === p.positionId);
                return (
                  <div key={p.positionId} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ width: 28, height: 28, borderRadius: "50%", background: gem?.tint, border: "1px solid rgba(255,255,255,0.15)", flexShrink: 0 }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 11, color: "#fff", fontFamily: sans }}>{gem?.name} {p.size}</div>
                      <div style={{ fontSize: 9, color: "rgba(255,255,255,0.35)", fontFamily: mono, letterSpacing: 1 }}>{pos?.name}</div>
                    </div>
                    <button onClick={() => handleRemoveGem(p.positionId)} style={{ background: "none", border: "1px solid rgba(255,80,80,0.3)", borderRadius: 100, color: "rgba(255,100,100,0.7)", fontSize: 9, padding: "3px 10px", cursor: "pointer", fontFamily: mono, letterSpacing: 1 }}>Remove</button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Gem selector (visible when a position is active) */}
        {activePos && (
          <div style={{ marginBottom: 28, padding: "20px", borderRadius: 16, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.12)" }}>
            <div style={{ fontSize: 9, letterSpacing: 2, textTransform: "uppercase", color: "rgba(255,255,255,0.4)", fontFamily: mono, marginBottom: 14 }}>
              {TOOTH_POSITIONS.find(p => p.id === activePos)?.name} — Select Crystal
            </div>

            {/* Brand filter */}
            <div style={{ display: "flex", gap: 6, marginBottom: 16 }}>
              <button onClick={() => setFilterBrand(null)} style={{ padding: "5px 12px", borderRadius: 100, background: !filterBrand ? "rgba(255,255,255,0.12)" : "transparent", border: "1px solid rgba(255,255,255,0.12)", color: "#fff", fontSize: 9, letterSpacing: 1.5, textTransform: "uppercase", fontFamily: mono, cursor: "pointer" }}>All</button>
              {brands.map(b => (
                <button key={b} onClick={() => setFilterBrand(b === filterBrand ? null : b)} style={{ padding: "5px 12px", borderRadius: 100, background: filterBrand === b ? "rgba(255,255,255,0.12)" : "transparent", border: "1px solid rgba(255,255,255,0.12)", color: "#fff", fontSize: 9, letterSpacing: 1.5, textTransform: "uppercase", fontFamily: mono, cursor: "pointer" }}>{b}</button>
              ))}
            </div>

            {/* Gem grid */}
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" as const, marginBottom: 16 }}>
              {filteredGems.map(gem => (
                <button key={gem.id} onClick={() => setSelectedGem(gem.id)} style={{
                  width: 52, padding: "6px 4px 8px", borderRadius: 10, background: "none", border: selectedGem === gem.id ? "1.5px solid #fff" : "1px solid rgba(255,255,255,0.1)", cursor: "pointer",
                  outline: "none",
                }}>
                  <div style={{ width: 28, height: 28, borderRadius: "50%", background: gem.tint, margin: "0 auto 5px", border: "1px solid rgba(255,255,255,0.15)" }} />
                  <div style={{ fontSize: 8, color: selectedGem === gem.id ? "#fff" : "rgba(255,255,255,0.5)", fontFamily: sans, textAlign: "center", lineHeight: 1.2 }}>{gem.name.split(" ")[0]}</div>
                </button>
              ))}
            </div>

            {/* Size selector */}
            <div style={{ display: "flex", gap: 6, marginBottom: 16 }}>
              {GEM_SIZES.map(s => (
                <button key={s} onClick={() => setSelectedSize(s)} style={{ padding: "5px 14px", borderRadius: 100, background: selectedSize === s ? "rgba(255,255,255,0.14)" : "transparent", border: "1px solid rgba(255,255,255,0.12)", color: "#fff", fontSize: 9, letterSpacing: 1.5, fontFamily: mono, cursor: "pointer" }}>{s}</button>
              ))}
            </div>

            <button onClick={handleApplyGem} style={{ width: "100%", padding: "11px 0", borderRadius: 100, background: "#fff", color: "#000", border: "none", fontSize: 9, letterSpacing: 2, textTransform: "uppercase", fontFamily: mono, fontWeight: 700, cursor: "pointer" }}>
              Place Gem
            </button>
          </div>
        )}

        {/* CTA */}
        <div style={{ padding: "20px", borderRadius: 16, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}>
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 9, color: "rgba(255,255,255,0.35)", fontFamily: mono, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 6 }}>Your selection</div>
            <div style={{ fontFamily: fraunces, fontSize: 22, fontStyle: "italic" }}>
              {placed.length === 0 ? "No gems placed yet" : `${placed.length} gem${placed.length > 1 ? "s" : ""} selected`}
            </div>
            {placed.length > 0 && (
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", fontFamily: sans, marginTop: 4 }}>
                {placed.map(p => GEM_CATALOG.find(g => g.id === p.gemId)?.name).join(", ")}
              </div>
            )}
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={() => navigate({ to: "/book", search: { designId: undefined } })} style={{ flex: 1, padding: "13px 0", borderRadius: 100, background: "#fff", color: "#000", border: "none", fontSize: 10, letterSpacing: 2, textTransform: "uppercase", fontFamily: mono, fontWeight: 700, cursor: "pointer" }}>
              Book Appointment
            </button>
          </div>
          <div style={{ textAlign: "center", marginTop: 10, fontSize: 9, color: "rgba(255,255,255,0.2)", fontFamily: mono, letterSpacing: 1 }}>
            Gem placement from 45 EUR · 30 min session
          </div>
        </div>
      </div>
    </div>
  );
}


