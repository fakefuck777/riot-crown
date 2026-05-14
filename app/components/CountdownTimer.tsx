'use client';
import { useEffect, useState } from 'react';

interface CountdownTimerProps {
  targetDate: Date;
  onComplete?: () => void;
  label?: string;
}

export function CountdownTimer({ targetDate, onComplete, label }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date().getTime();
      const target = targetDate.getTime();
      const distance = target - now;

      if (distance < 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        onComplete?.();
        return;
      }

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
      });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [targetDate, onComplete]);

  const TimeUnit = ({ value, label }: { value: number; label: string }) => (
    <div className="flex flex-col items-center">
      <div
        className="text-2xl md:text-4xl font-black font-mono"
        style={{
          color: '#FF1293',
          textShadow: '0 0 10px rgba(255,18,147,0.5)',
        }}
      >
        {String(value).padStart(2, '0')}
      </div>
      <div className="text-xs uppercase tracking-widest" style={{ color: 'rgba(168,168,168,0.6)' }}>
        {label}
      </div>
    </div>
  );

  return (
    <div className="flex items-center gap-4 md:gap-6">
      {label && (
        <span className="text-sm font-mono uppercase tracking-widest" style={{ color: 'rgba(242,242,242,0.7)' }}>
          {label}
        </span>
      )}
      <TimeUnit value={timeLeft.days} label="天" />
      <span style={{ color: '#FF1293' }}>:</span>
      <TimeUnit value={timeLeft.hours} label="时" />
      <span style={{ color: '#FF1293' }}>:</span>
      <TimeUnit value={timeLeft.minutes} label="分" />
      <span style={{ color: '#FF1293' }}>:</span>
      <TimeUnit value={timeLeft.seconds} label="秒" />
    </div>
  );
}
