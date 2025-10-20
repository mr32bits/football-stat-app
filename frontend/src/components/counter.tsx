import { useEffect, useState } from "react";

interface CounterProps {
  startValue: number;
  endValue: number;
  duration?: number; // Duration in milliseconds (default: 2000ms)
}

const Counter: React.FC<CounterProps> = ({
  startValue,
  endValue,
  duration = 2000,
}) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start: number | null = null;
    const startValue = 0;
    const change = endValue - startValue;

    const easeOutQuad = (t: number) => t * (2 - t); // Easing function

    const animate = (timestamp: number) => {
      if (!start) start = timestamp;
      const elapsed = timestamp - start;
      const progress = Math.min(elapsed / duration, 1); // Normalize progress (0 to 1)
      const easedProgress = easeOutQuad(progress);
      setCount(Math.round(startValue + change * easedProgress));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [endValue, duration]);

  return (
    <div className="text-5xl font-bold text-blue-600 transition-all duration-300">
      {count}
    </div>
  );
};

export default Counter;
