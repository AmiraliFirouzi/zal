# زال — کامیونیتی مدل‌ها و دیتاست‌های فارسی

وب‌سایت کامیونیتی زال با Next.js 16، TypeScript و Tailwind CSS — طراحی
شیشه‌ای طلایی با تم هنر ایرانی، خروجی استاتیک و آماده‌ی استقرار روی GitHub Pages.

---

## فهرست

- [پیش‌نیازها](#پیش‌نیازها)
- [نصب و اجرای محلی](#نصب-و-اجرای-محلی)
- [ساخت نسخه‌ی پروداکشن](#ساخت-نسخه‌ی-پروداکشن)
- [ساختار پروژه](#ساختار-پروژه)
- [افزودن مدل یا دیتاست](#افزودن-مدل-یا-دیتاست)
- [سفارشی‌سازی](#سفارشی‌سازی)
- [استقرار روی GitHub Pages](#استقرار-روی-github-pages)
- [استقرار روی Vercel](#استقرار-روی-vercel)
- [تکنولوژی‌ها](#تکنولوژی‌ها)
- [مجوز](#مجوز)

---

## پیش‌نیازها

- **Node.js** نسخه‌ی ۱۸ به بالا (پیشنهادی: ۲۰+)
- **npm** (همراه Node نصب می‌شود) یا **Bun**

---

## نصب و اجرای محلی

### ۱. نصب وابستگی‌ها

```bash
npm install
```

### ۲. اجرای سرور توسعه

```bash
npm run dev
```

مرورگر را روی آدرس **http://localhost:3000** باز کنید.

> در محیط توسعه، `basePath` خالی است — یعنی سایت روی root سرو می‌شود.
> در پروداکشن (GitHub Pages)، `basePath` به‌صورت خودکار به نام مخزن تنظیم می‌شود.

---

## ساخت نسخه‌ی پروداکشن

```bash
npm run build
```

خروجی استاتیک در پوشه‌ی `out/` ساخته می‌شود. این پوشه را می‌توانید روی هر
هاست استاتیک (GitHub Pages، Netlify، Cloudflare Pages و...) قرار دهید.

---

## ساختار پروژه

```
zal/
├── src/
│   ├── app/
│   │   ├── layout.tsx          # لایه‌ی ریشه (RTL، فونت‌ها، metadata)
│   │   ├── page.tsx            # صفحه‌ی اصلی (هیرو، فیلتر، گرید، درباره، تیم)
│   │   └── globals.css         # استایل‌های گلوبال + تم زال
│   ├── components/
│   │   └── zal/                # کامپوننت‌های اختصاصی زال
│   │       ├── icons.tsx       # آیکن‌های SVG
│   │       ├── lib.ts          # توابع کمکی + داده‌ی تیم + ثابت‌ها
│   │       ├── ItemCard.tsx    # کارت مدل/دیتاست
│   │       ├── DetailModal.tsx # مودال جزئیات
│   │       ├── SubmitModal.tsx # مودال ثبت درخواست
│   │       ├── AboutSection.tsx# بخش درباره ما + تیم
│   │       └── Reveal.tsx      # انیمیشن اسکرول-ریویل
│   ├── data/
│   │   └── items.json          # داده‌ی مدل‌ها و دیتاست‌ها
│   └── lib/
│       └── utils.ts            # تابع cn
├── public/
│   ├── .nojekyll               # جلوگیری از پردازش Jekyll در GitHub Pages
│   ├── simorgh-bg.png          # تصویر پس‌زمینه (نام فایل تاریخی است)
│   ├── logo.svg
│   └── robots.txt
├── .github/workflows/
│   └── deploy.yml              # GitHub Actions برای استقرار خودکار
├── package.json
├── next.config.ts
├── tsconfig.json
├── tailwind.config.ts
└── eslint.config.mjs
```

> **یادداشت:** نام کلاس‌های CSS با پیشوند `sim-*` و متغیرهای `--sim-*` از
> نسخه‌ی اولیه‌ی پروژه (سیمرغ) به جا مانده‌اند. این فقط نام داخلی است و به
> نمایش کاربر ربطی ندارد؛ برای حفظ ثبات، نگه داشته شده است.

---

## افزودن مدل یا دیتاست

داده‌ها در فایل **`src/data/items.json`** ذخیره می‌شوند. برای افزودن مورد جدید،
یک شیء جدید به آرایه اضافه کنید:

```json
[
  {
    "name": "YourModel-Name",
    "kind": "model",
    "links": [
      {"type": "huggingface", "url": "https://huggingface.co/username/model"},
      {"type": "github", "url": "https://github.com/username/repo"}
    ],
    "author": "نام شما",
    "date": "2026-01-15",
    "downloads": 0,
    "tags": ["persian", "7b", "instruct"],
    "desc": "توضیحات مدل با پشتیبانی از **مارک‌داون**.\n\n### ویژگی‌ها\n- ..."
  }
]
```

| فیلد | نوع | توضیح |
|------|-----|-------|
| `name` | string | نام مدل یا دیتاست (انگلیسی) |
| `kind` | `"model"` \| `"dataset"` | نوع آیتم |
| `links` | array | آرایه‌ای از `{type, url}` — type: `huggingface`، `github` یا `website` |
| `author` | string | نام سازنده/مشارکت‌کننده |
| `date` | string | تاریخ انتشار با فرمت `YYYY-MM-DD` |
| `downloads` | number | تعداد دانلود (برای مرتب‌سازی محبوب‌ترین) |
| `tags` | string[] | تگ‌های مرتبط |
| `desc` | string | توضیحات با پشتیبانی از مارک‌داون (تیتر، بولد، لیست، کد، بلاک‌کوتیشن) |

> **مسیر جایگزین:** کاربران می‌توانند با کلیک روی دکمه‌ی «ثبت درخواست»،
> فرم ارسال را پر کنند. درخواست به‌صورت خودکار یک Issue در گیت‌هاب می‌سازد
> تا ادمین آن را بررسی و به `src/data/items.json` اضافه کند.

---

## سفارشی‌سازی

### تغییر اطلاعات تیم

فایل **`src/components/zal/lib.ts`** — آرایه‌ی `TEAM`:

```typescript
export const TEAM: TeamMember[] = [
  {
    name: "نام کامل",
    role: "نقش · تخصص",
    bio: "معرفی کوتاه",
    initials: "ن.ک",
    github: "https://github.com/username",
    email: "mailto:email@example.com",
    linkedin: "https://www.linkedin.com/in/username",
  },
];
```

### تغییر ثابت‌های پروژه

در فایل **`src/components/zal/lib.ts`**:

```typescript
export const GH_REPO = "AmiraliFirouzi/zal";        // مخزن گیت‌هاب
export const CONTACT_EMAIL = "heroesmihan@gmail.com"; // ایمیل تماس
```

### تغییر رنگ‌ها

متغیرهای CSS در فایل **`src/app/globals.css`** (بخش `:root`):

```css
:root {
  --sim-lapis: #152a5c;    /* آبی لاژوردی */
  --sim-gold: #a8811f;     /* طلایی */
  --sim-gold-deep: #8a6a1c;
  --sim-gold-2: #e3c876;
  --sim-cream: #f4ead0;    /* کرم */
  --sim-bg: #e9d9b4;       /* پس‌زمینه */
}
```

### تغییر متن‌ها

| بخش | فایل |
|-----|------|
| هیرو و فوتر | `src/app/page.tsx` |
| درباره ما و تیم | `src/components/zal/AboutSection.tsx` |
| متن مودال ثبت | `src/components/zal/SubmitModal.tsx` |
| Metadata (عنوان صفحه، SEO) | `src/app/layout.tsx` |

---

## استقرار روی GitHub Pages

این بخش راهنمای گام‌به‌گام استقرار روی GitHub Pages است.

### گام ۱: ساخت مخزن GitHub

1. به [github.com/new](https://github.com/new) بروید.
2. نام مخزن را `zal` بگذارید (یا هر نام دلخواه).
3. مخزن را **Public** کنید.
4. **Create repository** را بزنید.

### گام ۲: تنظیم نام مخزن در `next.config.ts`

فایل `next.config.ts` را باز کنید و متغیر `repoName` را به نام مخزن خود تغییر دهید:

```typescript
const repoName = "zal"; // ← نام مخزن GitHub شما
```

> اگر از User/Organization Page استفاده می‌کنید (مخزن با نام `username.github.io`)،
> `basePath` را خالی بگذارید:
> ```typescript
> const basePath = "";
> ```

### گام ۳: Push کد به مخزن

```bash
cd zal-website
git init
git add .
git commit -m "Initial commit — زال"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/zal.git
git push -u origin main
```

### گام ۴: فعال‌سازی GitHub Pages

1. در صفحه‌ی مخزن: **Settings → Pages**
2. در بخش **Build and deployment**:
   - **Source** را روی **GitHub Actions** بگذارید
3. این کار باعث می‌شود workflow از فایل `.github/workflows/deploy.yml`
   به‌صورت خودکار اجرا شود.

### گام ۵: اجرای خودکار

فایل `.github/workflows/deploy.yml` از قبل در پروژه وجود دارد. هر بار که
به شاخه‌ی `main` push کنید:

1. GitHub Actions به‌صورت خودکار `npm install` و `npm run build` را اجرا می‌کند.
2. خروجی پوشه‌ی `out/` به GitHub Pages منتشر می‌شود.
3. سایت شما در آدرس `https://YOUR_USERNAME.github.io/zal/` قابل دسترس خواهد بود.

> **مدت زمان:** اولین استقرار حدود ۲-۳ دقیقه طول می‌کشد. می‌توانید پیشرفت را
> در تب **Actions** مخزن ببینید.

### گام ۶: تأیید سایت

پس از تکمیل workflow، به آدرس زیر بروید:

```
https://YOUR_USERNAME.github.io/zal/
```

### دامنه‌ی سفارشی (اختیاری)

1. **Settings → Pages → Custom domain**
2. دامنه‌ی خود را وارد کنید (مثلاً `zal.yourdomain.com`)
3. رکورد DNS را تنظیم کنید:
   - **CNAME** به `YOUR_USERNAME.github.io`
4. گزینه‌ی **Enforce HTTPS** را فعال کنید.

> هنگام استفاده از دامنه‌ی سفارشی، `basePath` را خالی بگذارید:
> ```typescript
> const basePath = ""; // دامنه‌ی سفارشی یا User Page
> ```

### عیب‌یابی GitHub Pages

| مشکل | راه‌حل |
|------|--------|
| صفحه سفید / 404 | مطمئن شوید `repoName` در `next.config.ts` با نام مخزن یکی است |
| تصویر پس‌زمینه لود نمی‌شود | فایل `.nojekyll` باید در `public/` باشد (وجود دارد) |
| CSS لود نمی‌شود | بررسی کنید `_next/` پوشه در خروجی `out/` وجود دارد |
| Workflow شکست خورد | در تب Actions لاگ را بررسی کنید — معمولاً مشکل از نسخه‌ی Node است |

---

## استقرار روی Vercel

اگر ترجیح می‌دهید روی Vercel مستقر کنید:

1. فایل `next.config.ts` را ویرایش کنید:
   - خط `output: "export"` را حذف کنید
   - خط `basePath` را حذف کنید
   - خط `NEXT_PUBLIC_BASE_PATH` را حذف کنید
   - خط `trailingSlash` را حذف کنید
2. به [vercel.com](https://vercel.com) بروید و مخزن GitHub خود را import کنید.
3. Vercel به‌صورت خودکار تنظیمات را تشخیص می‌دهد — فقط **Deploy** را بزنید.

---

## تکنولوژی‌ها

- **Next.js 16** (App Router، خروجی استاتیک)
- **TypeScript 5**
- **Tailwind CSS 4**
- **Vazirmatn** (فونت فارسی)
- **Noto Nastaliq Urdu** (فونت خوشنویسی)
- **Cormorant Garamond** (فونت لاتین تزئینی)

---

## مجوز

این پروژه متن‌باز است و می‌توانید آزادانه از آن استفاده و تغییر دهید.

ساخته‌شده با ❤️ برای کامیونیتی هوش مصنوعی فارسی.
