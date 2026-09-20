export type AppliedCountdown = {
  title: string;
  targetTime: Date;
  completionMessage: string;
  /** Duration from Apply (or restore baseline) to Target Time, for circle progress max. */
  initialDurationMs: number;
};

export function parseTargetTimeForToday(timeValue: string, now: Date): Date | null {
  if (!timeValue) {
    return null;
  }

  const match = /^(\d{2}):(\d{2})(?::(\d{2}))?$/.exec(timeValue);
  if (!match) {
    return null;
  }

  const hours = Number(match[1]);
  const minutes = Number(match[2]);
  const seconds = Number(match[3] ?? "0");

  if (hours > 23 || minutes > 59 || seconds > 59 || Number.isNaN(hours) || Number.isNaN(minutes) || Number.isNaN(seconds)) {
    return null;
  }

  return new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes, seconds, 0);
}

export function validateTargetTime(timeValue: string, now: Date): { ok: true; target: Date } | { ok: false; message: string } {
  const target = parseTargetTimeForToday(timeValue, now);
  if (!target) {
    return { ok: false, message: "Enter a valid Target Time for today." };
  }
  if (target.getTime() <= now.getTime()) {
    return {
      ok: false,
      message: "Target Time must be later than now.",
    };
  }
  return { ok: true, target };
}

export function formatRemaining(ms: number): string {
  const { hours, minutes, seconds } = remainingParts(ms);
  return `${pad2(hours)}:${pad2(minutes)}:${pad2(seconds)}`;
}

export function remainingParts(ms: number): {
  hours: number;
  minutes: number;
  seconds: number;
} {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  return {
    hours: Math.floor(totalSeconds / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
  };
}

export function remainingMilliseconds(target: Date, now: Date): number {
  return Math.max(0, target.getTime() - now.getTime());
}

export function formatTimeInputValue(date: Date): string {
  return [pad2(date.getHours()), pad2(date.getMinutes()), pad2(date.getSeconds())].join(":");
}

function pad2(value: number): string {
  return String(value).padStart(2, "0");
}
