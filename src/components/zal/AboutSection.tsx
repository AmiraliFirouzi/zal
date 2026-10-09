"use client";

import { TEAM, VALUES, fa } from "./lib";
import { Reveal } from "./Reveal";
import { IconGithub, IconMail, IconLinkedin, IconSparkle, IconCheck } from "./icons";

export function AboutSection() {
  return (
    <section id="about" className="scroll-mt-32 px-1 pb-16 pt-4">
      {/* ─── درباره زال ─── */}
      <Reveal variant="up" className="mb-14 text-center">
        <p
          className="sim-latin mb-3 text-[0.74rem] font-semibold uppercase tracking-[0.42em] text-[var(--sim-gold-deep)]"
          style={{ direction: "ltr", textIndent: "0.42em" }}
        >
          About · Zal
        </p>
        <h2 className="sim-nasta sim-gold-text mb-5 text-[clamp(2rem,5vw,3rem)] font-bold leading-[2]">
          درباره زال
        </h2>
        <div className="sim-glass mx-auto max-w-3xl rounded-2xl p-7 sm:p-9">
          <p className="sim-halo text-[0.95rem] leading-[2.1] text-[#3a3122] sm:text-[1rem]">
            <span className="sim-nasta text-[1.15em] font-bold text-[var(--sim-lapis)]">
              زال
            </span>{" "}
            یک کامیونیتی مستقل و متن‌باز است که با هدف توسعه‌ی هوش مصنوعی برای
            زبان فارسی شکل گرفته است. ما معتقدیم زبان مادری، سنگ‌بنای هویت و
            اندیشه است؛ و هوش مصنوعی نباید تنها زبان‌های پرگویش را در بر گیرد.
            همین‌گونه که نگارگران ایرانی قرن‌ها دانش را بر کاغذ نگاه داشتند، ما
            تلاش می‌کنیم زبان فارسی را به دنیای هوش مصنوعی بیاوریم — با مدل‌ها،
            دیتاست‌ها و ابزارهایی که توسط کامیونیتی و برای کامیونیتی ساخته
            می‌شوند.
          </p>
        </div>
      </Reveal>

      {/* ─── ارزش‌ها ─── */}
      <div className="mb-16">
        <Reveal variant="fade" className="mb-6 flex items-center justify-center gap-3 text-center">
          <span className="block h-px w-10 bg-[linear-gradient(90deg,transparent,rgba(168,129,31,0.7))]" />
          <span className="sim-latin text-[0.7rem] font-semibold uppercase tracking-[0.3em] text-[var(--sim-gold-deep)]">
            Values
          </span>
          <span className="block h-px w-10 bg-[linear-gradient(90deg,rgba(168,129,31,0.7),transparent)]" />
        </Reveal>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {VALUES.map((v, i) => (
            <Reveal
              key={v.title}
              variant="up"
              delay={i * 90}
              className="sim-glass sim-card-hover group flex h-full flex-col items-center rounded-2xl p-5 text-center hover:border-[rgba(168,129,31,0.4)]"
            >
              <div className="mb-3 grid h-12 w-12 place-items-center rounded-xl border border-[rgba(168,129,31,0.3)] bg-[linear-gradient(135deg,rgba(168,129,31,0.2),rgba(168,129,31,0.06))] text-[var(--sim-gold-deep)] transition-transform duration-300 group-hover:scale-110">
                <IconSparkle className="h-5 w-5" />
              </div>
              <h3 className="sim-nasta mb-2 text-[1.1rem] font-bold text-[var(--sim-lapis)]">
                {v.title}
              </h3>
              <p className="text-[0.8rem] leading-[1.9] text-[#54452b]">
                {v.desc}
              </p>
            </Reveal>
          ))}
        </div>
      </div>

      {/* ─── تیم ─── */}
      <div id="team" className="scroll-mt-32">
        <Reveal variant="up" className="mb-8 text-center">
          <p
            className="sim-latin mb-2 text-[0.74rem] font-semibold uppercase tracking-[0.42em] text-[var(--sim-gold-deep)]"
            style={{ direction: "ltr", textIndent: "0.42em" }}
          >
            The Team
          </p>
          <h2 className="sim-nasta sim-gold-text text-[clamp(2rem,5vw,3rem)] font-bold leading-[2]">
            تیم زال
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-[0.88rem] leading-[1.9] text-[#54452b]">
            گروهی از پژوهشگران و مهندسان فارسی‌زبان که دغدغه‌مند هوش مصنوعی برای
            زبان مادری‌اند.
          </p>
        </Reveal>

        {/* گرید تیم — برای ۱ تا ۳ عضو، تک‌ستونه روی موبایل و وسط‌چین روی دسکتاپ */}
        <div className="mx-auto grid max-w-2xl grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {TEAM.map((m, i) => (
            <Reveal
              key={m.name}
              variant="up"
              delay={i * 100}
              as="article"
              className="sim-glass sim-card-hover group flex h-full flex-col items-center rounded-2xl p-5 text-center hover:border-[rgba(168,129,31,0.4)]"
            >
              {/* آواتار */}
              <div className="relative mb-4">
                <div className="grid h-20 w-20 place-items-center rounded-full border-2 border-[rgba(168,129,31,0.4)] bg-[linear-gradient(135deg,rgba(168,129,31,0.18),rgba(227,200,118,0.25))] shadow-[inset_0_1px_0_rgba(255,255,255,0.6),0_8px_20px_-8px_rgba(168,129,31,0.4)] transition-transform duration-300 group-hover:scale-105">
                  <span className="sim-nasta text-[1.5rem] font-bold text-[var(--sim-lapis)]">
                    {m.initials}
                  </span>
                </div>
                <span className="absolute -bottom-1 left-1/2 h-1 w-10 -translate-x-1/2 rounded-full bg-[linear-gradient(90deg,transparent,var(--sim-gold),transparent)]" />
              </div>

              <h3 className="sim-nasta mb-2.5 text-[1.15rem] font-bold text-[var(--sim-lapis)]">
                {m.name}
              </h3>
              <p className="mb-3 text-[0.74rem] font-semibold text-[var(--sim-gold-deep)]">
                {m.role}
              </p>
              <p className="mb-4 flex-1 text-[0.8rem] leading-[1.85] text-[#54452b]">
                {m.bio}
              </p>

              {/* لینک‌ها */}
              <div className="flex items-center gap-2">
                {m.github && (
                  <a
                    href={m.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`گیت‌هاب ${m.name}`}
                    className="sim-glass grid h-9 w-9 place-items-center rounded-full text-[var(--sim-lapis)] transition-all hover:-translate-y-0.5 hover:text-[var(--sim-gold-deep)]"
                  >
                    <IconGithub className="h-4 w-4" />
                  </a>
                )}
                {m.linkedin && (
                  <a
                    href={m.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`لینکدین ${m.name}`}
                    className="sim-glass grid h-9 w-9 place-items-center rounded-full text-[var(--sim-lapis)] transition-all hover:-translate-y-0.5 hover:text-[var(--sim-gold-deep)]"
                  >
                    <IconLinkedin className="h-4 w-4" />
                  </a>
                )}
                {m.email && (
                  <a
                    href={m.email}
                    aria-label={`ایمیل ${m.name}`}
                    className="sim-glass grid h-9 w-9 place-items-center rounded-full text-[var(--sim-lapis)] transition-all hover:-translate-y-0.5 hover:text-[var(--sim-gold-deep)]"
                  >
                    <IconMail className="h-4 w-4" />
                  </a>
                )}
              </div>
            </Reveal>
          ))}
        </div>

        {/* دعوت به مشارکت */}
        <Reveal variant="up" delay={120} className="sim-glass mt-10 flex flex-col items-center gap-4 rounded-2xl p-7 text-center sm:flex-row sm:justify-between sm:text-right">
          <div className="flex items-start gap-3">
            <div className="grid h-11 w-11 flex-none place-items-center rounded-xl border border-[rgba(168,129,31,0.3)] bg-[linear-gradient(135deg,rgba(168,129,31,0.2),rgba(168,129,31,0.06))] text-[var(--sim-gold-deep)]">
              <IconCheck className="h-5 w-5" />
            </div>
            <div>
              <h3 className="sim-nasta mb-1 text-[1.2rem] font-bold text-[var(--sim-lapis)]">
                به زال بپیوندید
              </h3>
              <p className="max-w-xl text-[0.84rem] leading-[1.9] text-[#54452b]">
                چه پژوهشگر، مهندس یا علاقه‌مند باشید — جای شما در این کامیونیتی
                هست. مدل یا دیتاست خود را ثبت کنید، یا در گفتگوهای ما مشارکت
                کنید.
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              const e = new CustomEvent("zal-open-submit");
              window.dispatchEvent(e);
            }}
            className="sim-btn sim-btn-primary flex-none"
          >
            <IconSparkle className="h-4 w-4" />
            ثبت درخواست
          </button>
        </Reveal>

        <p className="mt-6 text-center text-[0.76rem] text-[#7a6845]">
          تاکنون{" "}
          <b className="text-[var(--sim-lapis)]">{fa(TEAM.length)}</b> نفر در
          هسته‌ی زال مشارکت دارند — و شما می‌توانید نفر بعدی باشید.
        </p>
      </div>
    </section>
  );
}
