import * as React from "react";

import { Button } from "@/components/ui/button";
import { CircleProgress } from "@/components/ui/circle-progress";

/** Example-only duration countdown. Not wired into the product Countdown Timer route. */
export function CircleProgressCountdownDemo() {
  const [totalSeconds] = React.useState(60);
  const [secondsLeft, setSecondsLeft] = React.useState(totalSeconds);
  const [isRunning, setIsRunning] = React.useState(false);
  const intervalRef = React.useRef<ReturnType<typeof setInterval> | null>(null);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const startTimer = React.useCallback(() => {
    if (secondsLeft <= 0) {
      setSecondsLeft(totalSeconds);
    }
    setIsRunning(true);
  }, [secondsLeft, totalSeconds]);

  const pauseTimer = () => {
    setIsRunning(false);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setSecondsLeft(totalSeconds);
  };

  React.useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            if (intervalRef.current) {
              clearInterval(intervalRef.current);
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning]);

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="relative">
        <CircleProgress
          value={secondsLeft}
          maxValue={totalSeconds}
          size={160}
          strokeWidth={8}
          counterClockwise={true}
          getColor={(percentage) => {
            if (percentage > 0.66) return "stroke-emerald-500";
            if (percentage > 0.33) return "stroke-amber-500";
            return "stroke-rose-500";
          }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-3xl font-bold">{formatTime(secondsLeft)}</div>
            <div className="text-sm text-gray-500">{isRunning ? "Counting down..." : secondsLeft === 0 ? "Time's up!" : "Ready"}</div>
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        {!isRunning ? (
          <Button onClick={startTimer} disabled={isRunning}>
            {secondsLeft === 0 ? "Restart" : secondsLeft < totalSeconds ? "Resume" : "Start"}
          </Button>
        ) : (
          <Button variant="outline" onClick={pauseTimer}>
            Pause
          </Button>
        )}
        <Button variant="outline" onClick={resetTimer}>
          Reset
        </Button>
      </div>
    </div>
  );
}
