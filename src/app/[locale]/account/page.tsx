import { getTranslations, getLocale } from "next-intl/server";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { formatDate, formatDateTime } from "@/lib/format";
import { cancelBooking } from "@/lib/actions/booking";
import { Link } from "@/i18n/navigation";

export default async function AccountPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const authSession = await auth();
  if (!authSession?.user) {
    redirect(`/${locale}/login`);
  }

  const t = await getTranslations();
  const lang = await getLocale();

  const [bookings, membership] = await Promise.all([
    prisma.booking.findMany({
      where: { userId: authSession.user.id },
      include: { session: true },
      orderBy: { session: { startTime: "desc" } },
    }),
    prisma.membership.findUnique({
      where: { userId: authSession.user.id },
      include: { plan: true },
    }),
  ]);

  const now = new Date();
  const upcoming = bookings.filter(
    (b) => b.status === "CONFIRMED" && b.session.startTime >= now
  );
  const past = bookings.filter(
    (b) => b.status !== "CONFIRMED" || b.session.startTime < now
  );

  const statusBadge = "rounded-full px-2 py-0.5 text-xs font-medium";

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
        {t("account.title")}
      </h1>

      <section className="mt-8 rounded-2xl border border-slate-200 p-6 dark:border-slate-800">
        <h2 className="font-semibold text-slate-900 dark:text-white">
          {t("account.membershipTitle")}
        </h2>
        {membership ? (
          <div className="mt-3">
            <p className="font-medium text-sky-700 dark:text-sky-400">
              {lang === "ar" ? membership.plan.nameAr : membership.plan.nameEn}
            </p>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
              {t("account.creditsRemaining", {
                count: membership.creditsRemaining,
              })}
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {t("account.renewalDate", {
                date: formatDate(membership.renewalDate, lang),
              })}
            </p>
          </div>
        ) : (
          <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
            {t("account.noMembership")}
          </p>
        )}
        <Link
          href="/account/membership"
          className="mt-4 inline-block rounded-full bg-sky-600 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-500"
        >
          {t("account.viewPlans")}
        </Link>
      </section>

      <section className="mt-8">
        <h2 className="font-semibold text-slate-900 dark:text-white">
          {t("account.upcomingBookings")}
        </h2>
        <div className="mt-3 space-y-3">
          {upcoming.length === 0 && (
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {t("account.noBookings")}
            </p>
          )}
          {upcoming.map((b) => {
            const cancelAction = cancelBooking.bind(null, b.id, locale);
            return (
              <div
                key={b.id}
                className="flex items-center justify-between rounded-xl border border-slate-200 p-4 dark:border-slate-800"
              >
                <div>
                  <p className="font-medium text-slate-900 dark:text-white">
                    {lang === "ar" ? b.session.titleAr : b.session.titleEn}
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {formatDateTime(b.session.startTime, lang)} ·{" "}
                    {b.numTickets}× · {b.totalSar} {t("common.currency")}
                  </p>
                </div>
                <form action={cancelAction}>
                  <button
                    type="submit"
                    className="rounded-full border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-950"
                  >
                    {t("account.cancelBooking")}
                  </button>
                </form>
              </div>
            );
          })}
        </div>
      </section>

      <section className="mt-8">
        <h2 className="font-semibold text-slate-900 dark:text-white">
          {t("account.pastBookings")}
        </h2>
        <div className="mt-3 space-y-3">
          {past.length === 0 && (
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {t("account.noBookings")}
            </p>
          )}
          {past.map((b) => (
            <div
              key={b.id}
              className="flex items-center justify-between rounded-xl border border-slate-200 p-4 opacity-70 dark:border-slate-800"
            >
              <div>
                <p className="font-medium text-slate-900 dark:text-white">
                  {lang === "ar" ? b.session.titleAr : b.session.titleEn}
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {formatDateTime(b.session.startTime, lang)} · {b.numTickets}×
                </p>
              </div>
              <span
                className={`${statusBadge} ${
                  b.status === "CANCELLED"
                    ? "bg-red-50 text-red-600 dark:bg-red-950 dark:text-red-400"
                    : "bg-slate-100 text-slate-500 dark:bg-slate-800"
                }`}
              >
                {b.status}
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
