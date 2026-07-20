import { getTranslations, getLocale } from "next-intl/server";
import { prisma } from "@/lib/prisma";
import { formatDateTime } from "@/lib/format";
import { cancelBookingAdmin } from "@/lib/actions/admin";

export default async function AdminBookingsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations();
  const lang = await getLocale();

  const bookings = await prisma.booking.findMany({
    include: { user: true, session: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h2 className="font-semibold text-slate-900 dark:text-white">
        {t("admin.allBookings")}
      </h2>
      <div className="mt-3 overflow-x-auto">
        <table className="w-full min-w-[640px] text-start text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-start text-slate-500 dark:border-slate-800 dark:text-slate-400">
              <th className="py-2 pe-4 font-medium">{t("admin.customer")}</th>
              <th className="py-2 pe-4 font-medium">{t("admin.session")}</th>
              <th className="py-2 pe-4 font-medium">{t("admin.tickets")}</th>
              <th className="py-2 pe-4 font-medium">{t("admin.status")}</th>
              <th className="py-2 pe-4 font-medium" />
            </tr>
          </thead>
          <tbody>
            {bookings.map((b) => {
              const action = cancelBookingAdmin.bind(null, b.id, locale);
              return (
                <tr
                  key={b.id}
                  className="border-b border-slate-100 dark:border-slate-900"
                >
                  <td className="py-3 pe-4">
                    <p className="font-medium text-slate-900 dark:text-white">
                      {b.user.name}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {b.user.email}
                    </p>
                  </td>
                  <td className="py-3 pe-4">
                    <p>{lang === "ar" ? b.session.titleAr : b.session.titleEn}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {formatDateTime(b.session.startTime, lang)}
                    </p>
                  </td>
                  <td className="py-3 pe-4">
                    {b.numTickets} · {b.totalSar} {t("common.currency")}
                  </td>
                  <td className="py-3 pe-4">
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                        b.status === "CANCELLED"
                          ? "bg-red-50 text-red-600 dark:bg-red-950 dark:text-red-400"
                          : "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400"
                      }`}
                    >
                      {b.status}
                    </span>
                  </td>
                  <td className="py-3">
                    {b.status === "CONFIRMED" && (
                      <form action={action}>
                        <button
                          type="submit"
                          className="text-xs font-medium text-red-600 hover:underline"
                        >
                          {t("account.cancelBooking")}
                        </button>
                      </form>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {bookings.length === 0 && (
          <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
            {t("admin.noneYet")}
          </p>
        )}
      </div>
    </div>
  );
}
