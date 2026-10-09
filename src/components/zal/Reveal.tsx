"use client";

import {
  useEffect,
  useRef,
  useState,
  type ReactNode,
  type ElementType,
} from "react";

interface RevealProps {
  children: ReactNode;
  /** تأخیر ورود به میلی‌ثانیه — برای ایجاد افکت متوالی */
  delay?: number;
  /** نوع حرکت ورود */
  variant?: "up" | "scale" | "fade" | "left" | "right";
  /** تگ HTML خروجی (پیش‌فرض div) */
  as?: ElementType;
  className?: string;
  /** آستانه دید — پیش‌فرض ۱۲٪ */
  threshold?: number;
}

/**
 * پوشش‌دهنده‌ی اسکرول-ریویل.
 * عنصر را مخفی نگه می‌دارد تا وقتی وارد viewport شد، نرم ظاهر شود.
 * از IntersectionObserver استفاده می‌کند و فقط یک‌بار اجرا می‌شود.
 */
export function Reveal({
  children,
  delay = 0,
  variant = "up",
  as: Tag = "div",
  className = "",
  threshold = 0.12,
}: RevealProps) {
  const ref = useRef<HTMLElement>(null);
  const [shown, setShown] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  });

  useEffect(() => {
    if (shown) return; // اگر از ابتدا قابل دیدن است (reduced-motion)، نیازی به Observer نیست
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setShown(true);
            io.unobserve(e.target);
          }
        });
      },
      { threshold, rootMargin: "0px 0px -60px 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [shown, threshold]);

  return (
    <Tag
      ref={ref as never}
      className={`sim-reveal sim-reveal-${variant} ${
        shown ? "sim-reveal-in" : ""
      } ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </Tag>
  );
}
