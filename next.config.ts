import type { NextConfig } from "next";

/**
 * پیکربندی Next.js برای زال
 *
 * استقرار روی دامنه‌ی اختصاصی (zal-llm.ir):
 *   از آنجایی که سایت روی ریشه‌ی دامنه سرو می‌شود،
 *   نیازی به basePath یا assetPrefix نیست.
 *
 *   نکته: اگر مجدداً روی GitHub Pages در زیرمسیر /zal/ مستقر کردید،
 *   مقدار basePath را به "/zal" برگردانید.
 */
const nextConfig: NextConfig = {
  // خروجی استاتیک برای GitHub Pages
  output: "export",

  // ⚠️ basePath حذف شد چون سایت روی دامنه‌ی اصلی (ریشه) سرو می‌شود
  // basePath: "/zal",

  // خروجی استاتیک نمی‌تواند optimizer تصویر را اجرا کند
  images: { unoptimized: true },

  // تریلینگ اسلش یکنواخت
  trailingSlash: true,

  // غیرفعال‌کردن نشانگر dev
  devIndicators: false,

  reactStrictMode: true,

  // متغیر محیطی — حالا خالی است چون basePath نداریم
  env: {
    NEXT_PUBLIC_BASE_PATH: "",
  },
};

export default nextConfig;
