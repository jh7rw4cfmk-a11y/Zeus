import { getTranslations, getLocale } from "next-intl/server";
import { getUpcomingSessions } from "@/lib/sessions";
import { formatDateTime } from "@/lib/format";
import { Link } from "@/i18n/navigation";

const TYPES = [
  "PUBLIC_SKATE",
  "LESSON",
  "HOCKEY",
  "FIGURE_SKATING",
  "RENTAL",
] as const;

export default async function SchedulePage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>;
}) {
  const { type } = await searchParams;
  const t = await getTranslations();
  const locale = await getLocale();
  const sessions = await getUpcomingSessions();
  const filtered = type ? sessions.filter((s) => s.type === type) : sessions;

  const pillClass = (active: boolean) =>
    `rounded-full border px-4 py-1.5 text-sm font-medium transition ${
      active
        ? "border-sky-600 bg-sky-600 text-white"
        : "border-slate-200 text-slate-600 hover:border-sky-400 dark:border-slate-700 dark:text-slate-300"
    }`;

  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
      <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
        {t("schedule.title")}
      </h1>
      <p className="mt-2 text-slate-600 dark:text-slate-300">
        {t("schedule.subtitle")}
      </p>

      <div className="mt-6 flex flex-wrap gap-2">
        <Link href="/schedule" className={pillClass(!type)}>
          {t("schedule.filterAll")}
        </Link>
        {TYPES.map((ty) => (
          <Link
            key={ty}
            href={`/schedule?type=${ty}`}
            className={pillClass(type === ty)}
          >
            {t(`sessionTypes.${ty}`)}
          </Link>
        ))}
      </div>

      <div className="mt-8 space-y-3">
        {filtered.length === 0 && (
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {t("schedule.noSessions")}
          </p>
        )}
        {filtered.map((s) => (
          <div
            key={s.id}
            className="flex flex-col gap-3 rounded-2xl border border-slate-200 p-5 sm:flex-row sm:items-center sm:justify-between dark:border-slate-800"
          >
            <div>
              <span className="inline-block rounded-full bg-sky-50 px-2.5 py-0.5 text-xs font-medium text-sky-700 dark:bg-sky-950 dark:text-sky-300">
                {t(`sessionTypes.${s.type}`)}
              </span>
              <p className="mt-1.5 font-semibold text-slate-900 dark:text-white">
                {locale === "ar" ? s.titleAr : s.titleEn}
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {formatDateTime(s.startTime, locale)}
              </p>
            </div>
            <div className="flex items-center justify-between gap-4 sm:flex-col sm:items-end">
              <div className="text-end">
                <p className="font-bold text-slate-900 dark:text-white">
                  {s.priceSar} {t("common.currency")}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {s.spotsLeft > 0
                    ? t("schedule.spotsLeft", { count: s.spotsLeft })
                    : t("schedule.full")}
                </p>
              </div>
              {s.spotsLeft > 0 ? (
                <Link
                  href={`/book/${s.id}`}
                  className="rounded-full bg-sky-600 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-500"
                >
                  {t("schedule.bookButton")}
                </Link>
              ) : (
                <span className="rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-400 dark:bg-slate-800">
                  {t("schedule.full")}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
