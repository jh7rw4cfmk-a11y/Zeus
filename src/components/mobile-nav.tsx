"use client";

import { useState } from "react";
import { Link } from "@/i18n/navigation";

type NavLink = { href: string; label: string };

export function MobileNav({
  links,
  authLinks,
}: {
  links: NavLink[];
  authLinks: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button
        type="button"
        aria-label="Menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="flex h-9 w-9 items-center justify-center rounded-md border border-slate-200 text-slate-700 dark:border-slate-700 dark:text-slate-200"
      >
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
          <path
            d="M2 4.5h14M2 9h14M2 13.5h14"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      </button>
      {open && (
        <div className="absolute inset-x-0 top-full z-50 border-b border-slate-200 bg-white px-4 py-4 shadow-lg dark:border-slate-800 dark:bg-slate-950">
          <nav className="flex flex-col gap-3 text-sm font-medium text-slate-700 dark:text-slate-200">
            {links.map((l) => (
              <Link key={l.href} href={l.href} onClick={() => setOpen(false)}>
                {l.label}
              </Link>
            ))}
            <div className="mt-2 flex flex-col gap-3 border-t border-slate-200 pt-3 dark:border-slate-800">
              {authLinks}
            </div>
          </nav>
        </div>
      )}
    </div>
  );
}
