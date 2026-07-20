import { signOut } from "@/auth";

export function LogoutButton({ label }: { label: string }) {
  return (
    <form
      action={async () => {
        "use server";
        await signOut({ redirectTo: "/" });
      }}
    >
      <button
        type="submit"
        className="text-sm font-medium text-slate-700 hover:underline dark:text-slate-200"
      >
        {label}
      </button>
    </form>
  );
}
