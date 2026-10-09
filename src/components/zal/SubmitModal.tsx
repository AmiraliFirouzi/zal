"use client";

import { useEffect, useRef, useState } from "react";
import {
  fa,
  linkTypeLabel,
  GH_REPO,
  type ItemLink,
  type LinkType,
} from "./lib";
import {
  IconClose,
  IconPlus,
  IconSend,
  IconModel,
  IconDataset,
} from "./icons";

interface Props {
  open: boolean;
  onClose: () => void;
  onToast: (msg: string, type?: "success" | "error") => void;
}

interface LinkRow {
  id: number;
  type: LinkType;
  url: string;
}

let linkIdCounter = 1;

export function SubmitModal({ open, onClose, onToast }: Props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [type, setType] = useState<"model" | "dataset">("model");
  const [modelName, setModelName] = useState("");
  const [tags, setTags] = useState("");
  const [desc, setDesc] = useState("");
  const [links, setLinks] = useState<LinkRow[]>([
    { id: linkIdCounter, type: "huggingface", url: "" },
  ]);
  const [mdTab, setMdTab] = useState<"write" | "preview">("write");
  const [loading, setLoading] = useState(false);
  const [invalid, setInvalid] = useState<Record<string, boolean>>({});
  const nameRef = useRef<HTMLInputElement>(null);
  const descRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      const t = setTimeout(() => nameRef.current?.focus(), 350);
      const onKey = (e: KeyboardEvent) => {
        if (e.key === "Escape") onClose();
      };
      document.addEventListener("keydown", onKey);
      return () => {
        document.body.style.overflow = "";
        clearTimeout(t);
        document.removeEventListener("keydown", onKey);
      };
    }
  }, [open, onClose]);

  if (!open) return null;

  const addLink = () =>
    setLinks((l) => [
      ...l,
      { id: ++linkIdCounter, type: "huggingface", url: "" },
    ]);

  const removeLink = (id: number) => {
    if (links.length > 1) {
      setLinks((l) => l.filter((r) => r.id !== id));
    } else {
      onToast("حداقل یک لینک لازم است", "error");
    }
  };

  const updateLink = (id: number, field: "type" | "url", value: string) =>
    setLinks((l) =>
      l.map((r) => (r.id === id ? { ...r, [field]: value } : r))
    );

  const wrapSelection = (before: string, after = "") => {
    const ta = descRef.current;
    if (!ta) return;
    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    const text = desc;
    const sel = text.slice(start, end) || "";
    const next = text.slice(0, start) + before + sel + after + text.slice(end);
    setDesc(next);
    requestAnimationFrame(() => {
      ta.focus();
      ta.setSelectionRange(start + before.length, start + before.length + sel.length);
    });
  };

  const insertLine = (prefix: string) => {
    const ta = descRef.current;
    if (!ta) return;
    const start = ta.selectionStart;
    const text = desc;
    const lineStart = text.lastIndexOf("\n", start - 1) + 1;
    const next = text.slice(0, lineStart) + prefix + text.slice(lineStart);
    setDesc(next);
    requestAnimationFrame(() => {
      ta.focus();
      ta.setSelectionRange(start + prefix.length, start + prefix.length);
    });
  };

  const reset = () => {
    setName("");
    setEmail("");
    setType("model");
    setModelName("");
    setTags("");
    setDesc("");
    setLinks([{ id: ++linkIdCounter, type: "huggingface", url: "" }]);
    setMdTab("write");
    setInvalid({});
  };

  const validate = () => {
    const inv: Record<string, boolean> = {};
    if (!name.trim()) inv.name = true;
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      inv.email = true;
    if (!modelName.trim()) inv.modelName = true;
    const validLinks = links.filter((l) => l.url.trim());
    if (validLinks.length === 0) inv.links = true;
    else
      validLinks.forEach((l) => {
        try {
          new URL(l.url.trim());
        } catch {
          inv.links = true;
        }
      });
    setInvalid(inv);
    return Object.keys(inv).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      onToast("لطفاً فیلدهای مورد نیاز را اصلاح کنید.", "error");
      return;
    }

    setLoading(true);
    const validLinks: ItemLink[] = links
      .filter((l) => l.url.trim())
      .map((l) => ({ type: l.type, url: l.url.trim() }));

    const typeLabel = type === "dataset" ? "دیتاست" : "مدل";
    const title = `[${typeLabel}] ${modelName}`;
    const tagsArr = tags
      ? tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean)
      : [];

    const snippet = {
      name: modelName,
      kind: type,
      links: validLinks,
      author: name,
      date: new Date().toISOString().slice(0, 10),
      downloads: 0,
      tags: tagsArr,
      desc,
    };
    const snippetJson = JSON.stringify(snippet, null, 2);
    const linksTable = validLinks
      .map((l) => `| ${linkTypeLabel(l.type)} | ${l.url} |`)
      .join("\n");

    const body = `## درخواست افزودن ${typeLabel}

| فیلد | مقدار |
|------|-------|
| **نوع** | ${typeLabel} |
| **نام** | ${modelName} |
| **تاریخ ثبت** | ${new Date().toLocaleString("fa-IR")} |
${tagsArr.length ? `| **تگ‌ها** | ${tagsArr.join("، ")} |\n` : ""}
### لینک‌ها
| نوع | URL |
|-----|-----|
${linksTable}

### ثبت‌کننده
- **نام:** ${name}
- **ایمیل:** ${email}

### توضیحات
${desc || "_بدون توضیحات_"}

---

### 📋 برای ادمین — این بلاک را به \`data.json\` اضافه کنید

\`\`\`json
${snippetJson}
\`\`\`

---
_این درخواست به‌صورت خودکار از طریق صفحه زال ایجاد شده است._`;

    const issueUrl = `https://github.com/${GH_REPO}/issues/new?title=${encodeURIComponent(
      title
    )}&body=${encodeURIComponent(body)}`;

    await new Promise((r) => setTimeout(r, 700));
    setLoading(false);
    onClose();
    reset();
    onToast("درخواست شما ثبت شد — به گیت‌هاب منتقل می‌شوید...");
    setTimeout(
      () => window.open(issueUrl, "_blank", "noopener,noreferrer"),
      900
    );
  };

  return (
    <div
      className="sim-modal-overlay open"
      role="dialog"
      aria-modal="true"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="sim-modal sim-glass sim-scroll" style={{ maxWidth: 680 }}>
        <button
          onClick={onClose}
          aria-label="بستن"
          className="absolute left-4 top-4 z-10 grid h-9 w-9 place-items-center rounded-full border border-[var(--sim-line)] bg-white/40 text-[var(--sim-lapis)] transition-all hover:rotate-90 hover:border-[var(--sim-gold)] hover:bg-[rgba(168,129,31,0.18)]"
        >
          <IconClose className="h-4 w-4" />
        </button>

        <p className="sim-latin mb-1 text-center text-[0.68rem] font-semibold uppercase tracking-[0.42em] text-[var(--sim-gold-deep)]">
          Submit · Zal
        </p>
        <h2 className="sim-nasta mb-2 text-center text-[1.8rem] font-bold leading-relaxed text-[var(--sim-lapis)]">
          ثبت درخواست
        </h2>
        <p className="mx-auto mb-5 max-w-[400px] text-center text-[0.84rem] leading-loose text-[#54452b]">
          برای افزودن مدل یا دیتاست فارسی خود به مجموعه زال، فرم زیر را
          تکمیل کنید. درخواست شما بررسی شده و در صورت تأیید، در فید عمومی
          نمایش داده می‌شود.
        </p>

        <form onSubmit={handleSubmit} noValidate>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {/* نام */}
            <div className="flex flex-col gap-1.5">
              <label className="flex items-center gap-1.5 pr-0.5 text-[0.74rem] font-semibold text-[var(--sim-gold-deep)]">
                نام و نام خانوادگی{" "}
                <span className="text-[#a8401f]">*</span>
              </label>
              <input
                ref={nameRef}
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setInvalid((p) => ({ ...p, name: false }));
                }}
                placeholder="مثلاً: رضا محمودی"
                className={`sim-input ${invalid.name ? "!border-[#a8401f] !bg-[rgba(168,64,31,0.05)]" : ""}`}
              />
              {invalid.name && (
                <span className="text-[0.68rem] text-[#a8401f]">
                  لطفاً نام خود را وارد کنید.
                </span>
              )}
            </div>

            {/* ایمیل */}
            <div className="flex flex-col gap-1.5">
              <label className="flex items-center gap-1.5 pr-0.5 text-[0.74rem] font-semibold text-[var(--sim-gold-deep)]">
                ایمیل <span className="text-[#a8401f]">*</span>
              </label>
              <input
                type="email"
                dir="ltr"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setInvalid((p) => ({ ...p, email: false }));
                }}
                placeholder="you@example.com"
                className={`sim-input text-left ${invalid.email ? "!border-[#a8401f] !bg-[rgba(168,64,31,0.05)]" : ""}`}
              />
              {invalid.email && (
                <span className="text-[0.68rem] text-[#a8401f]">
                  ایمیل معتبر وارد کنید.
                </span>
              )}
            </div>
          </div>

          {/* نوع درخواست */}
          <div className="mt-3 flex flex-col gap-1.5">
            <label className="flex items-center gap-1.5 pr-0.5 text-[0.74rem] font-semibold text-[var(--sim-gold-deep)]">
              نوع درخواست <span className="text-[#a8401f]">*</span>
            </label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setType("model")}
                className={`flex flex-1 items-center justify-center gap-1.5 rounded-xl border p-2.5 text-[0.84rem] font-semibold transition-all ${
                  type === "model"
                    ? "border-[var(--sim-gold)] bg-[linear-gradient(135deg,rgba(168,129,31,0.22),rgba(168,129,31,0.08))] text-[var(--sim-lapis)] shadow-[0_6px_18px_-8px_rgba(168,129,31,0.45)]"
                    : "border-[var(--sim-line)] bg-white/40 text-[#54452b] hover:bg-white/60"
                }`}
              >
                <IconModel className="h-3.5 w-3.5 text-[var(--sim-gold-deep)]" />
                مدل زبانی
              </button>
              <button
                type="button"
                onClick={() => setType("dataset")}
                className={`flex flex-1 items-center justify-center gap-1.5 rounded-xl border p-2.5 text-[0.84rem] font-semibold transition-all ${
                  type === "dataset"
                    ? "border-[var(--sim-gold)] bg-[linear-gradient(135deg,rgba(168,129,31,0.22),rgba(168,129,31,0.08))] text-[var(--sim-lapis)] shadow-[0_6px_18px_-8px_rgba(168,129,31,0.45)]"
                    : "border-[var(--sim-line)] bg-white/40 text-[#54452b] hover:bg-white/60"
                }`}
              >
                <IconDataset className="h-3.5 w-3.5 text-[var(--sim-gold-deep)]" />
                دیتاست
              </button>
            </div>
          </div>

          {/* نام مدل */}
          <div className="mt-3 flex flex-col gap-1.5">
            <label className="flex items-center gap-1.5 pr-0.5 text-[0.74rem] font-semibold text-[var(--sim-gold-deep)]">
              نام مدل / دیتاست <span className="text-[#a8401f]">*</span>
            </label>
            <input
              type="text"
              dir="ltr"
              value={modelName}
              onChange={(e) => {
                setModelName(e.target.value);
                setInvalid((p) => ({ ...p, modelName: false }));
              }}
              placeholder="مثلاً: Zal-7B-Base"
              className={`sim-input text-left ${invalid.modelName ? "!border-[#a8401f] !bg-[rgba(168,64,31,0.05)]" : ""}`}
            />
            {invalid.modelName && (
              <span className="text-[0.68rem] text-[#a8401f]">
                نام مدل یا دیتاست را وارد کنید.
              </span>
            )}
          </div>

          {/* لینک‌ها */}
          <div className="mt-3 flex flex-col gap-1.5">
            <label className="flex items-center gap-1.5 pr-0.5 text-[0.74rem] font-semibold text-[var(--sim-gold-deep)]">
              لینک‌ها <span className="text-[#a8401f]">*</span>
            </label>
            <div className="flex flex-col gap-1.5">
              {links.map((row) => (
                <div key={row.id} className="flex items-center gap-1.5">
                  <select
                    value={row.type}
                    onChange={(e) =>
                      updateLink(row.id, "type", e.target.value as LinkType)
                    }
                    aria-label="نوع لینک"
                    className="h-[38px] cursor-pointer rounded-[10px] border border-[var(--sim-line)] bg-[rgba(168,129,31,0.1)] px-2 text-[0.74rem] font-semibold text-[var(--sim-lapis)]"
                  >
                    <option value="huggingface">HuggingFace</option>
                    <option value="github">GitHub</option>
                    <option value="website">وب‌سایت</option>
                  </select>
                  <input
                    type="url"
                    dir="ltr"
                    value={row.url}
                    onChange={(e) => {
                      updateLink(row.id, "url", e.target.value);
                      setInvalid((p) => ({ ...p, links: false }));
                    }}
                    placeholder="https://..."
                    className={`sim-input text-left ${invalid.links ? "!border-[#a8401f]" : ""}`}
                  />
                  <button
                    type="button"
                    onClick={() => removeLink(row.id)}
                    aria-label="حذف لینک"
                    className="grid h-[26px] w-[26px] flex-none place-items-center rounded-md border border-[var(--sim-line)] bg-white/30 text-[0.9rem] text-[#a8401f] transition-colors hover:bg-[rgba(168,64,31,0.15)]"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={addLink}
              className="mt-1 inline-flex items-center gap-1 self-start rounded-lg border border-dashed border-[var(--sim-line)] bg-[rgba(168,129,31,0.1)] px-3 py-1.5 text-[0.7rem] font-semibold text-[var(--sim-gold-deep)] transition-all hover:border-[var(--sim-gold)] hover:bg-[rgba(168,129,31,0.2)] hover:text-[var(--sim-lapis)]"
            >
              <IconPlus className="h-3 w-3" />
              افزودن لینک دیگر
            </button>
          </div>

          {/* تگ‌ها */}
          <div className="mt-3 flex flex-col gap-1.5">
            <label className="pr-0.5 text-[0.74rem] font-semibold text-[var(--sim-gold-deep)]">
              تگ‌ها (اختیاری — با کاما جدا کنید)
            </label>
            <input
              type="text"
              dir="ltr"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="causal-lm, persian, 7b, instruction-tuned"
              className="sim-input text-left"
            />
          </div>

          {/* مارک‌داون */}
          <div className="mt-3 flex flex-col gap-1.5">
            <label className="pr-0.5 text-[0.74rem] font-semibold text-[var(--sim-gold-deep)]">
              توضیحات (مارک‌داون)
            </label>
            <div
              className={`overflow-hidden rounded-[10px] border bg-white/40 transition-all focus-within:border-[var(--sim-gold)] focus-within:shadow-[0_0_0_3px_rgba(168,129,31,0.12)] ${
                invalid.desc ? "border-[#a8401f]" : "border-[var(--sim-line)]"
              }`}
            >
              <div className="flex flex-wrap items-center gap-0.5 border-b border-[var(--sim-line)] bg-[rgba(168,129,31,0.08)] p-1.5">
                <button
                  type="button"
                  onClick={() => wrapSelection("**", "**")}
                  title="پررنگ"
                  className="rounded px-2 py-1 text-[0.78rem] font-bold text-[var(--sim-gold-deep)] transition-colors hover:bg-[rgba(168,129,31,0.2)] hover:text-[var(--sim-lapis)]"
                >
                  B
                </button>
                <button
                  type="button"
                  onClick={() => wrapSelection("*", "*")}
                  title="کج"
                  className="rounded px-2 py-1 text-[0.78rem] font-bold italic text-[var(--sim-gold-deep)] transition-colors hover:bg-[rgba(168,129,31,0.2)] hover:text-[var(--sim-lapis)]"
                >
                  I
                </button>
                <button
                  type="button"
                  onClick={() => wrapSelection("`", "`")}
                  title="کد"
                  className="rounded px-2 py-1 text-[0.72rem] font-bold text-[var(--sim-gold-deep)] transition-colors hover:bg-[rgba(168,129,31,0.2)] hover:text-[var(--sim-lapis)]"
                >
                  {"</>"}
                </button>
                <button
                  type="button"
                  onClick={() => insertLine("## ")}
                  title="تیتر"
                  className="rounded px-2 py-1 text-[0.72rem] font-bold text-[var(--sim-gold-deep)] transition-colors hover:bg-[rgba(168,129,31,0.2)] hover:text-[var(--sim-lapis)]"
                >
                  H2
                </button>
                <button
                  type="button"
                  onClick={() => insertLine("- ")}
                  title="لیست"
                  className="rounded px-2 py-1 text-[0.78rem] font-bold text-[var(--sim-gold-deep)] transition-colors hover:bg-[rgba(168,129,31,0.2)] hover:text-[var(--sim-lapis)]"
                >
                  •
                </button>
                <span className="mx-1 h-3.5 w-px bg-[var(--sim-line)]" />
                <div className="mr-auto flex rounded-md bg-white/30 p-0.5">
                  <button
                    type="button"
                    onClick={() => setMdTab("write")}
                    className={`rounded px-2.5 py-0.5 text-[0.68rem] font-semibold transition-colors ${
                      mdTab === "write"
                        ? "bg-[var(--sim-gold)] text-white"
                        : "text-[#54452b] hover:text-[var(--sim-lapis)]"
                    }`}
                  >
                    ویرایش
                  </button>
                  <button
                    type="button"
                    onClick={() => setMdTab("preview")}
                    className={`rounded px-2.5 py-0.5 text-[0.68rem] font-semibold transition-colors ${
                      mdTab === "preview"
                        ? "bg-[var(--sim-gold)] text-white"
                        : "text-[#54452b] hover:text-[var(--sim-lapis)]"
                    }`}
                  >
                    پیش‌نمایش
                  </button>
                </div>
              </div>
              <textarea
                ref={descRef}
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                placeholder="معرفی مختصر مدل/دیتاست، وظیفه، حجم، نکات متمایزکننده..."
                className="min-h-[80px] w-full resize-y border-none bg-transparent p-3 text-[0.86rem] leading-loose text-[var(--sim-ink)] outline-none"
                style={{ display: mdTab === "preview" ? "none" : "block" }}
              />
              {mdTab === "preview" && (
                <div className="sim-md min-h-[80px] bg-white/25 p-3 text-[0.86rem] leading-loose">
                  {desc.trim() ? (
                    <div
                      dangerouslySetInnerHTML={{
                        __html: simpleMarkdown(desc),
                      }}
                    />
                  ) : (
                    <span className="italic text-[#9a8862]">
                      چیزی برای پیش‌نمایش نیست.
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* فوتر */}
          <div className="mt-5 flex flex-col gap-3 border-t border-[var(--sim-line)] pt-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-[0.7rem] leading-relaxed text-[#7a6845]">
              با ارسال، یک <b className="text-[var(--sim-gold-deep)]">Issue در گیت‌هاب</b> با
              اطلاعات شما ساخته می‌شود و در پنل مدیریت بررسی می‌گردد.
            </p>
            <button
              type="submit"
              disabled={loading}
              className={`sim-btn sim-btn-primary ${loading ? "pointer-events-none opacity-75" : ""}`}
            >
              {loading ? (
                <span
                  className="absolute inset-0 m-auto h-[18px] w-[18px] animate-[sim-spin_0.8s_linear_infinite] rounded-full border-2 border-[rgba(21,42,92,0.25)] border-t-[var(--sim-lapis)]"
                  style={{ animation: "sim-spin 0.8s linear infinite" }}
                />
              ) : (
                <>
                  <IconSend />
                  <span>ارسال درخواست</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* مارک‌داون سبک برای پیش‌نمایش زنده */
function simpleMarkdown(md: string): string {
  const esc = (s: string) =>
    s.replace(/[&<>"']/g, (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[
        c
      ] as string)
    );
  let html = esc(md);
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
  html = html
    .split(/\n\n+/)
    .map((b) =>
      /^\s*<(h\d|ul|pre)/.test(b) ? b : b.trim() ? `<p>${b.replace(/\n/g, "<br>")}</p>` : ""
    )
    .join("");
  return html;
}
