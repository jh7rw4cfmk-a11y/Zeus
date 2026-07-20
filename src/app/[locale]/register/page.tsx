import { getTranslations } from "next-intl/server";
import { AuthError } from "next-auth";
import { redirect } from "next/navigation";
import { signIn } from "@/auth";
import { registerCustomer } from "@/lib/actions/auth";
import { Link } from "@/i18n/navigation";

export default async function RegisterPage({
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

  async function registerAction(formData: FormData) {
    "use server";

    const result = await registerCustomer({
      name: formData.get("name"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      password: formData.get("password"),
    });

    if (!result.ok) {
      redirect(`/${locale}/register?error=${result.error}`);
    }

    try {
      await signIn("credentials", {
        email: formData.get("email"),
        password: formData.get("password"),
        redirectTo: `/${locale}/account`,
      });
    } catch (err) {
      if (err instanceof AuthError) {
        redirect(`/${locale}/login`);
      }
      throw err;
    }
  }

  return (
    <div className="mx-auto max-w-sm px-4 py-16 sm:px-6">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
        {t("registerTitle")}
      </h1>

      {error === "email_taken" && (
        <p className="mt-4 rounded-lg bg-red-50 px-4 py-2 text-sm text-red-700 dark:bg-red-950 dark:text-red-300">
          {t("emailTaken")}
        </p>
      )}

      <form action={registerAction} className="mt-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
            {t("nameLabel")}
          </label>
          <input
            type="text"
            name="name"
            required
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900"
          />
        </div>
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
            {t("phoneLabel")}
          </label>
          <input
            type="tel"
            name="phone"
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
            minLength={6}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900"
          />
        </div>
        <button
          type="submit"
          className="w-full rounded-full bg-sky-600 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-500"
        >
          {t("submitRegister")}
        </button>
      </form>

      <p className="mt-4 text-sm text-slate-600 dark:text-slate-400">
        {t("haveAccount")}{" "}
        <Link href="/login" className="font-medium text-sky-600 hover:underline">
          {tc("login")}
        </Link>
      </p>
    </div>
  );
}
