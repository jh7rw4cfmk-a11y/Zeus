import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { auth } from "@/auth";
import { BrandLogo } from "./brand-logo";
import { LanguageSwitcher } from "./language-switcher";
import { LogoutButton } from "./logout-button";
import { MobileNav } from "./mobile-nav";

export async function SiteHeader() {
  const t = await getTranslations();
  const session = await auth();

  const navLinks = [
    { href: "/", label: t("nav.home") },
    { href: "/schedule", label: t("nav.schedule") },
    { href: "/pricing", label: t("nav.pricing") },
    { href: "/about", label: t("nav.about") },
    { href: "/contact", label: t("nav.contact") },
  ];

  const authLinks = session?.user ? (
    <>
      {session.user.role === "ADMIN" && (
        <Link href="/admin" className="text-brand-700 dark:text-brand-400">
          {t("common.admin")}
        </Link>
      )}
      <Link href="/account">{t("common.account")}</Link>
      <LogoutButton label={t("common.logout")} />
    </>
  ) : (
    <>
      <Link href="/login">{t("common.login")}</Link>
      <Link href="/register">{t("common.register")}</Link>
    </>
  );

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/70 bg-white/90 backdrop-blur dark:border-slate-800 dark:bg-slate-950/90">
      <div className="relative mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link href="/" aria-label="CoolArena">
          <BrandLogo className="h-8" />
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-medium text-slate-600 md:flex dark:text-slate-300">
          {navLinks.map((l) => (
            <Link key={l.href} href={l.href} className="hover:text-brand-600">
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <LanguageSwitcher />
          <div className="hidden items-center gap-4 text-sm font-medium text-slate-700 md:flex dark:text-slate-200">
            {authLinks}
          </div>
          <Link
            href="/schedule"
            className="hidden rounded-full bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-500 sm:block"
          >
            {t("common.bookNow")}
          </Link>
          <MobileNav links={navLinks} authLinks={authLinks} />
        </div>
      </div>
    </header>
  );
}
