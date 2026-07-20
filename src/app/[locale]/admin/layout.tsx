import { getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { Link } from "@/i18n/navigation";

export default async function AdminLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const authSession = await auth();
  if (!authSession?.user) {
    redirect(`/${locale}/login`);
  }
  if (authSession.user.role !== "ADMIN") {
    redirect(`/${locale}`);
  }

  const t = await getTranslations("admin");

  const links = [
    { href: "/admin", label: t("overview") },
    { href: "/admin/sessions", label: t("sessions") },
    { href: "/admin/bookings", label: t("bookings") },
    { href: "/admin/members", label: t("members") },
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
        {t("title")}
      </h1>
      <nav className="mt-6 flex flex-wrap gap-2 border-b border-slate-200 pb-4 dark:border-slate-800">
        {links.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className="rounded-full px-4 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-900"
          >
            {l.label}
          </Link>
        ))}
      </nav>
      <div className="mt-8">{children}</div>
    </div>
  );
}
