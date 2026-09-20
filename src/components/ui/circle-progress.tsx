import { cn } from "@/lib/utils";
import * as React from "react";

export interface CircleProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number;
  maxValue: number;
  size?: number;
  strokeWidth?: number;
  showValue?: boolean;
  description?: React.ReactNode;
  suffix?: string;
  counterClockwise?: boolean;
  onColorChange?: (color: string) => void;
  onValueChange?: (value: number, percentage: number) => void;
  getColor?: (fillPercentage: number) => string;
  className?: string;
  animationDuration?: number;
  disableAnimation?: boolean;
  useGradient?: boolean;
  gradientColors?: string[];
  gradientId?: string;
}

const CircleProgress = ({
  value,
  maxValue,
  size = 40,
  strokeWidth = 3,
  counterClockwise = false,
  onColorChange,
  onValueChange,
  getColor,
  className,
  animationDuration = 300,
  disableAnimation = false,
  useGradient = false,
  gradientColors = ["#10b981", "#f59e0b", "#ef4444"],
  gradientId,
  showValue: _showValue,
  description: _description,
  suffix,
  ...props
}: CircleProgressProps) => {
  void _showValue;
  void _description;

  const reactId = React.useId();
  const uniqueGradientId = gradientId ?? `circle-progress-gradient-${reactId}`;

  const [animatedValue, setAnimatedValue] = React.useState(0);
  const animatedValueRef = React.useRef(animatedValue);
  const renderedValue = disableAnimation ? Math.min(value, maxValue) : animatedValue;

  React.useEffect(() => {
    animatedValueRef.current = animatedValue;
  }, [animatedValue]);

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const fillPercentage = Math.min(renderedValue / maxValue, 1);
  const strokeDashoffset = circumference * (1 - fillPercentage);

  const defaultGetColor = (percentage: number) => {
    if (percentage < 0.7) return "stroke-emerald-500";
    if (percentage < 0.9) return "stroke-amber-500";
    return "stroke-red-500";
  };

  const currentColor = useGradient ? "" : getColor ? getColor(fillPercentage) : defaultGetColor(fillPercentage);

  React.useEffect(() => {
    if (disableAnimation) {
      return;
    }

    const start = animatedValueRef.current;
    const end = Math.min(value, maxValue);
    const startTime = performance.now();

    if (start === end) return;

    let animationFrame = 0;

    const animateProgress = (timestamp: number) => {
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / animationDuration, 1);
      const currentValue = start + (end - start) * progress;

      setAnimatedValue(currentValue);

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animateProgress);
      }
    };

    animationFrame = requestAnimationFrame(animateProgress);

    return () => cancelAnimationFrame(animationFrame);
  }, [value, maxValue, animationDuration, disableAnimation]);

  React.useEffect(() => {
    if (onColorChange) {
      onColorChange(currentColor);
    }
  }, [currentColor, onColorChange]);

  React.useEffect(() => {
    if (onValueChange) {
      onValueChange(renderedValue, fillPercentage);
    }
  }, [renderedValue, fillPercentage, onValueChange]);

  const valueText =
    props["aria-valuetext"] ||
    `${Math.round(value)}${suffix ?? ""} out of ${maxValue}${suffix ?? ""}, ${Math.round(fillPercentage * 100)}% complete`;

  return (
    <div
      className={cn(className)}
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={maxValue}
      aria-valuetext={valueText}
      {...props}
    >
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {useGradient ? (
          <defs>
            <linearGradient id={uniqueGradientId} gradientUnits="userSpaceOnUse" x1="0%" y1="0%" x2="100%" y2="100%">
              {gradientColors.map((color, index) => (
                <stop key={index} offset={`${(index / (gradientColors.length - 1)) * 100}%`} stopColor={color} />
              ))}
            </linearGradient>
          </defs>
        ) : null}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          className="fill-transparent stroke-gray-200 dark:stroke-gray-700"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          className={cn("fill-transparent transition-colors", !useGradient && currentColor)}
          style={useGradient ? { stroke: `url(#${uniqueGradientId})` } : undefined}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={counterClockwise ? -strokeDashoffset : strokeDashoffset}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
};

export { CircleProgress };
