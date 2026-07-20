import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

export default async function HomePage() {
  const t = await getTranslations();

  const features = [
    {
      title: t("home.feature1Title"),
      desc: t("home.feature1Desc"),
      icon: "❄️",
    },
    {
      title: t("home.feature2Title"),
      desc: t("home.feature2Desc"),
      icon: "⛸️",
    },
    {
      title: t("home.feature3Title"),
      desc: t("home.feature3Desc"),
      icon: "🎟️",
    },
  ];

  return (
    <div>
      <section className="relative overflow-hidden bg-gradient-to-b from-brand-600 to-brand-800 text-white">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
          <p className="text-sm font-semibold uppercase tracking-widest text-brand-200">
            {t("common.tagline")}
          </p>
          <h1 className="mt-4 max-w-2xl text-4xl font-bold tracking-tight sm:text-5xl">
            {t("home.heroTitle")}
          </h1>
          <p className="mt-5 max-w-xl text-lg text-brand-100">
            {t("home.heroSubtitle")}
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/schedule"
              className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-brand-700 shadow hover:bg-brand-50"
            >
              {t("home.ctaBook")}
            </Link>
            <Link
              href="/schedule"
              className="rounded-full border border-white/60 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10"
            >
              {t("home.ctaSchedule")}
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
          {t("home.featuresTitle")}
        </h2>
        <div className="mt-8 grid gap-6 sm:grid-cols-3">
          {features.map((f) => (
            <div
              key={f.title}
              className="rounded-2xl border border-slate-200 p-6 dark:border-slate-800"
            >
              <div className="text-3xl">{f.icon}</div>
              <h3 className="mt-3 font-semibold text-slate-900 dark:text-white">
                {f.title}
              </h3>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-slate-50 dark:bg-slate-900">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            {t("home.visitTitle")}
          </h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            <div className="rounded-2xl bg-white p-8 shadow-sm dark:bg-slate-950">
              <h3 className="font-semibold text-slate-900 dark:text-white">
                {t("home.hoursTitle")}
              </h3>
              <p className="mt-2 whitespace-pre-line text-slate-600 dark:text-slate-400">
                {t("home.hoursText")}
              </p>
              <p className="mt-3 inline-flex rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700 dark:bg-brand-950 dark:text-brand-300">
                {t("home.womenOnlyNote")}
              </p>
            </div>
            <div className="rounded-2xl bg-white p-8 shadow-sm dark:bg-slate-950">
              <h3 className="font-semibold text-slate-900 dark:text-white">
                {t("home.locationTitle")}
              </h3>
              <p className="mt-2 text-slate-600 dark:text-slate-400">
                {t("home.locationText")}
              </p>
            </div>
            <div className="rounded-2xl bg-white p-8 shadow-sm dark:bg-slate-950">
              <h3 className="font-semibold text-slate-900 dark:text-white">
                {t("home.pricingTitle")}
              </h3>
              <p className="mt-2 text-slate-600 dark:text-slate-400">
                {t("home.pricingText")}
              </p>
            </div>
            <div className="rounded-2xl bg-white p-8 shadow-sm dark:bg-slate-950">
              <h3 className="font-semibold text-slate-900 dark:text-white">
                {t("home.kidsTitle")}
              </h3>
              <p className="mt-2 text-slate-600 dark:text-slate-400">
                {t("home.kidsText")}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 text-center sm:px-6">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
          {t("pricing.membershipsTitle")}
        </h2>
        <Link
          href="/pricing"
          className="mt-6 inline-block rounded-full bg-brand-600 px-6 py-3 text-sm font-semibold text-white hover:bg-brand-500"
        >
          {t("home.membershipCta")}
        </Link>
      </section>
    </div>
  );
}
