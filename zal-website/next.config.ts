import type { NextConfig } from "next";

/**
 * پیکربندی Next.js برای زال
 *
 * برای استقرار روی GitHub Pages:
 *   ۱) مقدار `repoName` را به نام مخزن خود تغییر دهید
 *      مثال: اگر مخزن github.com/AmiraliFirouzi/zal است، repoName برابر "zal" می‌شود.
 *   ۲) `output: "export"` خروجی استاتیک در پوشه‌ی `out/` می‌سازد.
 *   ۳) GitHub Actions (فایل .github/workflows/deploy.yml) به‌صورت خودکار
 *      پوشه‌ی `out/` را روی GitHub Pages منتشر می‌کند.
 *
 * برای استقرار روی Vercel / Netlify:
 *   خطوط `output` و `basePath` و `NEXT_PUBLIC_BASE_PATH` را حذف کنید.
 */
const repoName = "zal"; // ← نام مخزن GitHub خود را اینجا بگذارید

const isProd = process.env.NODE_ENV === "production";
const basePath = isProd ? `/${repoName}` : "";

const nextConfig: NextConfig = {
  // خروجی استاتیک برای GitHub Pages (در صورت استفاده از Vercel، این خط را حذف کنید)
  output: "export",

  // اگر مخزن در sub-path است (مثل username.github.io/zal)، basePath را تنظیم کنید
  basePath,

  // خروجی استاتیک نمی‌تواند optimizer تصویر را اجرا کند
  images: { unoptimized: true },

  // تریلینگ اسلش یکنواخت — برای GitHub Pages توصیه می‌شود
  trailingSlash: true,

  // غیرفعال‌کردن نشانگر dev (دکمه‌ی شناور در محیط توسعه)
  devIndicators: false,

  reactStrictMode: true,

  // متغیر محیطی برای استفاده در inline styles (مثل url تصویر پس‌زمینه)
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
};

export default nextConfig;
