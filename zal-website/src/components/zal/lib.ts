export type LinkType = "huggingface" | "github" | "website";

export interface ItemLink {
  type: LinkType;
  url: string;
}

export interface Item {
  name: string;
  kind: "model" | "dataset";
  links: ItemLink[];
  author: string;
  date: string;
  downloads: number;
  tags: string[];
  desc: string;
}

/* مخزن گیت‌هاب پروژه — برای ثبت Issue درخواست‌ها و لینک فوتر */
export const GH_REPO = "AmiraliFirouzi/zal";
export const CONTACT_EMAIL = "heroesmihan@gmail.com";

/* اعداد فارسی */
const faNum = (n: number) => Number(n).toLocaleString("fa-IR");
let faCompact = faNum;
try {
  faCompact = (n: number) =>
    new Intl.NumberFormat("fa-IR", {
      notation: "compact",
      maximumFractionDigits: 1,
    }).format(n);
} catch {
  faCompact = faNum;
}
export const fa = faNum;
export const faC = faCompact;

/* تبدیل عدد به ارقام فارسی بدون جداکننده‌ی هزارگان */
const PERSIAN_DIGITS = "۰۱۲۳۴۵۶۷۸۹";
export function faPlain(n: number): string {
  return String(n).replace(/\d/g, (d) => PERSIAN_DIGITS[parseInt(d, 10)]);
}

/* سال شمسی جاری — بدون جداکننده */
export function faYear(date: Date = new Date()): string {
  try {
    const latinYear = new Intl.DateTimeFormat("en-US-u-ca-persian", {
      year: "numeric",
    }).format(date);
    return faPlain(parseInt(latinYear, 10));
  } catch {
    return "۱۴۰۵";
  }
}

/* تاریخ نسبی فارسی */
export function faRelative(dateStr: string): string {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  const now = Date.now();
  if (isNaN(d.getTime())) return "";
  const diff = Math.max(0, now - d.getTime());
  const day = 86400000;
  const days = Math.floor(diff / day);
  if (days < 1) return "امروز";
  if (days < 7) return fa(days) + " روز پیش";
  if (days < 30) return fa(Math.floor(days / 7)) + " هفته پیش";
  if (days < 365) return fa(Math.floor(days / 30)) + " ماه پیش";
  return fa(Math.floor(days / 365)) + " سال پیش";
}

export function faDate(dateStr: string): string {
  if (!dateStr) return "";
  try {
    return new Date(dateStr).toLocaleDateString("fa-IR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return "";
  }
}

/* تشخیص نوع لینک */
export function detectLinkType(url: string): LinkType {
  if (!url) return "website";
  if (/huggingface\.co/i.test(url)) return "huggingface";
  if (/github\.com/i.test(url)) return "github";
  return "website";
}

export function linkTypeLabel(t: string): string {
  return (
    ({ huggingface: "HF", github: "GH", website: "وب" } as Record<string, string>)[
      t
    ] || "وب"
  );
}

/* escape HTML */
export function escapeHtml(s: string): string {
  return String(s || "").replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[
      c
    ] as string)
  );
}

/* مارک‌داون سبک */
export function renderMarkdown(md: string): string {
  if (!md || !md.trim())
    return '<span style="color:#9a8862;font-style:italic">توضیحاتی ثبت نشده است.</span>';
  let html = escapeHtml(md);
  html = html.replace(/```([\s\S]*?)```/g, (_m, c) =>
    `<pre><code>${String(c).replace(/^\n/, "")}</code></pre>`
  );
  html = html.replace(/`([^`\n]+)`/g, "<code>$1</code>");
  html = html.replace(/^### (.+)$/gm, "<h3>$1</h3>");
  html = html.replace(/^## (.+)$/gm, "<h2>$1</h2>");
  html = html.replace(/^# (.+)$/gm, "<h1>$1</h1>");
  html = html.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  html = html.replace(/\*([^*\n]+)\*/g, "<em>$1</em>");
  html = html.replace(
    /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g,
    '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>'
  );
  html = html.replace(/^(\s*)[-*] (.+)$/gm, "$1<li>$2</li>");
  html = html.replace(/(<li>[\s\S]*?<\/li>)(?!\s*<li>)/g, "<ul>$1</ul>");
  html = html.replace(/^\d+\. (.+)$/gm, "<li>$1</li>");
  html = html.replace(/^&gt; (.+)$/gm, "<blockquote>$1</blockquote>");
  html = html
    .split(/\n\n+/)
    .map((block) => {
      if (/^\s*<(h\d|ul|ol|pre|blockquote)/.test(block)) return block;
      return block.trim() ? `<p>${block.replace(/\n/g, "<br>")}</p>` : "";
    })
    .join("");
  return html;
}

/* ستاره‌ها در localStorage — کلید مخصوص پروژه‌ی زال */
const STARS_KEY = "zal_stars_v1";

export function loadStars(): Record<string, boolean> {
  try {
    return JSON.parse(localStorage.getItem(STARS_KEY) || "{}");
  } catch {
    return {};
  }
}

export function saveStars(stars: Record<string, boolean>) {
  try {
    localStorage.setItem(STARS_KEY, JSON.stringify(stars));
  } catch {
    /* ignore */
  }
}

export function itemKey(it: { name: string; kind: string }): string {
  return it.name + "|" + it.kind;
}

/* اعضای تیم زال */
export interface TeamMember {
  name: string;
  role: string;
  bio: string;
  initials: string;
  github?: string;
  email?: string;
  linkedin?: string;
}

export const TEAM: TeamMember[] = [
  {
    name: "امیرعلی فیروزی",
    role: "بنیان‌گذار · دیتاساینتیست",
    bio: "پژوهشگر در حوزه‌ی دیتاساینس و مدل‌های زبانی. تمرکز بر توسعه‌ی هوش مصنوعی برای زبان فارسی و ساخت کامیونیتی متن‌باز زال.",
    initials: "ع.ف",
    github: "https://github.com/AmiraliFirouzi",
    email: "mailto:heroesmihan@gmail.com",
    linkedin: "https://www.linkedin.com/in/amirali-firouzi-2b714335a",
  },
];

/* ارزش‌های زال */
export const VALUES = [
  {
    title: "باز و رایگان",
    desc: "همه مدل‌ها و دیتاست‌ها با مجوز باز و در دسترس عموم.",
    icon: "open",
  },
  {
    title: "برای فارسی",
    desc: "ساخته‌شده ویژه زبان و فرهنگ فارسی، از فارسی‌زبانان.",
    icon: "persian",
  },
  {
    title: "توسعه‌ی مشارکتی",
    desc: "کامیونیتی‌محور؛ هرکس می‌تواند مشارکت کند و بهره ببرد.",
    icon: "community",
  },
  {
    title: "کیفیت نخست",
    desc: "تأکید بر مستندسازی، بازتولیدپذیری و استانداردهای پژوهشی.",
    icon: "quality",
  },
];
