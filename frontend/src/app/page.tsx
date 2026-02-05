import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Top bar */}
        <div className="flex items-center justify-between py-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-sm">
              ✓
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900">TodoPro</p>
              <p className="text-xs text-slate-500">Modern Task Manager</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/login"
              className="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Sign in
            </Link>
            <Link
              href="/register"
              className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Create account
            </Link>
          </div>
        </div>

        {/* Hero */}
        <section className="grid items-center gap-10 py-10 lg:grid-cols-2 lg:py-16">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-indigo-50 px-4 py-2 text-sm font-medium text-indigo-700">
              <span className="h-2 w-2 rounded-full bg-indigo-600" />
              Productivity made simple
            </div>

            <h1 className="mt-5 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
              Organize tasks.
              <span className="block bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Move faster every day.
              </span>
            </h1>

            <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-600 sm:text-lg">
              A clean, secure to-do app with login, task management, and a
              distraction-free dashboard. Built to help you finish what matters.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link
                href="/register"
                className="inline-flex items-center justify-center rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                Get started — free
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-800 shadow-sm hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                I already have an account
              </Link>
            </div>

            <div className="mt-8 grid max-w-xl grid-cols-3 gap-4 text-center">
              {[
                { k: "Fast", v: "Add & edit tasks" },
                { k: "Secure", v: "Auth protected" },
                { k: "Clean", v: "Modern UI" },
              ].map((item) => (
                <div
                  key={item.k}
                  className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
                >
                  <div className="text-lg font-bold text-indigo-700">{item.k}</div>
                  <div className="mt-1 text-xs text-slate-600">{item.v}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Preview card */}
          <div className="relative">
            <div className="absolute -inset-4 -z-10 rounded-[2rem] bg-gradient-to-r from-indigo-200/50 to-purple-200/50 blur-2xl" />
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-900">Today</p>
                  <p className="text-xs text-slate-500">Your tasks at a glance</p>
                </div>
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                  All synced
                </span>
              </div>

              <div className="mt-6 space-y-3">
                {[
                  { t: "Finish UI redesign", s: "In progress" },
                  { t: "Add new task", s: "Quick action" },
                  { t: "Mark done tasks", s: "One click" },
                ].map((x) => (
                  <div
                    key={x.t}
                    className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-5 w-5 rounded-md border border-slate-300 bg-white" />
                      <div>
                        <p className="text-sm font-medium text-slate-900">{x.t}</p>
                        <p className="text-xs text-slate-500">{x.s}</p>
                      </div>
                    </div>
                    <div className="h-9 w-9 rounded-xl bg-white shadow-sm" />
                  </div>
                ))}
              </div>

              <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-4">
                <p className="text-xs font-semibold text-slate-700">Tip</p>
                <p className="mt-1 text-sm text-slate-600">
                  Keep tasks short and action-based. Small wins build momentum.
                </p>
              </div>
            </div>
          </div>
        </section>

        <footer className="border-t border-slate-200 py-8 text-center text-sm text-slate-500">
          © {new Date().getFullYear()} TodoPro. All rights reserved.
        </footer>
      </div>
    </main>
  );
}
