import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { toDatetimeLocal } from "@/lib/format";
import { updateSession } from "@/lib/actions/admin";

const TYPES = [
  "PUBLIC_SKATE",
  "LESSON",
  "HOCKEY",
  "FIGURE_SKATING",
  "RENTAL",
] as const;

export default async function EditSessionPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  const t = await getTranslations();

  const session = await prisma.iceSession.findUnique({ where: { id } });
  if (!session) notFound();

  const action = updateSession.bind(null, id, locale);

  const inputClass =
    "mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900";
  const labelClass = "block text-sm font-medium text-slate-700 dark:text-slate-300";

  return (
    <div>
      <h2 className="font-semibold text-slate-900 dark:text-white">
        {t("admin.editSession")}
      </h2>
      <form
        action={action}
        className="mt-3 grid gap-4 rounded-2xl border border-slate-200 p-6 sm:grid-cols-2 dark:border-slate-800"
      >
        <div>
          <label className={labelClass}>{t("admin.titleEn")}</label>
          <input
            name="titleEn"
            defaultValue={session.titleEn}
            required
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>{t("admin.titleAr")}</label>
          <input
            name="titleAr"
            defaultValue={session.titleAr}
            dir="rtl"
            required
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>{t("admin.type")}</label>
          <select
            name="type"
            defaultValue={session.type}
            className={inputClass}
          >
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
            defaultValue={session.capacity}
            required
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>{t("admin.startTime")}</label>
          <input
            type="datetime-local"
            name="startTime"
            defaultValue={toDatetimeLocal(session.startTime)}
            required
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>{t("admin.endTime")}</label>
          <input
            type="datetime-local"
            name="endTime"
            defaultValue={toDatetimeLocal(session.endTime)}
            required
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>{t("admin.price")}</label>
          <input
            type="number"
            name="priceSar"
            min={0}
            defaultValue={session.priceSar}
            required
            className={inputClass}
          />
        </div>
        <div className="flex items-end">
          <button
            type="submit"
            className="w-full rounded-full bg-sky-600 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-500 sm:w-auto"
          >
            {t("common.save")}
          </button>
        </div>
      </form>
    </div>
  );
}
