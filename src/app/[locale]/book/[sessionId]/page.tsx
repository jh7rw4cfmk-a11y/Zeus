import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { getSessionWithAvailability } from "@/lib/sessions";
import { createBooking } from "@/lib/actions/booking";
import { formatDateTime } from "@/lib/format";
import { auth } from "@/auth";
import { Link } from "@/i18n/navigation";

export default async function BookSessionPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string; sessionId: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { locale, sessionId } = await params;
  const { error } = await searchParams;
  const t = await getTranslations();
  const session = await getSessionWithAvailability(sessionId);
  if (!session) notFound();

  const authSession = await auth();
  const action = createBooking.bind(null, sessionId, locale);

  return (
    <div className="mx-auto max-w-lg px-4 py-16 sm:px-6">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
        {t("booking.title")}
      </h1>

      <div className="mt-6 rounded-2xl border border-slate-200 p-6 dark:border-slate-800">
        <span className="inline-block rounded-full bg-sky-50 px-2.5 py-0.5 text-xs font-medium text-sky-700 dark:bg-sky-950 dark:text-sky-300">
          {t(`sessionTypes.${session.type}`)}
        </span>
        <p className="mt-2 font-semibold text-slate-900 dark:text-white">
          {locale === "ar" ? session.titleAr : session.titleEn}
        </p>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          {formatDateTime(session.startTime, locale)} –{" "}
          {formatDateTime(session.endTime, locale)}
        </p>
        <p className="mt-3 font-bold text-slate-900 dark:text-white">
          {session.priceSar} {t("common.currency")}{" "}
          <span className="text-sm font-normal text-slate-500">
            {t("pricing.perSession")}
          </span>
        </p>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          {session.spotsLeft > 0
            ? t("schedule.spotsLeft", { count: session.spotsLeft })
            : t("schedule.full")}
        </p>
      </div>

      {error === "full" && (
        <p className="mt-4 rounded-lg bg-red-50 px-4 py-2 text-sm text-red-700 dark:bg-red-950 dark:text-red-300">
          {t("schedule.full")}
        </p>
      )}

      {!authSession?.user && (
        <p className="mt-6 rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:bg-amber-950 dark:text-amber-200">
          {t("booking.loginRequired")}{" "}
          <Link href="/login" className="font-medium underline">
            {t("common.login")}
          </Link>
        </p>
      )}

      {authSession?.user && session.spotsLeft > 0 && (
        <form action={action} className="mt-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
              {t("booking.ticketsLabel")}
            </label>
            <input
              type="number"
              name="tickets"
              min={1}
              max={session.spotsLeft}
              defaultValue={1}
              className="mt-1 w-24 rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900"
            />
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {t("booking.mockNotice")}
          </p>
          <button
            type="submit"
            className="rounded-full bg-sky-600 px-6 py-3 text-sm font-semibold text-white hover:bg-sky-500"
          >
            {t("booking.payButton")}
          </button>
        </form>
      )}
    </div>
  );
}
