import { useEffect, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { formatRemaining, remainingMilliseconds, validateTargetTime, type AppliedCountdown } from "./countdownTime";

export function CountdownTimerPage() {
  const [title, setTitle] = useState("");
  const [targetTimeInput, setTargetTimeInput] = useState("");
  const [completionMessage, setCompletionMessage] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [applied, setApplied] = useState<AppliedCountdown | null>(null);
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    if (!applied) {
      return;
    }
    const id = window.setInterval(() => {
      setNow(new Date());
    }, 250);
    return () => window.clearInterval(id);
  }, [applied]);

  function handleApply(event: FormEvent) {
    event.preventDefault();
    const result = validateTargetTime(targetTimeInput, new Date());
    if (!result.ok) {
      setError(result.message);
      return;
    }
    setError(null);
    setApplied({
      title: title.trim(),
      targetTime: result.target,
      completionMessage: completionMessage.trim(),
    });
    setNow(new Date());
  }

  const remainingMs = applied ? remainingMilliseconds(applied.targetTime, now) : null;
  const isComplete = remainingMs === 0;
  const showCompletionMessage = isComplete && applied !== null && applied.completionMessage.length > 0;

  return (
    <main className="countdown-page">
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
        </section>
      ) : null}
    </main>
  );
}
