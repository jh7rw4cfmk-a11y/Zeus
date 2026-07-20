import { getTranslations } from "next-intl/server";
import { BrandLogo } from "./brand-logo";

export async function SiteFooter() {
  const t = await getTranslations();

  return (
    <footer className="mt-16 border-t border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-950">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-3">
        <div>
          <BrandLogo className="h-8" />
          <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
            {t("common.tagline")}
          </p>
          <a
            href="https://instagram.com/Coolarena.sa"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-brand-600 hover:underline dark:text-brand-400"
          >
            @Coolarena.sa
          </a>
        </div>
        <div className="text-sm text-slate-600 dark:text-slate-300">
          <p className="font-medium text-slate-900 dark:text-white">
            {t("contact.addressLabel")}
          </p>
          <p>{t("contact.address")}</p>
          <p className="mt-3 font-medium text-slate-900 dark:text-white">
            {t("contact.hoursLabel")}
          </p>
          <p className="whitespace-pre-line">{t("home.hoursText")}</p>
        </div>
        <div className="text-sm text-slate-600 dark:text-slate-300">
          <p className="font-medium text-slate-900 dark:text-white">
            {t("contact.phoneLabel")}
          </p>
          <p dir="ltr" className="text-start">
            {t("contact.phone")}
          </p>
          <p className="mt-3 font-medium text-slate-900 dark:text-white">
            {t("contact.emailLabel")}
          </p>
          <p>{t("contact.email")}</p>
        </div>
      </div>
      <div className="border-t border-slate-200 py-4 text-center text-xs text-slate-400 dark:border-slate-800">
        © {new Date().getFullYear()} {t("common.appName")} — Riyadh, Saudi
        Arabia
      </div>
    </footer>
  );
}
