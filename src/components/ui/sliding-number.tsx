import { motion, useSpring, useTransform, type MotionValue } from "motion/react";
import { useEffect } from "react";
import useMeasure from "react-use-measure";

const TRANSITION = {
  type: "spring" as const,
  stiffness: 280,
  damping: 18,
  mass: 0.3,
};

function Digit({ value, place }: { value: number; place: number }) {
  const valueRoundedToPlace = Math.floor(value / place) % 10;
  const [measureRef, bounds] = useMeasure();
  const animatedValue = useSpring(valueRoundedToPlace, TRANSITION);

  useEffect(() => {
    animatedValue.set(valueRoundedToPlace);
  }, [animatedValue, valueRoundedToPlace]);

  return (
    <div className="relative inline-block w-[1ch] overflow-hidden leading-none tabular-nums">
      <div ref={measureRef} className="invisible">
        0
      </div>
      {bounds.height > 0
        ? Array.from({ length: 10 }, (_, i) => <Number key={i} mv={animatedValue} number={i} height={bounds.height} />)
        : null}
    </div>
  );
}

function Number({ mv, number, height }: { mv: MotionValue<number>; number: number; height: number }) {
  const y = useTransform(mv, (latest) => {
    const placeValue = latest % 10;
    const offset = (10 + number - placeValue) % 10;
    let memo = offset * height;

    if (offset > 5) {
      memo -= 10 * height;
    }

    return memo;
  });

  return (
    <motion.span style={{ y }} className="absolute inset-0 flex items-center justify-center">
      {number}
    </motion.span>
  );
}

type SlidingNumberProps = {
  value: number;
  padStart?: boolean;
  decimalSeparator?: string;
};

export function SlidingNumber({ value, padStart = false, decimalSeparator = "." }: SlidingNumberProps) {
  const absValue = Math.abs(value);
  const [integerPart, decimalPart] = absValue.toString().split(".");
  const integerValue = parseInt(integerPart, 10);
  const paddedInteger = padStart && integerValue < 10 ? `0${integerPart}` : integerPart;
  const integerDigits = paddedInteger.split("");
  const integerPlaces = integerDigits.map((_, i) => Math.pow(10, integerDigits.length - i - 1));

  return (
    <div className="flex items-center">
      {value < 0 ? "-" : null}
      {integerDigits.map((_, index) => (
        <Digit key={`pos-${integerPlaces[index]}`} value={integerValue} place={integerPlaces[index]} />
      ))}
      {decimalPart ? (
        <>
          <span>{decimalSeparator}</span>
          {decimalPart.split("").map((_, index) => (
            <Digit key={`decimal-${index}`} value={parseInt(decimalPart, 10)} place={Math.pow(10, decimalPart.length - index - 1)} />
          ))}
        </>
      ) : null}
    </div>
  );
}
