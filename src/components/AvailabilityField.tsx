"use client";

import { DAY_NAMES } from "@/lib/constants";

export type Slot = { dayOfWeek: number; startTime: string; endTime: string };

export function AvailabilityField({
  value,
  onChange,
}: {
  value: Slot[];
  onChange: (slots: Slot[]) => void;
}) {
  function update(index: number, patch: Partial<Slot>) {
    onChange(value.map((s, i) => (i === index ? { ...s, ...patch } : s)));
  }

  return (
    <div className="space-y-3">
      {value.length === 0 && (
        <p className="rounded-lg border border-dashed border-ink-700 bg-ink-850 px-3 py-4 text-center text-sm text-ink-400">
          No hours added yet. Clients will see &ldquo;contact for
          availability&rdquo;.
        </p>
      )}

      {value.map((slot, i) => {
        const invalid = slot.endTime <= slot.startTime;
        return (
          <div key={i} className="flex flex-wrap items-center gap-2">
            <select
              aria-label="Day of week"
              className="input w-full sm:w-40"
              value={slot.dayOfWeek}
              onChange={(e) => update(i, { dayOfWeek: Number(e.target.value) })}
            >
              {DAY_NAMES.map((day, idx) => (
                <option key={day} value={idx}>
                  {day}
                </option>
              ))}
            </select>

            <input
              aria-label="Start time"
              type="time"
              className="input w-32"
              value={slot.startTime}
              onChange={(e) => update(i, { startTime: e.target.value })}
            />
            <span className="text-ink-400">to</span>
            <input
              aria-label="End time"
              type="time"
              className={`input w-32 ${invalid ? "border-red-500/60" : ""}`}
              value={slot.endTime}
              onChange={(e) => update(i, { endTime: e.target.value })}
            />

            <button
              type="button"
              onClick={() => onChange(value.filter((_, idx) => idx !== i))}
              className="btn-ghost px-3"
              aria-label="Remove this time slot"
            >
              ✕
            </button>

            {invalid && (
              <p className="w-full text-xs text-red-400">
                End time must be after start time.
              </p>
            )}
          </div>
        );
      })}

      {value.length < 21 && (
        <button
          type="button"
          className="btn-ghost"
          onClick={() =>
            onChange([
              ...value,
              { dayOfWeek: 1, startTime: "09:00", endTime: "17:00" },
            ])
          }
        >
          + Add time slot
        </button>
      )}
    </div>
  );
}
