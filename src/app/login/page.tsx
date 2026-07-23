"use client";

import { useActionState } from "react";
import Link from "next/link";
import { FiLock, FiArrowLeft, FiAlertCircle } from "react-icons/fi";
import { login, type LoginState } from "./actions";

export default function LoginPage() {
  const [state, formAction, pending] = useActionState<LoginState, FormData>(
    login,
    {},
  );

  return (
    <div className="container-page flex min-h-[70vh] items-center justify-center py-14">
      <div className="w-full max-w-sm">
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-1.5 text-sm text-[var(--color-muted)] hover:text-[var(--color-foreground)]"
        >
          <FiArrowLeft className="h-4 w-4" /> Back to site
        </Link>

        <div className="card p-7">
          <div className="mb-6 flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-lg bg-gradient-to-br from-[var(--color-accent)] to-[var(--color-accent-2)] text-white">
              <FiLock className="h-5 w-5" />
            </span>
            <div>
              <h1 className="text-lg font-semibold">Admin sign in</h1>
              <p className="text-sm text-[var(--color-faint)]">
                Dashboard &amp; content management
              </p>
            </div>
          </div>

          <form action={formAction} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="mb-1.5 block text-sm font-medium"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-2)] px-3 py-2.5 text-sm outline-none transition-colors focus:border-[var(--color-accent)]"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="mb-1.5 block text-sm font-medium"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                autoComplete="current-password"
                className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-2)] px-3 py-2.5 text-sm outline-none transition-colors focus:border-[var(--color-accent)]"
                placeholder="••••••••"
              />
            </div>

            {state.error && (
              <p className="flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">
                <FiAlertCircle className="h-4 w-4 shrink-0" />
                {state.error}
              </p>
            )}

            <button
              type="submit"
              disabled={pending}
              className="btn btn-primary w-full justify-center disabled:opacity-60"
            >
              {pending ? "Signing in…" : "Sign in"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
