import { getTranslations, getLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatDateTime } from "@/lib/format";
import { Link } from "@/i18n/navigation";

export default async function BookingSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ bookingId?: string }>;
}) {
  const { bookingId } = await searchParams;
  const t = await getTranslations();
  const locale = await getLocale();

  const booking = bookingId
    ? await prisma.booking.findUnique({
        where: { id: bookingId },
        include: { session: true },
      })
    : null;

  if (!booking) notFound();

  return (
    <div className="mx-auto max-w-lg px-4 py-16 text-center sm:px-6">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-2xl dark:bg-emerald-900">
        ✅
      </div>
      <h1 className="mt-4 text-2xl font-bold text-slate-900 dark:text-white">
        {t("booking.successTitle")}
      </h1>
      <p className="mt-2 text-slate-600 dark:text-slate-300">
        {t("booking.successBody")}
      </p>

      <div className="mt-6 rounded-2xl border border-slate-200 p-6 text-start dark:border-slate-800">
        <p className="font-semibold text-slate-900 dark:text-white">
          {locale === "ar" ? booking.session.titleAr : booking.session.titleEn}
        </p>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          {formatDateTime(booking.session.startTime, locale)}
        </p>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
          {booking.numAdults > 0 &&
            `${t("booking.adultsLabel")}: ${booking.numAdults}`}
          {booking.numAdults > 0 && booking.numKids > 0 && " · "}
          {booking.numKids > 0 &&
            `${t("booking.kidsLabel")}: ${booking.numKids}`}
        </p>
        <p className="mt-1 font-bold text-slate-900 dark:text-white">
          {t("booking.totalLabel")}: {booking.totalSar} {t("common.currency")}
        </p>
      </div>

      <div className="mt-8 flex justify-center gap-4">
        <Link
          href="/account"
          className="rounded-full bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-500"
        >
          {t("booking.viewBooking")}
        </Link>
        <Link
          href="/schedule"
          className="rounded-full border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-900"
        >
          {t("booking.backToSchedule")}
        </Link>
      </div>
    </div>
  );
}
