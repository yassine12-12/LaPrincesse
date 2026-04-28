"use client";
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
