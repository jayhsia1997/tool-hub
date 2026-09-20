import type { AppliedCountdown } from "./countdownTime";

const STORAGE_KEY = "tool-hub.countdown-timer";

type StoredCountdown = {
  title: string;
  targetTime: string;
  completionMessage: string;
  initialDurationMs: number;
};

export function loadAppliedCountdown(): AppliedCountdown | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return null;
    }

    const parsed = JSON.parse(raw) as Partial<StoredCountdown>;
    if (
      typeof parsed.title !== "string" ||
      typeof parsed.targetTime !== "string" ||
      typeof parsed.completionMessage !== "string" ||
      typeof parsed.initialDurationMs !== "number" ||
      !Number.isFinite(parsed.initialDurationMs) ||
      parsed.initialDurationMs <= 0
    ) {
      return null;
    }

    const targetTime = new Date(parsed.targetTime);
    if (Number.isNaN(targetTime.getTime())) {
      return null;
    }

    return {
      title: parsed.title,
      targetTime,
      completionMessage: parsed.completionMessage,
      initialDurationMs: parsed.initialDurationMs,
    };
  } catch {
    return null;
  }
}

export function saveAppliedCountdown(applied: AppliedCountdown): void {
  const payload: StoredCountdown = {
    title: applied.title,
    targetTime: applied.targetTime.toISOString(),
    completionMessage: applied.completionMessage,
    initialDurationMs: applied.initialDurationMs,
  };
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
}

export function clearAppliedCountdown(): void {
  window.localStorage.removeItem(STORAGE_KEY);
}
