import { CircleProgress } from "@/components/ui/circle-progress";
import { SlidingNumber } from "@/components/ui/sliding-number";
import { useEffect, useState, type CSSProperties, type FormEvent, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { clearAppliedCountdown, loadAppliedCountdown, saveAppliedCountdown } from "./countdownStorage";
import {
  formatRemaining,
  formatTimeInputValue,
  remainingMilliseconds,
  remainingParts,
  validateTargetTime,
  type AppliedCountdown,
} from "./countdownTime";

function initialFormState() {
  const stored = loadAppliedCountdown();
  if (!stored) {
    return {
      title: "",
      targetTimeInput: "",
      completionMessage: "",
      applied: null as AppliedCountdown | null,
    };
  }

  return {
    title: stored.title,
    targetTimeInput: formatTimeInputValue(stored.targetTime),
    completionMessage: stored.completionMessage,
    applied: stored,
  };
}

function progressColor(percentage: number) {
  if (percentage > 0.66) return "stroke-emerald-500";
  if (percentage > 0.33) return "stroke-amber-500";
  return "stroke-rose-500";
}

type RemainingParts = ReturnType<typeof remainingParts>;

type CountdownReadoutProps = {
  applied: AppliedCountdown;
  remainingMs: number;
  parts: RemainingParts;
  headingText: string | null;
  showCompletionMessage: boolean;
  circleSize: number;
  strokeWidth: number;
};

function CountdownReadout({
  applied,
  remainingMs,
  parts,
  headingText,
  showCompletionMessage,
  circleSize,
  strokeWidth,
}: CountdownReadoutProps) {
  return (
    <>
      {headingText ? (
        <h2 className={showCompletionMessage ? "countdown-title countdown-completion-title" : "countdown-title"}>
          {headingText}
        </h2>
      ) : null}
      <div
        className="countdown-circle"
        style={
          {
            "--circle-size": `${circleSize}px`,
            "--circle-stroke": `${strokeWidth}px`,
          } as CSSProperties
        }
      >
        <CircleProgress
          value={remainingMs}
          maxValue={applied.initialDurationMs}
          size={circleSize}
          strokeWidth={strokeWidth}
          counterClockwise
          disableAnimation
          getColor={progressColor}
          className="countdown-circle-progress"
        />
        <div className="countdown-circle-center">
          <div className="countdown-digits" role="timer" aria-live="polite">
            <span className="sr-only">{formatRemaining(remainingMs)}</span>
            <div className="countdown-digits-face" aria-hidden="true">
              <SlidingNumber value={parts.hours} padStart />
              <span className="countdown-digits-separator">:</span>
              <SlidingNumber value={parts.minutes} padStart />
              <span className="countdown-digits-separator">:</span>
              <SlidingNumber value={parts.seconds} padStart />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export function CountdownTimerPage() {
  const [initial] = useState(initialFormState);
  const [title, setTitle] = useState(initial.title);
  const [targetTimeInput, setTargetTimeInput] = useState(initial.targetTimeInput);
  const [completionMessage, setCompletionMessage] = useState(initial.completionMessage);
  const [error, setError] = useState<string | null>(null);
  const [applied, setApplied] = useState<AppliedCountdown | null>(initial.applied);
  const [now, setNow] = useState(() => new Date());
  const [isProjecting, setIsProjecting] = useState(false);
  const [showReturnControl, setShowReturnControl] = useState(false);
  const [viewportTick, setViewportTick] = useState(0);

  useEffect(() => {
    if (!applied) {
      return;
    }
    const id = window.setInterval(() => {
      setNow(new Date());
    }, 250);
    return () => window.clearInterval(id);
  }, [applied]);

  useEffect(() => {
    function handleFullscreenChange() {
      const projecting = document.fullscreenElement != null;
      setIsProjecting(projecting);
      if (!projecting) {
        setShowReturnControl(false);
      }
    }
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  useEffect(() => {
    if (!isProjecting) {
      return;
    }

    function handleResize() {
      setViewportTick((tick) => tick + 1);
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isProjecting]);

  useEffect(() => {
    if (!isProjecting) {
      return;
    }

    let hideTimer: number | undefined;

    function handleMouseMove() {
      setShowReturnControl(true);
      window.clearTimeout(hideTimer);
      hideTimer = window.setTimeout(() => {
        setShowReturnControl(false);
      }, 2000);
    }

    document.addEventListener("mousemove", handleMouseMove);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      window.clearTimeout(hideTimer);
    };
  }, [isProjecting]);

  function handleApply(event: FormEvent) {
    event.preventDefault();
    const applyNow = new Date();
    const result = validateTargetTime(targetTimeInput, applyNow);
    if (!result.ok) {
      setError(result.message);
      return;
    }
    setError(null);
    const nextApplied: AppliedCountdown = {
      title: title.trim(),
      targetTime: result.target,
      completionMessage: completionMessage.trim(),
      initialDurationMs: result.target.getTime() - applyNow.getTime(),
    };
    setApplied(nextApplied);
    saveAppliedCountdown(nextApplied);
    setNow(applyNow);
  }

  function handleCancel() {
    setTitle("");
    setTargetTimeInput("");
    setCompletionMessage("");
    setError(null);
    setApplied(null);
    clearAppliedCountdown();
  }

  async function handleEnterFullscreen() {
    await document.documentElement.requestFullscreen();
  }

  async function handleReturnToSettings() {
    if (document.fullscreenElement) {
      await document.exitFullscreen();
    }
  }

  const remainingMs = applied ? remainingMilliseconds(applied.targetTime, now) : null;
  const isComplete = remainingMs === 0;
  const showCompletionMessage = isComplete && applied !== null && applied.completionMessage.length > 0;
  const headingText = showCompletionMessage ? applied.completionMessage : applied?.title ? applied.title : null;
  const parts = remainingMs !== null ? remainingParts(remainingMs) : null;
  void viewportTick;
  const circleSize = isProjecting ? Math.max(280, Math.floor(Math.min(window.innerWidth, window.innerHeight) * 0.58)) : 200;
  const strokeWidth = isProjecting ? Math.max(12, Math.round(circleSize * 0.035)) : 8;

  const activeReadout =
    applied && remainingMs !== null && parts !== null ? (
      <CountdownReadout
        applied={applied}
        remainingMs={remainingMs}
        parts={parts}
        headingText={headingText}
        showCompletionMessage={showCompletionMessage}
        circleSize={circleSize}
        strokeWidth={strokeWidth}
      />
    ) : null;

  let workspace: ReactNode = null;
  if (!isProjecting) {
    workspace = (
      <>
        <p className="countdown-back">
          <Link to="/">Back to Tool Hub</Link>
        </p>
        <h1>Countdown Timer</h1>

        <div className="countdown-workspace">
          <form className="countdown-settings" onSubmit={handleApply}>
            <div className="field">
              <label htmlFor="countdown-title">Title</label>
              <input
                id="countdown-title"
                name="title"
                type="text"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                autoComplete="off"
              />
            </div>

            <div className="field">
              <label htmlFor="countdown-target-time">Target Time</label>
              <input
                id="countdown-target-time"
                name="targetTime"
                type="time"
                step={1}
                value={targetTimeInput}
                onChange={(event) => setTargetTimeInput(event.target.value)}
              />
            </div>

            <div className="field">
              <label htmlFor="countdown-completion-message">Completion Message</label>
              <input
                id="countdown-completion-message"
                name="completionMessage"
                type="text"
                value={completionMessage}
                onChange={(event) => setCompletionMessage(event.target.value)}
                autoComplete="off"
              />
            </div>

            {error ? (
              <p className="form-error" role="alert">
                {error}
              </p>
            ) : null}

            <div className="countdown-actions">
              <button type="submit">Apply</button>
              {applied ? (
                <button type="button" onClick={handleCancel}>
                  Cancel countdown
                </button>
              ) : null}
            </div>
          </form>

          {activeReadout ? (
            <section className="countdown-preview" aria-label="Countdown display">
              {activeReadout}
              <button type="button" className="countdown-preview-action" onClick={handleEnterFullscreen}>
                Enter fullscreen
              </button>
            </section>
          ) : (
            <section className="countdown-preview countdown-preview--empty" aria-label="Countdown preview">
              <p className="countdown-preview-empty">Set a target time to begin</p>
            </section>
          )}
        </div>
      </>
    );
  }

  return (
    <main className={isProjecting ? "countdown-page projecting" : "countdown-page page-canvas"}>
      {workspace}

      {isProjecting && activeReadout ? (
        <section className="countdown-display" aria-label="Countdown display">
          {activeReadout}
          {showReturnControl ? (
            <button type="button" onClick={handleReturnToSettings}>
              Return to settings
            </button>
          ) : null}
        </section>
      ) : null}
    </main>
  );
}
