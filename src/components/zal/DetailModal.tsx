"use client";

import { useEffect } from "react";
import type { Item } from "./lib";
import {
  fa,
  faDate,
  renderMarkdown,
  linkTypeLabel,
  detectLinkType,
  itemKey,
} from "./lib";
import {
  IconModel,
  IconDataset,
  IconTag,
  IconStar,
  IconCalendar,
  IconUser,
  IconInfo,
  IconLink,
  IconArrow,
  IconClose,
} from "./icons";

interface Props {
  item: Item | null;
  starred: boolean;
  onClose: () => void;
  onToggleStar: (key: string) => void;
}

export function DetailModal({ item, starred, onClose, onToggleStar }: Props) {
  useEffect(() => {
    if (item) {
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
  }, [item, onClose]);

  if (!item) return null;

  const isDs = item.kind === "dataset";
  const Icon = isDs ? IconDataset : IconModel;
  const kindLabel = isDs ? "دیتاست" : "مدل";
  const links = item.links || [];
  const dl = item.downloads || 0;
  const key = itemKey(item);

  return (
    <div
      className="sim-modal-overlay open"
      role="dialog"
      aria-modal="true"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="sim-modal sim-glass sim-scroll">
        <button
          onClick={onClose}
          aria-label="بستن"
          className="absolute left-4 top-4 z-10 grid h-9 w-9 place-items-center rounded-full border border-[var(--sim-line)] bg-white/40 text-[var(--sim-lapis)] transition-all hover:rotate-90 hover:border-[var(--sim-gold)] hover:bg-[rgba(168,129,31,0.18)]"
        >
          <IconClose className="h-4 w-4" />
        </button>

        {/* هدر */}
        <div className="mb-5 flex items-start gap-4 border-b border-[var(--sim-line)] pb-4">
          <div
            className={`grid h-14 w-14 flex-none place-items-center rounded-2xl border ${
              isDs
                ? "border-[rgba(21,42,92,0.25)] bg-[linear-gradient(135deg,rgba(21,42,92,0.2),rgba(21,42,92,0.05))] text-[var(--sim-lapis)]"
                : "border-[rgba(168,129,31,0.25)] bg-[linear-gradient(135deg,rgba(168,129,31,0.22),rgba(168,129,31,0.06))] text-[var(--sim-gold-deep)]"
            }`}
          >
            <Icon className="h-7 w-7" />
          </div>
          <div className="min-w-0 flex-1 pr-10">
            <h2
              className="mb-2 break-words text-[1.4rem] font-bold leading-relaxed text-[var(--sim-lapis)]"
              dir="ltr"
            >
              {item.name}
            </h2>
            <div className="flex flex-wrap items-center gap-1.5">
              <span
                className={`rounded-md bg-[rgba(168,129,31,0.18)] px-2 py-0.5 text-[0.72rem] font-bold text-[var(--sim-gold-deep)] ${
                  isDs
                    ? "!bg-[rgba(21,42,92,0.15)] !text-[var(--sim-lapis)]"
                    : ""
                }`}
              >
                {kindLabel}
              </span>
              {item.date && (
                <span className="inline-flex items-center gap-1 rounded-md bg-white/40 px-2 py-0.5 text-[0.72rem] font-semibold text-[#54452b]">
                  <IconCalendar className="h-3 w-3" />
                  {faDate(item.date)}
                </span>
              )}
              {item.author && (
                <span className="inline-flex items-center gap-1 rounded-md bg-[rgba(168,129,31,0.1)] px-2 py-0.5 text-[0.72rem] font-semibold text-[var(--sim-gold-deep)]">
                  <IconUser className="h-3 w-3" />
                  {item.author}
                </span>
              )}
            </div>
          </div>
          <div className="flex flex-none flex-col items-center gap-1">
            <button
              onClick={() => onToggleStar(key)}
              aria-label="ستاره"
              className={`grid h-12 w-12 place-items-center rounded-xl border transition-all hover:-translate-y-0.5 ${
                starred
                  ? "border-[rgba(201,138,42,0.4)] bg-[rgba(201,138,42,0.18)] text-[var(--sim-star)]"
                  : "border-[var(--sim-line)] bg-white/35 text-[var(--sim-star)]"
              }`}
            >
              <IconStar
                className="h-5 w-5"
                style={starred ? { fill: "currentColor" } : { fill: "none" }}
              />
            </button>
            <span className="text-[0.7rem] font-semibold text-[#54452b]">
              {starred ? "علاقه‌مندی" : "ستاره بده"}
            </span>
          </div>
        </div>

        {/* توضیحات */}
        {item.desc && (
          <section className="mb-4">
            <div className="mb-2 flex items-center gap-1.5 text-[0.74rem] font-bold text-[var(--sim-gold-deep)]">
              <IconInfo className="h-3.5 w-3.5" />
              <span>توضیحات</span>
            </div>
            <div
              className="sim-md rounded-xl border-r-[3px] border-[var(--sim-gold)] bg-white/25 p-3 text-[0.86rem] leading-loose text-[#3a3122]"
              dangerouslySetInnerHTML={{ __html: renderMarkdown(item.desc) }}
            />
          </section>
        )}

        {/* تگ‌ها */}
        {item.tags && item.tags.length > 0 && (
          <section className="mb-4">
            <div className="mb-2 flex items-center gap-1.5 text-[0.74rem] font-bold text-[var(--sim-gold-deep)]">
              <IconTag className="h-3.5 w-3.5" />
              <span>تگ‌ها</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {item.tags.map((t) => (
                <span key={t} className="sim-tag">
                  <IconTag className="h-2.5 w-2.5 opacity-70" />
                  {t}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* لینک‌ها */}
        {links.length > 0 && (
          <section className="mb-4">
            <div className="mb-2 flex items-center gap-1.5 text-[0.74rem] font-bold text-[var(--sim-gold-deep)]">
              <IconLink className="h-3.5 w-3.5" />
              <span>لینک‌ها ({fa(links.length)})</span>
            </div>
            <div className="flex flex-col gap-1.5">
              {links.map((l, i) => {
                const t = l.type || detectLinkType(l.url);
                const cls =
                  t === "github"
                    ? "bg-[rgba(21,42,92,0.12)] text-[var(--sim-lapis)]"
                    : t === "huggingface"
                      ? "bg-[rgba(168,129,31,0.15)] text-[var(--sim-gold-deep)]"
                      : "bg-[rgba(168,129,31,0.12)] text-[var(--sim-gold-deep)]";
                return (
                  <a
                    key={i}
                    href={l.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2.5 rounded-xl border border-[var(--sim-line)] bg-white/30 p-2.5 text-[0.84rem] font-semibold text-[var(--sim-lapis)] transition-all hover:-translate-x-0.5 hover:border-[var(--sim-gold)] hover:bg-white/55"
                  >
                    <span
                      className={`grid h-6 w-9 flex-none place-items-center rounded-md text-[0.62rem] font-bold ${cls}`}
                    >
                      {linkTypeLabel(t)}
                    </span>
                    <span
                      className="min-w-0 flex-1 truncate text-[0.78rem] text-[#54452b]"
                      dir="ltr"
                    >
                      {l.url}
                    </span>
                    <IconArrow className="h-3.5 w-3.5 flex-none text-[var(--sim-gold-deep)]" />
                  </a>
                );
              })}
            </div>
          </section>
        )}

        {/* آمار */}
        <section className="grid grid-cols-3 gap-2">
          <div className="rounded-xl border border-[var(--sim-line)] bg-white/30 p-2.5 text-center">
            <b className="block text-[1.2rem] font-light leading-tight text-[var(--sim-lapis)]">
              {fa(dl)}
            </b>
            <small className="text-[0.66rem] font-semibold text-[#54452b]">
              دانلود
            </small>
          </div>
          <div className="rounded-xl border border-[var(--sim-line)] bg-white/30 p-2.5 text-center">
            <b className="block text-[1.2rem] font-light leading-tight text-[var(--sim-lapis)]">
              {fa(links.length)}
            </b>
            <small className="text-[0.66rem] font-semibold text-[#54452b]">
              لینک
            </small>
          </div>
          <div className="rounded-xl border border-[var(--sim-line)] bg-white/30 p-2.5 text-center">
            <b className="block text-[1.2rem] font-light leading-tight text-[var(--sim-lapis)]">
              {fa((item.tags || []).length)}
            </b>
            <small className="text-[0.66rem] font-semibold text-[#54452b]">
              تگ
            </small>
          </div>
        </section>
      </div>
    </div>
  );
}
