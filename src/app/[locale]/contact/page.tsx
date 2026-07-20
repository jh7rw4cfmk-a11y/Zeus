import { getTranslations } from "next-intl/server";

export default async function ContactPage() {
  const t = await getTranslations("contact");

  const rows = [
    { label: t("addressLabel"), value: t("address") },
    { label: t("phoneLabel"), value: t("phone"), ltr: true },
    { label: t("emailLabel"), value: t("email"), ltr: true },
    { label: t("hoursLabel"), value: t("hours") },
  ];

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
        {t("title")}
      </h1>
      <p className="mt-4 text-slate-600 dark:text-slate-300">
        {t("mapNote")}
      </p>

      <dl className="mt-8 divide-y divide-slate-200 rounded-2xl border border-slate-200 dark:divide-slate-800 dark:border-slate-800">
        {rows.map((r) => (
          <div
            key={r.label}
            className="grid grid-cols-3 gap-4 px-6 py-4 text-sm"
          >
            <dt className="font-medium text-slate-500 dark:text-slate-400">
              {r.label}
            </dt>
            <dd
              dir={r.ltr ? "ltr" : undefined}
              className="col-span-2 text-start text-slate-800 dark:text-slate-200"
            >
              {r.value}
            </dd>
          </div>
        ))}
      </dl>

      <div className="mt-8 flex h-64 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 dark:bg-slate-900">
        King Fahd Road, Riyadh
      </div>
    </div>
  );
}
