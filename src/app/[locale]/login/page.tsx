import { getTranslations } from "next-intl/server";
import { AuthError } from "next-auth";
import { redirect } from "next/navigation";
import { signIn } from "@/auth";
import { Link } from "@/i18n/navigation";

export default async function LoginPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { locale } = await params;
  const { error } = await searchParams;
  const t = await getTranslations("auth");
  const tc = await getTranslations("common");

  async function loginAction(formData: FormData) {
    "use server";
    try {
      await signIn("credentials", {
        email: formData.get("email"),
        password: formData.get("password"),
        redirectTo: `/${locale}/account`,
      });
    } catch (err) {
      if (err instanceof AuthError) {
        redirect(`/${locale}/login?error=1`);
      }
      throw err;
    }
  }

  return (
    <div className="mx-auto max-w-sm px-4 py-16 sm:px-6">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
        {t("loginTitle")}
      </h1>

      {error && (
        <p className="mt-4 rounded-lg bg-red-50 px-4 py-2 text-sm text-red-700 dark:bg-red-950 dark:text-red-300">
          {t("invalidCredentials")}
        </p>
      )}

      <form action={loginAction} className="mt-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
            {t("emailLabel")}
          </label>
          <input
            type="email"
            name="email"
            required
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
            {t("passwordLabel")}
          </label>
          <input
            type="password"
            name="password"
            required
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900"
          />
        </div>
        <button
          type="submit"
          className="w-full rounded-full bg-sky-600 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-500"
        >
          {t("submitLogin")}
        </button>
      </form>

      <p className="mt-4 text-sm text-slate-600 dark:text-slate-400">
        {t("noAccount")}{" "}
        <Link href="/register" className="font-medium text-sky-600 hover:underline">
          {tc("register")}
        </Link>
      </p>
    </div>
  );
}
