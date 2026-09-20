import { act, fireEvent, screen, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { renderApp } from "./test/renderApp";

function setTargetTime(value: string) {
  fireEvent.change(screen.getByLabelText(/target time/i), {
    target: { value },
  });
}

function applySettings() {
  fireEvent.click(screen.getByRole("button", { name: /apply/i }));
}

function advanceClockTo(date: Date) {
  act(() => {
    // Fake timers advance Date together with setInterval; land exactly on `date`.
    vi.setSystemTime(new Date(date.getTime() - 250));
    vi.advanceTimersByTime(250);
  });
}

describe("Countdown Timer", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 8, 20, 10, 0, 0));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("starts with blank optional fields and neutral labels", () => {
    renderApp("/countdown");

    expect(screen.getByLabelText(/^title$/i)).toHaveValue("");
    expect(screen.getByLabelText(/target time/i)).toHaveValue("");
    expect(screen.getByLabelText(/completion message/i)).toHaveValue("");
    expect(screen.queryByText(/event/i)).not.toBeInTheDocument();
  });

  it("rejects a missing Target Time", () => {
    renderApp("/countdown");

    applySettings();

    expect(screen.getByRole("alert")).toHaveTextContent(/enter a valid target time/i);
    expect(screen.queryByRole("timer")).not.toBeInTheDocument();
  });

  it("rejects an invalid Target Time", () => {
    renderApp("/countdown");

    setTargetTime("25:00");
    applySettings();

    expect(screen.getByRole("alert")).toHaveTextContent(/enter a valid target time/i);
    expect(screen.queryByRole("timer")).not.toBeInTheDocument();
  });

  it("rejects a Target Time that has already passed", () => {
    renderApp("/countdown");

    setTargetTime("09:30");
    applySettings();

    expect(screen.getByRole("alert")).toHaveTextContent(/target time must be later than now/i);
    expect(screen.queryByRole("timer")).not.toBeInTheDocument();
  });

  it("shows remaining time as HH:MM:SS for a future Target Time", () => {
    renderApp("/countdown");

    setTargetTime("12:30");
    applySettings();

    expect(screen.getByRole("timer")).toHaveTextContent("02:30:00");
  });

  it("hides a blank title and shows a provided title on the display", () => {
    renderApp("/countdown");

    setTargetTime("11:00");
    applySettings();
    expect(within(screen.getByLabelText(/countdown display/i)).queryByRole("heading")).not.toBeInTheDocument();

    fireEvent.change(screen.getByLabelText(/^title$/i), {
      target: { value: "Break ends" },
    });
    applySettings();

    expect(within(screen.getByLabelText(/countdown display/i)).getByRole("heading", { name: "Break ends" })).toBeInTheDocument();
  });

  it("keeps the running Target Time until a valid replacement is reapplied", () => {
    renderApp("/countdown");

    setTargetTime("11:00");
    applySettings();
    expect(screen.getByRole("timer")).toHaveTextContent("01:00:00");

    setTargetTime("12:00");
    expect(screen.getByRole("timer")).toHaveTextContent("01:00:00");

    applySettings();
    expect(screen.getByRole("timer")).toHaveTextContent("02:00:00");
  });

  it("updates the display from the clock and clamps at zero", () => {
    renderApp("/countdown");

    setTargetTime("10:00:05");
    applySettings();
    expect(screen.getByRole("timer")).toHaveTextContent("00:00:05");

    advanceClockTo(new Date(2026, 8, 20, 10, 0, 2));
    expect(screen.getByRole("timer")).toHaveTextContent("00:00:03");

    advanceClockTo(new Date(2026, 8, 20, 10, 0, 5));
    expect(screen.getByRole("timer")).toHaveTextContent("00:00:00");

    advanceClockTo(new Date(2026, 8, 20, 10, 0, 10));
    expect(screen.getByRole("timer")).toHaveTextContent("00:00:00");
  });

  it("shows Completion Message at zero, or keeps 00:00:00 when blank", () => {
    const { unmount } = renderApp("/countdown");

    setTargetTime("10:00:02");
    applySettings();

    advanceClockTo(new Date(2026, 8, 20, 10, 0, 2));
    expect(screen.getByRole("timer")).toHaveTextContent("00:00:00");
    unmount();

    renderApp("/countdown");
    fireEvent.change(screen.getByLabelText(/completion message/i), {
      target: { value: "Time is up" },
    });
    setTargetTime("10:00:02");
    // Reset clock before applying so validation accepts a future target.
    act(() => {
      vi.setSystemTime(new Date(2026, 8, 20, 10, 0, 0));
    });
    applySettings();

    advanceClockTo(new Date(2026, 8, 20, 10, 0, 2));
    expect(screen.queryByRole("timer")).not.toBeInTheDocument();
    expect(within(screen.getByLabelText(/countdown display/i)).getByText("Time is up")).toBeInTheDocument();
  });

  it("supports a Target Time more than one hour away", () => {
    renderApp("/countdown");

    setTargetTime("14:45:30");
    applySettings();

    expect(screen.getByRole("timer")).toHaveTextContent("04:45:30");
  });

  it("crosses hour and minute boundaries from the clock", () => {
    renderApp("/countdown");

    setTargetTime("11:00:00");
    applySettings();
    expect(screen.getByRole("timer")).toHaveTextContent("01:00:00");

    advanceClockTo(new Date(2026, 8, 20, 10, 0, 1));
    expect(screen.getByRole("timer")).toHaveTextContent("00:59:59");

    advanceClockTo(new Date(2026, 8, 20, 10, 59, 59));
    expect(screen.getByRole("timer")).toHaveTextContent("00:00:01");

    advanceClockTo(new Date(2026, 8, 20, 11, 0, 0));
    expect(screen.getByRole("timer")).toHaveTextContent("00:00:00");
  });
});
