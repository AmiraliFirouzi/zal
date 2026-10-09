/**
 * تابع کمکی cn — برای ترکیب نام‌های کلاس.
 * در این پروژه فعلاً استفاده نمی‌شود اما برای سازگاری آینده نگه داشته شده.
 */
export function cn(...inputs: (string | undefined | null | false)[]): string {
  return inputs.filter(Boolean).join(" ");
}
