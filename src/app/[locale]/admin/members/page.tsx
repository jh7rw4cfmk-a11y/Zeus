import { getTranslations, getLocale } from "next-intl/server";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/format";
import { createMembershipPlan } from "@/lib/actions/admin";

export default async function AdminMembersPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations();
  const lang = await getLocale();

  const [users, plans] = await Promise.all([
    prisma.user.findMany({
      where: { role: "CUSTOMER" },
      include: { membership: { include: { plan: true } } },
      orderBy: { createdAt: "desc" },
    }),
    prisma.membershipPlan.findMany({ orderBy: { priceSar: "asc" } }),
  ]);

  const createAction = createMembershipPlan.bind(null, locale);
  const inputClass =
    "mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900";
  const labelClass = "block text-sm font-medium text-slate-700 dark:text-slate-300";

  return (
    <div>
      <h2 className="font-semibold text-slate-900 dark:text-white">
        {t("admin.allMembers")}
      </h2>
      <div className="mt-3 overflow-x-auto">
        <table className="w-full min-w-[520px] text-start text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-start text-slate-500 dark:border-slate-800 dark:text-slate-400">
              <th className="py-2 pe-4 font-medium">{t("admin.customer")}</th>
              <th className="py-2 pe-4 font-medium">{t("admin.plan")}</th>
              <th className="py-2 pe-4 font-medium">{t("admin.joined")}</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr
                key={u.id}
                className="border-b border-slate-100 dark:border-slate-900"
              >
                <td className="py-3 pe-4">
                  <p className="font-medium text-slate-900 dark:text-white">
                    {u.name}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {u.email}
                  </p>
                </td>
                <td className="py-3 pe-4">
                  {u.membership
                    ? lang === "ar"
                      ? u.membership.plan.nameAr
                      : u.membership.plan.nameEn
                    : "—"}
                </td>
                <td className="py-3 pe-4">
                  {formatDate(u.createdAt, lang)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {users.length === 0 && (
          <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
            {t("admin.noneYet")}
          </p>
        )}
      </div>

      <h2 className="mt-10 font-semibold text-slate-900 dark:text-white">
        {t("admin.plans")}
      </h2>
      <div className="mt-3 space-y-2">
        {plans.map((p) => (
          <div
            key={p.id}
            className="flex items-center justify-between rounded-xl border border-slate-200 px-4 py-3 text-sm dark:border-slate-800"
          >
            <span className="font-medium text-slate-900 dark:text-white">
              {lang === "ar" ? p.nameAr : p.nameEn}
            </span>
            <span className="text-slate-500 dark:text-slate-400">
              {p.priceSar} {t("common.currency")}
              {t("pricing.perMonth")} ·{" "}
              {t("membership.creditsPerMonth", { count: p.monthlyCredits })}
            </span>
          </div>
        ))}
      </div>

      <form
        action={createAction}
        className="mt-4 grid gap-4 rounded-2xl border border-slate-200 p-6 sm:grid-cols-2 dark:border-slate-800"
      >
        <div>
          <label className={labelClass}>{t("admin.titleEn")}</label>
          <input name="nameEn" required className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>{t("admin.titleAr")}</label>
          <input name="nameAr" required dir="rtl" className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>{t("admin.price")}</label>
          <input
            type="number"
            name="priceSar"
            min={0}
            required
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>{t("admin.monthlyCredits")}</label>
          <input
            type="number"
            name="monthlyCredits"
            min={0}
            required
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>{t("membership.perks")} (EN)</label>
          <input name="perksEn" required className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>{t("membership.perks")} (AR)</label>
          <input name="perksAr" required dir="rtl" className={inputClass} />
        </div>
        <div className="flex items-end">
          <button
            type="submit"
            className="w-full rounded-full bg-sky-600 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-500 sm:w-auto"
          >
            {t("common.add")}
          </button>
        </div>
      </form>
    </div>
  );
}
