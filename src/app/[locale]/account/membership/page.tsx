import { getTranslations, getLocale } from "next-intl/server";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { subscribeMembership } from "@/lib/actions/membership";

export default async function MembershipPlansPage({
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

  const [plans, membership] = await Promise.all([
    prisma.membershipPlan.findMany({ orderBy: { priceSar: "asc" } }),
    prisma.membership.findUnique({ where: { userId: authSession.user.id } }),
  ]);

  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
      <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
        {t("membership.title")}
      </h1>
      <p className="mt-2 text-slate-600 dark:text-slate-300">
        {t("membership.choosePlan")}
      </p>

      <div className="mt-8 grid gap-6 sm:grid-cols-3">
        {plans.map((plan) => {
          const isCurrent = membership?.planId === plan.id;
          const action = subscribeMembership.bind(null, plan.id, locale);
          return (
            <div
              key={plan.id}
              className={`flex flex-col rounded-2xl border p-6 ${
                isCurrent
                  ? "border-brand-500 shadow-lg shadow-brand-500/10"
                  : "border-slate-200 dark:border-slate-800"
              }`}
            >
              <p className="font-semibold text-slate-900 dark:text-white">
                {lang === "ar" ? plan.nameAr : plan.nameEn}
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
                {t("membership.creditsPerMonth", {
                  count: plan.monthlyCredits,
                })}
              </p>
              <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
                {lang === "ar" ? plan.perksAr : plan.perksEn}
              </p>
              <form action={action} className="mt-6">
                <button
                  type="submit"
                  disabled={isCurrent}
                  className={`w-full rounded-full px-4 py-2 text-sm font-semibold ${
                    isCurrent
                      ? "cursor-default bg-slate-100 text-slate-400 dark:bg-slate-800"
                      : "bg-brand-600 text-white hover:bg-brand-500"
                  }`}
                >
                  {isCurrent
                    ? t("membership.subscribed")
                    : membership
                      ? t("membership.upgrade")
                      : t("membership.subscribe")}
                </button>
              </form>
            </div>
          );
        })}
      </div>
    </div>
  );
}
