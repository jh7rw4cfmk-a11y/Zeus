import type { Metadata, Viewport } from "next";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { RegisterServiceWorker } from "@/components/register-sw";
import "../globals.css";

export const metadata: Metadata = {
  title: "CoolArena — Riyadh Ice Rink",
  description:
    "Book public skating, lessons, hockey, and memberships at CoolArena, Riyadh's premier ice rink.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "CoolArena",
  },
};

export const viewport: Viewport = {
  themeColor: "#0284c7",
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const messages = await getMessages();
  const dir = locale === "ar" ? "rtl" : "ltr";

  return (
    <html lang={locale} dir={dir} className="h-full antialiased">
      <body className="flex min-h-full flex-col bg-white font-sans text-slate-900 dark:bg-slate-950 dark:text-slate-100">
        <NextIntlClientProvider messages={messages}>
          <RegisterServiceWorker />
          <SiteHeader />
          <main className="flex-1">{children}</main>
          <SiteFooter />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
