"use client";
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
