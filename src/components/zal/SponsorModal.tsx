"use client";

import { useEffect, useState, useCallback } from "react";
import { IconClose, IconCopy, IconCheck } from "./icons";

interface Props {
  open: boolean;
  onClose: () => void;
  onToast: (msg: string, type?: "success" | "error") => void;
}

const SPONSORS = [
  { name: "تون (TON)", address: "UQDjzK1w66zlJbUGtMMdEn2eEEgCcW30N4gaEnN22cJaAnP1" },
  { name: "اتریوم (ETH)", address: "0x637a264b8CAC85B79715327c8a4d65028273A969" },
  { name: "بیت‌کوین (BTC)", address: "bc1q6x0hzhmn4tqpajwcqjscqnna5q8su2j6r0sp06" },
];

export function SponsorModal({ open, onClose, onToast }: Props) {
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      const onKey = (e: KeyboardEvent) => {
        if (e.key === "Escape") onClose();
      };
      document.addEventListener("keydown", onKey);
      return () => {
        document.body.style.overflow = "";
        document.removeEventListener("keydown", onKey);
      };
    }
  }, [open, onClose]);

  const handleCopy = useCallback((address: string) => {
    navigator.clipboard.writeText(address);
    setCopied(address);
    onToast("آدرس کپی شد", "success");
    setTimeout(() => {
      setCopied(null);
    }, 2000);
  }, [onToast]);

  if (!open) return null;

  return (
    <div
      className="sim-modal-overlay open"
      role="dialog"
      aria-modal="true"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="sim-modal sim-glass sim-scroll relative p-6">
        <button
          onClick={onClose}
          aria-label="بستن"
          className="absolute left-4 top-4 z-10 grid h-9 w-9 place-items-center rounded-full border border-[var(--sim-line)] bg-white/40 text-[var(--sim-lapis)] transition-all hover:rotate-90 hover:border-[var(--sim-gold)] hover:bg-[rgba(168,129,31,0.18)]"
        >
          <IconClose className="h-4 w-4" />
        </button>

        {/* هدر */}
        <div className="mb-6 flex flex-col items-center border-b border-[var(--sim-line)] pb-5 text-center">
          <h2 className="sim-nasta sim-gold-text mb-3 text-2xl font-bold">
            حمایت مالی از زال
          </h2>
          <p className="max-w-[400px] text-[0.88rem] leading-[1.8] text-[#54452b]">
            از حمایت شما برای ادامه‌ی مسیر توسعه‌ی هوش مصنوعی باز برای زبان فارسی
            صمیمانه سپاسگزاریم.
          </p>
        </div>

        {/* آدرس‌ها */}
        <div className="flex flex-col gap-3">
          {SPONSORS.map((sp) => (
            <div key={sp.name} className="flex flex-col gap-1.5">
              <label className="text-[0.74rem] font-bold text-[var(--sim-gold-deep)]">
                {sp.name}
              </label>
              <div className="flex items-center justify-between gap-2 rounded-xl border border-[var(--sim-line)] bg-white/40 p-2 pl-3 transition-colors hover:border-[var(--sim-gold)]">
                <span
                  className="truncate text-[0.85rem] font-semibold tracking-wide text-[#3a3122]"
                  dir="ltr"
                >
                  {sp.address}
                </span>
                <button
                  onClick={() => handleCopy(sp.address)}
                  className="flex flex-none items-center gap-1 rounded-lg bg-[rgba(168,129,31,0.1)] px-2 py-1.5 text-[0.7rem] font-bold text-[var(--sim-lapis)] transition-colors hover:bg-[rgba(168,129,31,0.2)]"
                  aria-label={`کپی آدرس ${sp.name}`}
                >
                  {copied === sp.address ? (
                    <IconCheck className="h-3.5 w-3.5 text-[var(--sim-gold-deep)]" />
                  ) : (
                    <IconCopy className="h-3.5 w-3.5" />
                  )}
                  {copied === sp.address ? "کپی شد" : "کپی"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
