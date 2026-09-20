import { act, fireEvent, screen, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { installFullscreenMock } from "./test/fullscreenMock";
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
  let fullscreen: ReturnType<typeof installFullscreenMock>;

  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 8, 20, 10, 0, 0));
    fullscreen = installFullscreenMock();
  });

  afterEach(() => {
    fullscreen.restore();
    window.localStorage.clear();
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
    expect(screen.getByRole("timer")).toHaveTextContent("00:00:00");
    expect(
      within(screen.getByLabelText(/countdown display/i)).getByRole("heading", {
        name: "Time is up",
      }),
    ).toBeInTheDocument();
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

  it("enters fullscreen projection and hides settings", async () => {
    renderApp("/countdown");

    fireEvent.change(screen.getByLabelText(/^title$/i), {
      target: { value: "Break" },
    });
    setTargetTime("11:00");
    applySettings();

    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: /enter fullscreen/i }));
    });

    expect(document.fullscreenElement).toBe(document.documentElement);
    expect(screen.queryByLabelText(/target time/i)).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /apply/i })).not.toBeInTheDocument();
    expect(screen.getByRole("timer")).toHaveTextContent("01:00:00");
    expect(
      within(screen.getByLabelText(/countdown display/i)).getByRole("heading", {
        name: "Break",
      }),
    ).toBeInTheDocument();
  });

  it("reveals settings when native fullscreen exits and keeps counting", async () => {
    renderApp("/countdown");

    setTargetTime("10:00:10");
    applySettings();

    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: /enter fullscreen/i }));
    });
    expect(screen.queryByLabelText(/target time/i)).not.toBeInTheDocument();

    advanceClockTo(new Date(2026, 8, 20, 10, 0, 3));
    expect(screen.getByRole("timer")).toHaveTextContent("00:00:07");

    await act(async () => {
      await fullscreen.exitFullscreen();
    });

    expect(screen.getByLabelText(/target time/i)).toBeInTheDocument();
    expect(screen.getByRole("timer")).toHaveTextContent("00:00:07");

    advanceClockTo(new Date(2026, 8, 20, 10, 0, 5));
    expect(screen.getByRole("timer")).toHaveTextContent("00:00:05");
  });

  it("reveals return-to-settings on mouse move and returns without restarting", async () => {
    renderApp("/countdown");

    setTargetTime("10:00:20");
    applySettings();

    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: /enter fullscreen/i }));
    });

    expect(screen.queryByRole("button", { name: /return to settings/i })).not.toBeInTheDocument();

    fireEvent.mouseMove(document.documentElement);
    expect(screen.getByRole("button", { name: /return to settings/i })).toBeInTheDocument();

    advanceClockTo(new Date(2026, 8, 20, 10, 0, 4));
    expect(screen.getByRole("timer")).toHaveTextContent("00:00:16");

    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: /return to settings/i }));
    });

    expect(document.fullscreenElement).toBeNull();
    expect(screen.getByLabelText(/target time/i)).toBeInTheDocument();
    expect(screen.getByRole("timer")).toHaveTextContent("00:00:16");

    setTargetTime("12:00");
    expect(screen.getByRole("timer")).toHaveTextContent("00:00:16");

    applySettings();
    expect(screen.getByRole("timer")).toHaveTextContent("01:59:56");
  });

  it("hides the return-to-settings control after mouse idle", async () => {
    renderApp("/countdown");

    setTargetTime("11:00");
    applySettings();

    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: /enter fullscreen/i }));
    });

    fireEvent.mouseMove(document.documentElement);
    expect(screen.getByRole("button", { name: /return to settings/i })).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(2000);
    });

    expect(screen.queryByRole("button", { name: /return to settings/i })).not.toBeInTheDocument();
  });

  it("restores custom settings and remaining time after remount with the clock advanced", () => {
    const { unmount } = renderApp("/countdown");

    fireEvent.change(screen.getByLabelText(/^title$/i), {
      target: { value: "Break ends" },
    });
    fireEvent.change(screen.getByLabelText(/completion message/i), {
      target: { value: "Back to work" },
    });
    setTargetTime("11:00:00");
    applySettings();
    expect(screen.getByRole("timer")).toHaveTextContent("01:00:00");

    advanceClockTo(new Date(2026, 8, 20, 10, 15, 0));
    expect(screen.getByRole("timer")).toHaveTextContent("00:45:00");
    unmount();

    advanceClockTo(new Date(2026, 8, 20, 10, 30, 0));
    renderApp("/countdown");

    expect(screen.getByLabelText(/^title$/i)).toHaveValue("Break ends");
    expect(screen.getByLabelText(/completion message/i)).toHaveValue("Back to work");
    expect(screen.getByLabelText(/target time/i)).toHaveValue("11:00:00");
    expect(
      within(screen.getByLabelText(/countdown display/i)).getByRole("heading", {
        name: "Break ends",
      }),
    ).toBeInTheDocument();
    expect(screen.getByRole("timer")).toHaveTextContent("00:30:00");
  });

  it("restores blank optional fields and a still-running countdown after remount", () => {
    const { unmount } = renderApp("/countdown");

    setTargetTime("12:00:00");
    applySettings();
    expect(screen.getByRole("timer")).toHaveTextContent("02:00:00");
    unmount();

    advanceClockTo(new Date(2026, 8, 20, 11, 0, 0));
    renderApp("/countdown");

    expect(screen.getByLabelText(/^title$/i)).toHaveValue("");
    expect(screen.getByLabelText(/completion message/i)).toHaveValue("");
    expect(screen.getByLabelText(/target time/i)).toHaveValue("12:00:00");
    expect(within(screen.getByLabelText(/countdown display/i)).queryByRole("heading")).not.toBeInTheDocument();
    expect(screen.getByRole("timer")).toHaveTextContent("01:00:00");
  });

  it("restores an elapsed Target Time with a Completion Message", () => {
    const { unmount } = renderApp("/countdown");

    fireEvent.change(screen.getByLabelText(/completion message/i), {
      target: { value: "Time is up" },
    });
    setTargetTime("10:00:05");
    applySettings();
    unmount();

    advanceClockTo(new Date(2026, 8, 20, 10, 0, 10));
    renderApp("/countdown");

    expect(screen.getByRole("timer")).toHaveTextContent("00:00:00");
    expect(
      within(screen.getByLabelText(/countdown display/i)).getByRole("heading", {
        name: "Time is up",
      }),
    ).toBeInTheDocument();
  });

  it("restores an elapsed Target Time as 00:00:00 when Completion Message is blank", () => {
    const { unmount } = renderApp("/countdown");

    setTargetTime("10:00:05");
    applySettings();
    unmount();

    advanceClockTo(new Date(2026, 8, 20, 10, 0, 10));
    renderApp("/countdown");

    expect(screen.getByRole("timer")).toHaveTextContent("00:00:00");
  });

  it("keeps the original dated Target Time when restored on a later calendar day", () => {
    const { unmount } = renderApp("/countdown");

    setTargetTime("15:00:00");
    applySettings();
    expect(screen.getByRole("timer")).toHaveTextContent("05:00:00");
    unmount();

    advanceClockTo(new Date(2026, 8, 21, 10, 0, 0));
    renderApp("/countdown");

    expect(screen.getByLabelText(/target time/i)).toHaveValue("15:00:00");
    expect(screen.getByRole("timer")).toHaveTextContent("00:00:00");
  });

  it("still rejects newly configured past Target Times after a restore", () => {
    const { unmount } = renderApp("/countdown");

    setTargetTime("11:00:00");
    applySettings();
    unmount();

    advanceClockTo(new Date(2026, 8, 20, 10, 30, 0));
    renderApp("/countdown");
    expect(screen.getByRole("timer")).toHaveTextContent("00:30:00");

    setTargetTime("10:15:00");
    applySettings();

    expect(screen.getByRole("alert")).toHaveTextContent(/target time must be later than now/i);
    expect(screen.getByRole("timer")).toHaveTextContent("00:30:00");
  });

  it("does not let an unreapplied draft Target Time replace the saved active Target Time", () => {
    const { unmount } = renderApp("/countdown");

    setTargetTime("11:00:00");
    applySettings();
    expect(screen.getByRole("timer")).toHaveTextContent("01:00:00");

    setTargetTime("14:00:00");
    expect(screen.getByLabelText(/target time/i)).toHaveValue("14:00:00");
    expect(screen.getByRole("timer")).toHaveTextContent("01:00:00");
    unmount();

    renderApp("/countdown");

    expect(screen.getByLabelText(/target time/i)).toHaveValue("11:00:00");
    expect(screen.getByRole("timer")).toHaveTextContent("01:00:00");
  });

  it("cancels the countdown, clears settings, and stays cleared after remount", () => {
    const { unmount } = renderApp("/countdown");

    fireEvent.change(screen.getByLabelText(/^title$/i), {
      target: { value: "Break ends" },
    });
    fireEvent.change(screen.getByLabelText(/completion message/i), {
      target: { value: "Back to work" },
    });
    setTargetTime("11:00:00");
    applySettings();
    expect(screen.getByRole("timer")).toHaveTextContent("01:00:00");

    fireEvent.click(screen.getByRole("button", { name: /cancel countdown/i }));

    expect(screen.queryByLabelText(/countdown display/i)).not.toBeInTheDocument();
    expect(screen.queryByRole("timer")).not.toBeInTheDocument();
    expect(screen.getByLabelText(/^title$/i)).toHaveValue("");
    expect(screen.getByLabelText(/target time/i)).toHaveValue("");
    expect(screen.getByLabelText(/completion message/i)).toHaveValue("");
    expect(screen.queryByRole("button", { name: /cancel countdown/i })).not.toBeInTheDocument();
    unmount();

    renderApp("/countdown");

    expect(screen.queryByLabelText(/countdown display/i)).not.toBeInTheDocument();
    expect(screen.getByLabelText(/^title$/i)).toHaveValue("");
    expect(screen.getByLabelText(/target time/i)).toHaveValue("");
    expect(screen.getByLabelText(/completion message/i)).toHaveValue("");
  });
});
