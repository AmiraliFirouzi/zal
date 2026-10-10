"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ItemCard } from "@/components/zal/ItemCard";
import { DetailModal } from "@/components/zal/DetailModal";
import { SubmitModal } from "@/components/zal/SubmitModal";
import { AboutSection } from "@/components/zal/AboutSection";
import { Reveal } from "@/components/zal/Reveal";
import {
  IconGithub,
  IconMail,
  IconPlus,
  IconSearch,
  IconCheck,
  IconClose,
  IconSort,
  IconSparkle,
  IconArrowLeft,
} from "@/components/zal/icons";
import {
  type Item,
  fa,
  faYear,
  loadStars,
  saveStars,
  itemKey,
  GH_REPO,
  CONTACT_EMAIL,
} from "@/components/zal/lib";
import itemsData from "@/data/items.json";

type Filter = "all" | "model" | "dataset" | "starred";
type Sort = "newest" | "popular" | "name";

export default function Home() {
  // داده‌ها مستقیماً از JSON ایمپورت می‌شوند — برای خروجی استاتیک روی GitHub Pages
  // در صورت افزودن مورد جدید، کافیست src/data/items.json را ویرایش و build بگیرید.
  const [items, setItems] = useState<Item[]>(() =>
    (itemsData as Item[])
      .map((it: Item) => ({
        name: it.name || "بدون‌نام",
        kind: (it.kind === "dataset" ? "dataset" : "model") as Item["kind"],
        links: Array.isArray(it.links) ? it.links : [],
        author: it.author || "",
        date: it.date || "",
        downloads: it.downloads || 0,
        tags: Array.isArray(it.tags) ? it.tags : [],
        desc: it.desc || "",
      }))
      .sort((a: Item, b: Item) => (b.date || "").localeCompare(a.date || ""))
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [filter, setFilter] = useState<Filter>("all");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<Sort>("newest");
  const [stars, setStars] = useState<Record<string, boolean>>({});
  const [selected, setSelected] = useState<Item | null>(null);
  const [submitOpen, setSubmitOpen] = useState(false);
  const [toast, setToast] = useState<{
    msg: string;
    type: "success" | "error";
    id: number;
  } | null>(null);
  const [sortOpen, setSortOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  /* ستاره‌ها */
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setStars(loadStars());
  }, []);

  /* گوش‌دادن به رویداد باز کردن مودال ثبت از سایر بخش‌ها */
  useEffect(() => {
    const handler = () => setSubmitOpen(true);
    window.addEventListener("zal-open-submit", handler);
    return () => window.removeEventListener("zal-open-submit", handler);
  }, []);

  const showToast = useCallback(
    (msg: string, type: "success" | "error" = "success") => {
      setToast({ msg, type, id: Date.now() });
    },
    []
  );

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3500);
    return () => clearTimeout(t);
  }, [toast]);

  const toggleStar = useCallback(
    (key: string) => {
      setStars((prev) => {
        const next = { ...prev };
        if (next[key]) delete next[key];
        else next[key] = true;
        saveStars(next);
        return next;
      });
    },
    []
  );

  /* فیلتر + جستجو + مرتب‌سازی */
  const filtered = useMemo(() => {
    let list = items.slice();
    if (filter === "starred") {
      list = list.filter((it) => stars[itemKey(it)]);
    } else if (filter !== "all") {
      list = list.filter((it) => it.kind === filter);
    }
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (it) =>
          it.name.toLowerCase().includes(q) ||
          it.author.toLowerCase().includes(q) ||
          it.tags.some((t) => t.toLowerCase().includes(q))
      );
    }
    if (sort === "popular") {
      list.sort((a, b) => (b.downloads || 0) - (a.downloads || 0));
    } else if (sort === "name") {
      list.sort((a, b) => a.name.localeCompare(b.name));
    } else {
      list.sort((a, b) => (b.date || "").localeCompare(a.date || ""));
    }
    return list;
  }, [items, filter, search, sort, stars]);

  // Reset page when filter/search/sort change by hooking directly into their state changes
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCurrentPage(1);
  }, [filter, search, sort]);

  const ITEMS_PER_PAGE = 8;
  const totalPages = Math.ceil((filtered.length + 1) / ITEMS_PER_PAGE); // +1 for the Add Item card

  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    return filtered.slice(start, end);
  }, [filtered, currentPage]);

  const counts = useMemo(
    () => ({
      all: items.length,
      model: items.filter((i) => i.kind === "model").length,
      dataset: items.filter((i) => i.kind === "dataset").length,
      starred: Object.keys(stars).length,
    }),
    [items, stars]
  );

  const totalDownloads = useMemo(
    () => items.reduce((s, i) => s + (i.downloads || 0), 0),
    [items]
  );

  /* ذرات طلایی (canvas) */
  const dustRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return;
    const c = dustRef.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let W = 0,
      H = 0;
    const ps: { x: number; y: number; r: number; s: number; o: number; d: number }[] = [];
    const rs = () => {
      W = window.innerWidth;
      H = window.innerHeight;
      c.width = W * dpr;
      c.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    rs();
    window.addEventListener("resize", rs);
    for (let i = 0; i < 26; i++)
      ps.push({
        x: Math.random() * W,
        y: Math.random() * H,
        r: Math.random() * 1.8 + 0.5,
        s: Math.random() * 0.3 + 0.06,
        o: Math.random() * 0.35 + 0.08,
        d: Math.random() * 6.28,
      });
    let raf = 0;
    const loop = () => {
      ctx.clearRect(0, 0, W, H);
      for (const p of ps) {
        p.y -= p.s;
        p.d += 0.008;
        p.x += Math.sin(p.d) * 0.15;
        if (p.y < -8) {
          p.y = H + 8;
          p.x = Math.random() * W;
        }
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(196,156,64,${p.o})`;
        ctx.fill();
      }
      raf = requestAnimationFrame(loop);
    };
    loop();
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", rs);
    };
  }, []);

  const ghUrl = `https://github.com/${GH_REPO}`;

  const tabs: { key: Filter; label: string; count: number }[] = [
    { key: "all", label: "همه", count: counts.all },
    { key: "model", label: "مدل‌ها", count: counts.model },
    { key: "dataset", label: "دیتاست‌ها", count: counts.dataset },
    { key: "starred", label: "★ علاقه‌مندی", count: counts.starred },
  ];

  const sortLabel =
    sort === "popular"
      ? "محبوب‌ترین"
      : sort === "name"
        ? "نام (الفبا)"
        : "جدیدترین";

  return (
    <div
      className="sim-font relative flex min-h-screen flex-col"
      style={{ background: "#e9d9b4" }}
    >
      {/* ═══ پس‌زمینه ═══ */}
      <div
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          backgroundImage: `url('${process.env.NEXT_PUBLIC_BASE_PATH || ""}/simorgh-bg.png')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: 0.5,
        }}
        aria-hidden
      />
      <div
        className="pointer-events-none fixed inset-0 z-[1]"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 55%, rgba(48,36,14,0.32))",
        }}
        aria-hidden
      />
      <canvas
        ref={dustRef}
        className="pointer-events-none fixed inset-0 z-[2]"
        aria-hidden
      />
      <div
        className="pointer-events-none fixed inset-0 z-[3] opacity-[0.05]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2'/%3E%3C/filter%3E%3Crect width='160' height='160' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
        aria-hidden
      />
      <div className="sim-corners" aria-hidden>
        <i />
        <i />
        <i />
        <i />
      </div>

      {/* ═══ هدر استیکی (ثابت، بدون انیمیشن اسکرول) ═══ */}
      <header className="sticky top-0 z-50 px-3 pt-3 sm:px-5">
        <nav className="sim-glass-bar sim-header-scrolled mx-auto flex max-w-[1280px] items-center justify-between gap-3 rounded-2xl px-4 py-2.5 sm:px-6">
          {/* برند */}
          <a
            href="#top"
            className="flex items-center gap-2.5"
            aria-label="زال — خانه"
          >
            <span className="sim-nasta text-[1.3rem] font-bold leading-[1.9] text-[var(--sim-lapis)]">
              زال
            </span>
          </a>

          {/* لینک‌های ناوبری */}
          <div className="hidden items-center gap-1 md:flex">
            <a
              href="#models"
              className="rounded-full px-3 py-2 text-[0.84rem] font-semibold text-[#2e3a5f] transition-colors hover:bg-white/40 hover:text-[var(--sim-gold-deep)]"
            >
              مدل‌ها و دیتاست‌ها
            </a>
            <a
              href="#about"
              className="rounded-full px-3 py-2 text-[0.84rem] font-semibold text-[#2e3a5f] transition-colors hover:bg-white/40 hover:text-[var(--sim-gold-deep)]"
            >
              درباره ما
            </a>
            <a
              href="#team"
              className="rounded-full px-3 py-2 text-[0.84rem] font-semibold text-[#2e3a5f] transition-colors hover:bg-white/40 hover:text-[var(--sim-gold-deep)]"
            >
              تیم
            </a>
          </div>
        </nav>
      </header>

      {/* ═══ محتوای اصلی ═══ */}
      <main
        id="top"
        className="relative z-10 mx-auto w-full max-w-[1280px] flex-1 px-3 sm:px-5"
      >
        {/* ─── هیرو ─── */}
        <section className="flex flex-col items-center px-2 pb-6 pt-10 text-center sm:pt-14">
          <p
            className="sim-latin sim-up sim-d1 mb-3 text-[0.74rem] font-semibold uppercase tracking-[0.5em] text-[var(--sim-gold-deep)]"
            style={{ direction: "ltr", textIndent: "0.5em" }}
          >
            Zal · Persian AI
          </p>
          <h1
            className="sim-nasta sim-up sim-d2 sim-gold-text overflow-visible pb-3 text-[clamp(2.6rem,7vw,4.5rem)] font-bold leading-[2]"
            style={{ paddingTop: "0.15em" }}
          >
            زال
          </h1>
          <p className="sim-halo sim-up sim-d3 mt-1 max-w-[580px] text-[clamp(0.92rem,1.6vw,1.05rem)] leading-[2] text-[#3a3122]">
            کامیونیتی مدل‌ها و دیتاست‌های باز برای زبان فارسی — همان‌گونه که
            نگارگران ایرانی قرن‌ها دانش را بر کاغذ نگاه داشتند، ما زبان فارسی
            را به دنیای هوش مصنوعی می‌آوریم.
          </p>

          {/* خط تزئینی */}
          <div className="sim-up sim-d3 mt-5 flex items-center gap-3 text-[var(--sim-gold)]">
            <span className="block h-px w-16 bg-[linear-gradient(90deg,transparent,rgba(168,129,31,0.7))]" />
            <span className="sim-float text-[0.7rem]">❖</span>
            <span className="block h-px w-16 bg-[linear-gradient(90deg,rgba(168,129,31,0.7),transparent)]" />
          </div>

          {/* آمار */}
          <div className="sim-up sim-d4 mt-7 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 sm:gap-x-10">
            <Stat value={counts.model} label="مدل زبانی" />
            <span className="hidden h-8 w-px bg-[var(--sim-line)] sm:block" />
            <Stat value={counts.dataset} label="دیتاست" />
            <span className="hidden h-8 w-px bg-[var(--sim-line)] sm:block" />
            <Stat value={totalDownloads} label="دانلود کل" />
          </div>

          {/* دکمه‌های هیرو */}
          <div className="sim-up sim-d5 mt-8 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => setSubmitOpen(true)}
              className="sim-btn sim-btn-primary"
            >
              <IconPlus className="h-4 w-4" />
              ثبت مدل یا دیتاست
            </button>
            <a href="#about" className="sim-btn sim-btn-ghost">
              <IconSparkle className="h-4 w-4" />
              درباره زال
            </a>
          </div>
        </section>

        {/* ─── نوار فیلتر ─── */}
        <section
          id="models"
          className="scroll-mt-32 pb-6"
          aria-label="فیلتر مدل‌ها و دیتاست‌ها"
        >
          <Reveal variant="up">
          <div className="sim-glass mb-5 flex flex-col gap-3 rounded-2xl px-4 py-3.5 lg:flex-row lg:items-center lg:justify-between">
            {/* تب‌ها */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="sim-latin hidden text-[0.64rem] font-semibold uppercase tracking-[0.22em] text-[var(--sim-gold-deep)] sm:inline">
                Latest
              </span>
              {tabs.map((t) => (
                <button
                  key={t.key}
                  onClick={() => setFilter(t.key)}
                  className={`sim-tab ${filter === t.key ? "sim-tab-active" : ""}`}
                  aria-pressed={filter === t.key}
                >
                  {t.label}
                  <span className="sim-tab-count">{fa(t.count)}</span>
                </button>
              ))}
            </div>

            {/* جستجو + مرتب‌سازی */}
            <div className="flex items-center gap-2">
              <div className="sim-search">
                <IconSearch />
                <input
                  type="search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="جستجو در مدل‌ها و دیتاست‌ها..."
                  aria-label="جستجو"
                />
              </div>
              <div className="relative">
                <button
                  onClick={() => setSortOpen((o) => !o)}
                  onBlur={() => setTimeout(() => setSortOpen(false), 150)}
                  className="inline-flex items-center gap-1.5 rounded-full border border-[var(--sim-line)] bg-white/55 px-3 py-[0.45rem] text-[0.78rem] font-semibold text-[#54452b] transition-all hover:bg-white/85"
                  aria-label="مرتب‌سازی"
                >
                  <IconSort className="h-3.5 w-3.5 text-[var(--sim-gold-deep)]" />
                  <span className="hidden sm:inline">{sortLabel}</span>
                </button>
                {sortOpen && (
                  <div className="sim-glass absolute left-0 top-[110%] z-50 min-w-[160px] rounded-xl p-1">
                    {(
                      [
                        ["newest", "جدیدترین"],
                        ["popular", "محبوب‌ترین"],
                        ["name", "نام (الفبا)"],
                      ] as [Sort, string][]
                    ).map(([k, l]) => (
                      <button
                        key={k}
                        onClick={() => {
                          setSort(k);
                          setSortOpen(false);
                        }}
                        className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-[0.8rem] font-semibold transition-colors ${
                          sort === k
                            ? "bg-[rgba(168,129,31,0.18)] text-[var(--sim-lapis)]"
                            : "text-[#54452b] hover:bg-white/60"
                        }`}
                      >
                        {l}
                        {sort === k && (
                          <IconCheck className="h-3.5 w-3.5 text-[var(--sim-gold-deep)]" />
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
          </Reveal>

          {/* شمارش نتایج */}
          <div className="mb-4 flex items-center justify-between px-1 text-[0.8rem] text-[#54452b]">
            <span>
              <b className="text-[var(--sim-lapis)]">{fa(filtered.length)}</b>{" "}
              مورد نمایش داده شده
            </span>
            {search && (
              <button
                onClick={() => setSearch("")}
                className="inline-flex items-center gap-1 text-[0.76rem] font-semibold text-[var(--sim-gold-deep)] hover:text-[var(--sim-lapis)]"
              >
                <IconClose className="h-3 w-3" />
                پاک کردن جستجو
              </button>
            )}
          </div>

          {/* حالت‌ها */}
          {loading ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="sim-glass rounded-2xl p-5"
                  style={{
                    background:
                      "linear-gradient(90deg, rgba(168,129,31,0.06), rgba(168,129,31,0.14), rgba(168,129,31,0.06))",
                    backgroundSize: "200% 100%",
                    animation: "shimmer 1.4s infinite",
                  }}
                >
                  <div className="mb-3 h-12 w-12 rounded-xl bg-white/30" />
                  <div className="mb-2 h-5 w-3/4 rounded bg-white/30" />
                  <div className="mb-3 h-3 w-full rounded bg-white/20" />
                  <div className="mb-3 h-3 w-2/3 rounded bg-white/20" />
                  <div className="h-8 w-full rounded bg-white/20" />
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="sim-glass rounded-2xl p-12 text-center">
              <span className="mb-3 block text-3xl text-[var(--sim-gold)] opacity-50">
                ❖
              </span>
              <p className="text-[0.95rem] font-semibold text-[#54452b]">
                بارگذاری فید ناموفق بود.
              </p>
              <p className="mt-1 text-[0.8rem] text-[#7a6845]">
                لطفاً بعداً دوباره تلاش کنید.
              </p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="sim-glass rounded-2xl p-12 text-center">
              <span className="mb-3 block text-3xl text-[var(--sim-gold)] opacity-50">
                ❖
              </span>
              <p className="text-[0.95rem] font-semibold text-[#54452b]">
                {filter === "starred"
                  ? "هنوز به هیچ موردی ستاره نداده‌اید."
                  : search
                    ? "نتیجه‌ای یافت نشد."
                    : "در این دسته موردی وجود ندارد."}
              </p>
              {filter === "starred" && (
                <p className="mt-1 text-[0.8rem] text-[#7a6845]">
                  با کلیک روی ستاره کنار هر مورد، آن را به علاقه‌مندی‌های خود
                  اضافه کنید.
                </p>
              )}
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              <div
                key={`${filter}-${search}-${sort}-${currentPage}`}
                className="sim-swap grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
              >
                {paginatedItems.map((it, i) => (
                  <ItemCard
                    key={itemKey(it)}
                    item={it}
                    index={i}
                    starred={!!stars[itemKey(it)]}
                    onOpen={setSelected}
                    onToggleStar={(k) => {
                      const wasOn = !!stars[k];
                      toggleStar(k);
                      showToast(
                        wasOn
                          ? "از علاقه‌مندی‌ها حذف شد"
                          : "به علاقه‌مندی‌ها اضافه شد ★"
                      );
                    }}
                  />
                ))}
                {/* کارت دعوت — ثبت مدل/دیتاست جدید (فقط در صفحه آخر) */}
                {currentPage === totalPages && (
                  <button
                    onClick={() => setSubmitOpen(true)}
                    className="sim-glass sim-feed-in group flex min-h-[200px] flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-[rgba(168,129,31,0.4)] p-5 text-center transition-all duration-300 hover:-translate-y-1 hover:border-[var(--sim-gold)] hover:shadow-[0_20px_50px_-15px_rgba(168,129,31,0.35)]"
                    style={{
                      animationDelay: `${Math.min(paginatedItems.length * 0.04, 0.5)}s`,
                    }}
                  >
                    <div className="grid h-14 w-14 place-items-center rounded-2xl border border-[rgba(168,129,31,0.3)] bg-[linear-gradient(135deg,rgba(168,129,31,0.2),rgba(227,200,118,0.25))] text-[var(--sim-gold-deep)] transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
                      <IconPlus className="h-7 w-7" />
                    </div>
                    <h3 className="sim-nasta text-[1.1rem] font-bold text-[var(--sim-lapis)]">
                      مدل یا دیتاست خود را اضافه کنید
                    </h3>
                    <p className="text-[0.78rem] leading-relaxed text-[#54452b]">
                      درخواست شما بررسی و به فید عمومی زال افزوده می‌شود
                    </p>
                    <span className="mt-1 inline-flex items-center gap-1 text-[0.76rem] font-semibold text-[var(--sim-gold-deep)] transition-colors group-hover:text-[var(--sim-lapis)]">
                      شروع ثبت درخواست ←
                    </span>
                  </button>
                )}
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 pt-4">
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="sim-glass flex h-10 w-10 items-center justify-center rounded-xl text-[var(--sim-lapis)] transition-all hover:bg-[rgba(168,129,31,0.1)] hover:text-[var(--sim-gold-deep)] disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-[var(--sim-lapis)]"
                  >
                    <IconArrowLeft className="h-5 w-5 rotate-180" />
                  </button>
                  <div className="flex items-center gap-1.5">
                    {Array.from({ length: totalPages }).map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setCurrentPage(i + 1)}
                        className={`flex h-10 min-w-[2.5rem] items-center justify-center rounded-xl px-3 text-[0.9rem] font-bold transition-all ${
                          currentPage === i + 1
                            ? "bg-[linear-gradient(135deg,var(--sim-gold),var(--sim-gold-2))] text-white shadow-[0_4px_12px_-4px_rgba(168,129,31,0.5)]"
                            : "sim-glass text-[#54452b] hover:bg-[rgba(168,129,31,0.1)] hover:text-[var(--sim-gold-deep)]"
                        }`}
                      >
                        {fa(i + 1)}
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="sim-glass flex h-10 w-10 items-center justify-center rounded-xl text-[var(--sim-lapis)] transition-all hover:bg-[rgba(168,129,31,0.1)] hover:text-[var(--sim-gold-deep)] disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-[var(--sim-lapis)]"
                  >
                    <IconArrowLeft className="h-5 w-5" />
                  </button>
                </div>
              )}
            </div>
          )}
        </section>

        {/* ─── درباره ما + تیم ─── */}
        <AboutSection />
      </main>

      {/* ═══ فوتر (استیکی پایین) ═══ */}
      <footer className="relative z-10 mt-auto border-t border-[var(--sim-line)] bg-[rgba(233,217,180,0.6)] backdrop-blur-sm">
        <div className="mx-auto flex max-w-[1280px] flex-col items-center justify-between gap-3 px-5 py-5 text-center sm:flex-row sm:text-right">
          <div className="flex items-center gap-2">
            <span className="sim-nasta text-[1rem] font-bold text-[var(--sim-lapis)]">
              زال
            </span>
            <span className="sim-halo text-[0.78rem] text-[#4a3d24]">
              © {faYear()} — هوش مصنوعی برای زبان فارسی
            </span>
          </div>
          <div className="flex items-center gap-2.5">
            <span className="text-[0.74rem] text-[#5a4d33]">
              ساخته‌شده با ❤️ برای کامیونیتی فارسی
            </span>
            <a
              href={ghUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="گیت‌هاب"
              className="sim-glass grid h-9 w-9 place-items-center rounded-full text-[var(--sim-lapis)] transition-all hover:-translate-y-0.5 hover:text-[var(--sim-gold-deep)]"
            >
              <IconGithub className="h-4 w-4" />
            </a>
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              aria-label="ایمیل"
              className="sim-glass grid h-9 w-9 place-items-center rounded-full text-[var(--sim-lapis)] transition-all hover:-translate-y-0.5 hover:text-[var(--sim-gold-deep)]"
            >
              <IconMail className="h-4 w-4" />
            </a>
          </div>
        </div>
      </footer>

      {/* ═══ مودال‌ها ═══ */}
      <DetailModal
        item={selected}
        starred={selected ? !!stars[itemKey(selected)] : false}
        onClose={() => setSelected(null)}
        onToggleStar={(k) => {
          const wasOn = !!stars[k];
          toggleStar(k);
          showToast(
            wasOn
              ? "از علاقه‌مندی‌ها حذف شد"
              : "به علاقه‌مندی‌ها اضافه شد ★"
          );
        }}
      />
      <SubmitModal
        open={submitOpen}
        onClose={() => setSubmitOpen(false)}
        onToast={showToast}
      />

      {/* ═══ توست ═══ */}
      {toast && (
        <div
          key={toast.id}
          className={`sim-glass fixed bottom-6 left-1/2 z-[80] flex max-w-[90vw] translate-x-[-50%] items-center gap-2.5 rounded-2xl px-5 py-3 text-[0.88rem] font-semibold ${
            toast.type === "error" ? "text-[#a8401f]" : "text-[var(--sim-lapis)]"
          }`}
          style={{ animation: "sim-up 0.45s cubic-bezier(.22,1,.36,1) both" }}
          role="status"
        >
          {toast.type === "error" ? (
            <IconClose className="h-4 w-4 text-[#a8401f]" />
          ) : (
            <IconCheck className="h-4 w-4 text-[var(--sim-gold-deep)]" />
          )}
          <span>{toast.msg}</span>
        </div>
      )}

      <style>{`@keyframes shimmer{from{background-position:200% 0}to{background-position:-200% 0}}`}</style>
    </div>
  );
}

function Stat({ value, label }: { value: number; label: string }) {
  const v = useCountUp(value, 1400);
  return (
    <div className="flex flex-col items-center">
      <span className="sim-gold-text text-[1.8rem] font-bold leading-none tabular-nums">
        {label === "دانلود کل" ? faCShort(v) : fa(v)}
      </span>
      {/* لیبل‌های فارسی — استفاده از sim-font (Vazirmatn) برای یکپارچگی با بقیه‌ی سایت */}
      <span className="sim-font mt-1.5 text-[0.74rem] font-bold tracking-tight text-[var(--sim-gold-deep)]">
        {label}
      </span>
    </div>
  );
}

/** انیمیشن شمارش اعداد از ۰ تا مقدار هدف */
function useCountUp(target: number, duration = 1400) {
  const reduced =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const [val, setVal] = useState(() => (reduced ? target : 0));
  useEffect(() => {
    // وقتی target واقعی (غیرصفر) رسید، انیمیشون اجرا شود
    if (reduced || !target) return;
    let raf = 0;
    const t0 = performance.now();
    const tick = (t: number) => {
      const k = Math.min(1, (t - t0) / duration);
      const e = 1 - Math.pow(1 - k, 3);
      setVal(Math.round(target * e));
      if (k < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration, reduced]);
  return val;
}

function faCShort(n: number): string {
  if (n >= 1000) {
    return new Intl.NumberFormat("fa-IR", {
      notation: "compact",
      maximumFractionDigits: 1,
    }).format(n);
  }
  return fa(n);
}
