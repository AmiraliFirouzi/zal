"use client";

import { memo } from "react";
import type { Item } from "./lib";
import { fa, faC, faRelative, itemKey } from "./lib";
import {
  IconModel,
  IconDataset,
  IconDownload,
  IconTag,
  IconStar,
} from "./icons";

interface Props {
  item: Item;
  index: number;
  starred: boolean;
  onOpen: (item: Item) => void;
  onToggleStar: (key: string) => void;
}

function ItemCardBase({ item, index, starred, onOpen, onToggleStar }: Props) {
  const isDs = item.kind === "dataset";
  const Icon = isDs ? IconDataset : IconModel;
  const badge = isDs ? "دیتاست" : "مدل";
  const dl = item.downloads || 0;
  const dlStr = dl > 999 ? faC(dl) : fa(dl);
  const date = faRelative(item.date);
  const key = itemKey(item);

  return (
    <article
      onClick={() => onOpen(item)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onOpen(item);
        }
      }}
      tabIndex={0}
      role="button"
      aria-label={`مشاهده ${item.name}`}
      className="sim-glass sim-feed-in group relative cursor-pointer overflow-hidden rounded-2xl p-5 outline-none transition-all duration-300 hover:-translate-y-1.5 hover:border-[rgba(168,129,31,0.45)] hover:shadow-[0_24px_56px_-16px_rgba(35,26,8,0.45)] focus-visible:ring-2 focus-visible:ring-[var(--sim-gold)]"
      style={{ animationDelay: `${Math.min(index * 0.04, 0.5)}s` }}
    >
      {/* نوار طلایی بالایی که هنگام هاور ظاهر می‌شود */}
      <span className="pointer-events-none absolute inset-x-0 top-0 h-[3px] origin-center scale-x-0 bg-[linear-gradient(90deg,transparent,var(--sim-gold),var(--sim-gold-2),var(--sim-gold),transparent)] transition-transform duration-500 group-hover:scale-x-100" />
      {/* هاله طلایی نرم هنگام هاور */}
      <span className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" style={{ background: "radial-gradient(circle at top, rgba(168,129,31,0.08), transparent 70%)" }} />
      {/* ستاره */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onToggleStar(key);
        }}
        aria-label={starred ? "حذف از علاقه‌مندی" : "افزودن به علاقه‌مندی"}
        title={starred ? "حذف از علاقه‌مندی" : "افزودن به علاقه‌مندی"}
        className={`absolute left-3 top-3 grid h-10 w-10 place-items-center rounded-lg border transition-all duration-200 hover:scale-110 ${
          starred
            ? "border-[rgba(201,138,42,0.4)] bg-[rgba(201,138,42,0.18)] text-[var(--sim-star)]"
            : "border-[var(--sim-line)] bg-white/30 text-[var(--sim-star)] opacity-60 hover:opacity-100"
        }`}
      >
        <IconStar
          className="h-[18px] w-[18px]"
          style={starred ? { fill: "currentColor" } : { fill: "none" }}
        />
      </button>

      {/* آیکن + نوع */}
      <div className="mb-3 flex items-center gap-3 pl-12">
        <div
          className={`grid h-12 w-12 flex-none place-items-center rounded-xl border transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3 ${
            isDs
              ? "border-[rgba(21,42,92,0.25)] bg-[linear-gradient(135deg,rgba(21,42,92,0.18),rgba(21,42,92,0.05))] text-[var(--sim-lapis)]"
              : "border-[rgba(168,129,31,0.25)] bg-[linear-gradient(135deg,rgba(168,129,31,0.2),rgba(168,129,31,0.06))] text-[var(--sim-gold-deep)]"
          }`}
        >
          <Icon className="h-6 w-6" />
        </div>
        <span className={`sim-badge ${isDs ? "sim-badge-dataset" : ""}`}>
          {badge}
        </span>
      </div>

      {/* نام */}
      <h3
        className="mb-2 truncate text-[1.05rem] font-bold leading-relaxed text-[var(--sim-lapis)] transition-colors group-hover:text-[var(--sim-gold-deep)]"
        title={item.name}
        dir="ltr"
      >
        {item.name}
      </h3>

      {/* توضیح کوتاه */}
      {item.desc && (
        <p className="mb-3 line-clamp-2 text-[0.82rem] leading-relaxed text-[#5a4d33]">
          {item.desc
            .replace(/[#*`>\-]/g, "")
            .replace(/\n+/g, " ")
            .trim()
            .slice(0, 120)}
        </p>
      )}

      {/* متا */}
      <div className="mb-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-[0.72rem] text-[#6a5a3d]">
        {date && <span>{date}</span>}
        {item.author && (
          <>
            <span className="h-1 w-1 rounded-full bg-[rgba(168,129,31,0.4)]" />
            <span className="truncate" title={item.author}>
              {item.author}
            </span>
          </>
        )}
      </div>

      {/* تگ‌ها */}
      {item.tags && item.tags.length > 0 && (
        <div className="mb-3 flex flex-wrap gap-1.5">
          {item.tags.slice(0, 3).map((t) => (
            <span key={t} className="sim-tag">
              <IconTag className="h-2.5 w-2.5 opacity-70" />
              {t}
            </span>
          ))}
        </div>
      )}

      {/* فوتر کارت */}
      <div className="flex items-center justify-between border-t border-[var(--sim-line)] pt-3">
        {dl > 0 ? (
          <span className="flex items-center gap-1.5 text-[0.76rem] font-semibold text-[#54452b]">
            <IconDownload className="h-3.5 w-3.5 text-[var(--sim-gold-deep)]" />
            {dlStr} دانلود
          </span>
        ) : (
          <span className="text-[0.72rem] text-[#9a8862]">تازه ثبت‌شده</span>
        )}
        <span className="text-[0.72rem] font-semibold text-[var(--sim-gold-deep)] opacity-0 transition-opacity group-hover:opacity-100">
          مشاهده ←
        </span>
      </div>
    </article>
  );
}

export const ItemCard = memo(ItemCardBase);
