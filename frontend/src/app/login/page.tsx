"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { authClient } from "@/lib/auth";

function IconLock(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
      <path
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M8 11V7a4 4 0 118 0v4"
      />
      <path
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6 11h12a2 2 0 012 2v7a2 2 0 01-2 2H6a2 2 0 01-2-2v-7a2 2 0 012-2z"
      />
    </svg>
  );
}

function IconMail(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
      <path
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4 6h16v12H4z"
      />
      <path
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m4 7 8 6 8-6"
      />
    </svg>
  );
}

function IconAlert(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
      <path
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 9v4"
      />
      <path
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 17h.01"
      />
      <path
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M10.29 3.86 1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
      />
    </svg>
  );
}

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await authClient.signIn.email({
        email,
        password,
        callbackURL: "/dashboard",
      });

      if (response.error) {
        setError(response.error.message);
      } else {
        router.push("/dashboard");
      }
    } catch (err) {
      setError("An error occurred during login");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50">
      <div className="mx-auto flex min-h-screen max-w-6xl items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          {/* Brand */}
          <div className="mb-8 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-sm">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  className="h-6 w-6"
                >
                  <path
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M20 6L9 17l-5-5"
                  />
                </svg>
              </div>

              <div className="leading-tight">
                <div className="text-sm font-semibold text-slate-900">
                  TodoPro
                </div>
                <div className="text-xs text-slate-500">
                  Modern Task Manager
                </div>
              </div>
            </Link>

            <Link
              href="/register"
              className="text-sm font-medium text-indigo-700 hover:text-indigo-800"
            >
              Create account
            </Link>
          </div>

          {/* Card */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl sm:p-8">
            <div className="mb-6">
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                Welcome back
              </h1>
              <p className="mt-1 text-sm text-slate-600">
                Sign in to continue to your dashboard.
              </p>
            </div>

            {error ? (
              <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
                <div className="flex items-start gap-3">
                  <IconAlert className="mt-0.5 h-4 w-4 text-red-500 opacity-90" />
                  <div>
                    <div className="font-semibold">Login failed</div>
                    <div className="mt-0.5 text-red-700">{error}</div>
                  </div>
                </div>
              </div>
            ) : null}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Email
                </label>
                <div className="relative">
                  <IconMail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 opacity-70" />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full rounded-xl border border-slate-300 bg-white px-10 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Password
                </label>
                <div className="relative">
                  <IconLock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 opacity-70" />
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full rounded-xl border border-slate-300 bg-white px-10 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-600">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  Remember me
                </label>

                <span className="text-sm text-slate-400">Forgot password</span>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="mt-2 inline-flex w-full items-center justify-center rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <svg
                      className="mr-2 h-5 w-5 animate-spin"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v2a6 6 0 00-6 6H4z"
                      />
                    </svg>
                    Signing in…
                  </>
                ) : (
                  "Sign in"
                )}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-slate-600">
              Don’t have an account?{" "}
              <Link
                href="/register"
                className="font-semibold text-indigo-700 hover:text-indigo-800"
              >
                Sign up
              </Link>
            </p>
          </div>

          <p className="mt-6 text-center text-xs text-slate-500">
            © {new Date().getFullYear()} TodoPro
          </p>
        </div>
      </div>
    </main>
  );
}
