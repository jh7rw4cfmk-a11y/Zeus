import { getTranslations, getLocale } from "next-intl/server";
import { prisma } from "@/lib/prisma";
import { Link } from "@/i18n/navigation";

export default async function PricingPage() {
  const t = await getTranslations();
  const locale = await getLocale();
  const plans = await prisma.membershipPlan.findMany({
    orderBy: { priceSar: "asc" },
  });

  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
      <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
        {t("pricing.title")}
      </h1>
      <p className="mt-2 text-slate-600 dark:text-slate-300">
        {t("pricing.subtitle")}
      </p>

      <h2 className="mt-12 text-xl font-semibold text-slate-900 dark:text-white">
        {t("pricing.sessionsTitle")}
      </h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 p-5 dark:border-slate-800">
          <p className="font-medium text-slate-900 dark:text-white">
            {t("pricing.adultPrice")}
          </p>
          <p className="mt-1 text-2xl font-bold text-brand-600">
            80 <span className="text-sm">{t("common.currency")}</span>
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {t("pricing.perSession")}
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200 p-5 dark:border-slate-800">
          <p className="font-medium text-slate-900 dark:text-white">
            {t("pricing.kidPrice")}
          </p>
          <p className="mt-1 text-2xl font-bold text-brand-600">
            60 <span className="text-sm">{t("common.currency")}</span>
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {t("pricing.perSession")}
          </p>
        </div>
      </div>
      <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
        {t("pricing.kidsNote")}
      </p>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
        {t("pricing.womenOnlyNote")}
      </p>

      <h2 className="mt-12 text-xl font-semibold text-slate-900 dark:text-white">
        {t("pricing.membershipsTitle")}
      </h2>
      <div className="mt-4 grid gap-6 sm:grid-cols-3">
        {plans.length === 0 && (
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {t("admin.noneYet")}
          </p>
        )}
        {plans.map((plan, i) => (
          <div
            key={plan.id}
            className={`flex flex-col rounded-2xl border p-6 ${
              i === 1
                ? "border-brand-500 shadow-lg shadow-brand-500/10"
                : "border-slate-200 dark:border-slate-800"
            }`}
          >
            {i === 1 && (
              <span className="mb-2 w-fit rounded-full bg-brand-100 px-3 py-1 text-xs font-semibold text-brand-700 dark:bg-brand-900 dark:text-brand-300">
                {t("pricing.popular")}
              </span>
            )}
            <p className="font-semibold text-slate-900 dark:text-white">
              {locale === "ar" ? plan.nameAr : plan.nameEn}
            </p>
            <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">
              {plan.priceSar}
              <span className="text-base font-normal text-slate-500">
                {" "}
                {t("common.currency")}
                {t("pricing.perMonth")}
              </span>
            </p>
            <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
              {t("membership.creditsPerMonth", { count: plan.monthlyCredits })}
            </p>
            <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
              {locale === "ar" ? plan.perksAr : plan.perksEn}
            </p>
            <Link
              href="/account/membership"
              className="mt-6 rounded-full bg-brand-600 px-4 py-2 text-center text-sm font-semibold text-white hover:bg-brand-500"
            >
              {t("membership.subscribe")}
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
