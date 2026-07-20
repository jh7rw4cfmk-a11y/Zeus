import { getTranslations } from "next-intl/server";

export default async function AboutPage() {
  const t = await getTranslations("about");

  const values = [t("value1"), t("value2"), t("value3")];

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
        {t("title")}
      </h1>
      <p className="mt-6 text-slate-600 dark:text-slate-300">{t("body1")}</p>
      <p className="mt-4 text-slate-600 dark:text-slate-300">{t("body2")}</p>

      <h2 className="mt-10 text-xl font-semibold text-slate-900 dark:text-white">
        {t("valuesTitle")}
      </h2>
      <ul className="mt-4 space-y-2">
        {values.map((v) => (
          <li
            key={v}
            className="flex items-start gap-2 text-slate-600 dark:text-slate-300"
          >
            <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-600" />
            {v}
          </li>
        ))}
      </ul>
    </div>
  );
}
