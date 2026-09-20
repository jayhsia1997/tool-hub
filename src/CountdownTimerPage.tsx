import { useEffect, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import {
  loadAppliedCountdown,
  saveAppliedCountdown,
} from "./countdownStorage";
import {
  formatRemaining,
  formatTimeInputValue,
  remainingMilliseconds,
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
    const result = validateTargetTime(targetTimeInput, new Date());
    if (!result.ok) {
      setError(result.message);
      return;
    }
    setError(null);
    const nextApplied: AppliedCountdown = {
      title: title.trim(),
      targetTime: result.target,
      completionMessage: completionMessage.trim(),
    };
    setApplied(nextApplied);
    saveAppliedCountdown(nextApplied);
    setNow(new Date());
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
  const showCompletionMessage =
    isComplete && applied !== null && applied.completionMessage.length > 0;

  return (
    <main className={isProjecting ? "countdown-page projecting" : "countdown-page"}>
      {!isProjecting ? (
        <>
          <p>
            <Link to="/">Back to Tool Hub</Link>
          </p>
          <h1>Countdown Timer</h1>

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

            <button type="submit">Apply</button>
          </form>
        </>
      ) : null}

      {applied ? (
        <section className="countdown-display" aria-label="Countdown display">
          {applied.title ? <h2 className="countdown-title">{applied.title}</h2> : null}
          {showCompletionMessage ? (
            <p className="completion-message">{applied.completionMessage}</p>
          ) : (
            <p className="countdown-digits" role="timer" aria-live="polite">
              {formatRemaining(remainingMs ?? 0)}
            </p>
          )}
          {!isProjecting ? (
            <button type="button" onClick={handleEnterFullscreen}>
              Enter fullscreen
            </button>
          ) : null}
          {isProjecting && showReturnControl ? (
            <button type="button" onClick={handleReturnToSettings}>
              Return to settings
            </button>
          ) : null}
        </section>
      ) : null}
    </main>
  );
}
