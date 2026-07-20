import { getTranslations, getLocale } from "next-intl/server";
import { prisma } from "@/lib/prisma";
import { formatDateTime } from "@/lib/format";
import { createSession, deleteSession } from "@/lib/actions/admin";
import { Link } from "@/i18n/navigation";

const TYPES = [
  "PUBLIC_SKATE",
  "LESSON",
  "HOCKEY",
  "FIGURE_SKATING",
  "RENTAL",
] as const;

export default async function AdminSessionsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations();
  const lang = await getLocale();

  const sessions = await prisma.iceSession.findMany({
    orderBy: { startTime: "desc" },
  });

  const createAction = createSession.bind(null, locale);

  const inputClass =
    "mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900";
  const labelClass = "block text-sm font-medium text-slate-700 dark:text-slate-300";

  return (
    <div>
      <h2 className="font-semibold text-slate-900 dark:text-white">
        {t("admin.addSession")}
      </h2>
      <form
        action={createAction}
        className="mt-3 grid gap-4 rounded-2xl border border-slate-200 p-6 sm:grid-cols-2 dark:border-slate-800"
      >
        <div>
          <label className={labelClass}>{t("admin.titleEn")}</label>
          <input name="titleEn" required className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>{t("admin.titleAr")}</label>
          <input name="titleAr" required dir="rtl" className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>{t("admin.type")}</label>
          <select name="type" className={inputClass} defaultValue="PUBLIC_SKATE">
            {TYPES.map((ty) => (
              <option key={ty} value={ty}>
                {t(`sessionTypes.${ty}`)}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClass}>{t("admin.capacity")}</label>
          <input
            type="number"
            name="capacity"
            min={1}
            defaultValue={20}
            required
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>{t("admin.startTime")}</label>
          <input
            type="datetime-local"
            name="startTime"
            required
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>{t("admin.endTime")}</label>
          <input
            type="datetime-local"
            name="endTime"
            required
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>{t("admin.priceAdult")}</label>
          <input
            type="number"
            name="priceAdultSar"
            min={0}
            defaultValue={80}
            required
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>{t("admin.priceKid")}</label>
          <input
            type="number"
            name="priceKidSar"
            min={0}
            defaultValue={60}
            required
            className={inputClass}
          />
        </div>
        <div className="flex items-center gap-6 sm:col-span-2">
          <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
            <input type="checkbox" name="womenOnly" className="h-4 w-4" />
            {t("admin.womenOnly")}
          </label>
          <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
            <input type="checkbox" name="kidsAllowed" className="h-4 w-4" />
            {t("admin.kidsAllowed")}
          </label>
        </div>
        <div className="flex items-end">
          <button
            type="submit"
            className="w-full rounded-full bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-500 sm:w-auto"
          >
            {t("common.add")}
          </button>
        </div>
      </form>

      <h2 className="mt-10 font-semibold text-slate-900 dark:text-white">
        {t("admin.sessions")}
      </h2>
      <div className="mt-3 space-y-2">
        {sessions.map((s) => {
          const deleteAction = deleteSession.bind(null, s.id, locale);
          return (
            <div
              key={s.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 px-4 py-3 text-sm dark:border-slate-800"
            >
              <div>
                <p className="font-medium text-slate-900 dark:text-white">
                  {lang === "ar" ? s.titleAr : s.titleEn}{" "}
                  <span className="ms-2 rounded-full bg-brand-50 px-2 py-0.5 text-xs text-brand-700 dark:bg-brand-950 dark:text-brand-300">
                    {t(`sessionTypes.${s.type}`)}
                  </span>
                  {s.womenOnly && (
                    <span className="ms-1 rounded-full bg-pink-50 px-2 py-0.5 text-xs text-pink-700 dark:bg-pink-950 dark:text-pink-300">
                      {t("schedule.womenOnly")}
                    </span>
                  )}
                  {s.kidsAllowed && (
                    <span className="ms-1 rounded-full bg-amber-50 px-2 py-0.5 text-xs text-amber-700 dark:bg-amber-950 dark:text-amber-300">
                      {t("schedule.kidsWelcome")}
                    </span>
                  )}
                </p>
                <p className="text-slate-500 dark:text-slate-400">
                  {formatDateTime(s.startTime, lang)} · {t("admin.capacity")}:{" "}
                  {s.capacity} · {s.priceAdultSar}/{s.priceKidSar}{" "}
                  {t("common.currency")}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Link
                  href={`/admin/sessions/${s.id}/edit`}
                  className="text-xs font-medium text-brand-600 hover:underline"
                >
                  {t("common.edit")}
                </Link>
                <form action={deleteAction}>
                  <button
                    type="submit"
                    className="text-xs font-medium text-red-600 hover:underline"
                  >
                    {t("common.delete")}
                  </button>
                </form>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
