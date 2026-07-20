import { getTranslations, getLocale } from "next-intl/server";
import { prisma } from "@/lib/prisma";
import { formatDateTime } from "@/lib/format";

export default async function AdminOverviewPage() {
  const t = await getTranslations();
  const lang = await getLocale();

  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);
  const endOfToday = new Date(startOfToday);
  endOfToday.setDate(endOfToday.getDate() + 1);

  const [todaysSessions, totalBookings, bookings] = await Promise.all([
    prisma.iceSession.findMany({
      where: { startTime: { gte: startOfToday, lt: endOfToday } },
      orderBy: { startTime: "asc" },
    }),
    prisma.booking.count({ where: { status: "CONFIRMED" } }),
    prisma.booking.findMany({ where: { status: "CONFIRMED" } }),
  ]);

  const totalRevenue = bookings.reduce((sum, b) => sum + b.totalSar, 0);

  const stats = [
    { label: t("admin.todaysSessions"), value: todaysSessions.length },
    { label: t("admin.totalBookings"), value: totalBookings },
    {
      label: t("admin.totalRevenue"),
      value: `${totalRevenue} ${t("common.currency")}`,
    },
  ];

  return (
    <div>
      <div className="grid gap-4 sm:grid-cols-3">
        {stats.map((s) => (
          <div
            key={s.label}
            className="rounded-2xl border border-slate-200 p-5 dark:border-slate-800"
          >
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {s.label}
            </p>
            <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">
              {s.value}
            </p>
          </div>
        ))}
      </div>

      <h2 className="mt-10 font-semibold text-slate-900 dark:text-white">
        {t("admin.todaysSessions")}
      </h2>
      <div className="mt-3 space-y-2">
        {todaysSessions.length === 0 && (
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {t("admin.noneYet")}
          </p>
        )}
        {todaysSessions.map((s) => (
          <div
            key={s.id}
            className="flex items-center justify-between rounded-xl border border-slate-200 px-4 py-3 text-sm dark:border-slate-800"
          >
            <span>{lang === "ar" ? s.titleAr : s.titleEn}</span>
            <span className="text-slate-500 dark:text-slate-400">
              {formatDateTime(s.startTime, lang)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
