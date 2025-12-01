'use client';

import Link from 'next/link';
import { LayoutDashboard, Mic, Users, Inbox, Sparkles, BookOpen, Video } from 'lucide-react';
import { useUser } from '@/firebase';

export default function HomePage() {
  const { user, loading } = useUser();

  return (
    <main className="min-h-screen bg-slate-950 text-slate-50">
      {/* Top bar */}
      <header className="border-b border-slate-800 bg-slate-900/70 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <div className="flex flex-col">
            <span className="text-xs uppercase tracking-[0.2em] text-slate-400">
              Encore Studio
            </span>
            <h1 className="text-lg font-semibold text-slate-50">
              Encore Portal Home
            </h1>
          </div>

          <div className="text-right text-xs text-slate-400">
            {loading ? (
              <span>Checking session…</span>
            ) : user ? (
              <>
                <div className="font-medium text-slate-100">
                  Logged in as: {user.email ?? 'Member'}
                </div>
                <div className="text-[11px] text-emerald-400">
                  Portal features unlocked
                </div>
              </>
            ) : (
              <>
                <div className="font-medium text-amber-300">
                  Not signed in
                </div>
                <Link
                  href="/login"
                  className="text-[11px] text-sky-400 underline-offset-2 hover:underline"
                >
                  Go to login
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Main content */}
      <div className="mx-auto flex max-w-5xl flex-col gap-8 px-4 py-8">
        {/* Hero / primary action */}
        <section className="grid gap-6 rounded-xl border border-slate-800 bg-slate-900/60 p-6 md:grid-cols-[2fr,1.3fr]">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-slate-50">
              Welcome to your production hub
            </h2>
            <p className="text-sm text-slate-300">
              This is the control center for your shows, guests, story inbox,
              and AI production assistant. Use the dashboard to see what&apos;s
              recording, what&apos;s in development, and what needs your review.
            </p>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 rounded-lg bg-sky-500 px-4 py-2 text-sm font-medium text-slate-950 shadow-md shadow-sky-500/40 hover:bg-sky-400"
              >
                <LayoutDashboard className="h-4 w-4" />
                Go to Dashboard
              </Link>

              <Link
                href="/shows"
                className="inline-flex items-center gap-2 rounded-lg border border-slate-700 px-3 py-2 text-xs font-medium text-slate-100 hover:border-sky-500/70 hover:text-sky-300"
              >
                <Mic className="h-4 w-4" />
                View Shows
              </Link>

              <Link
                href="/guests"
                className="inline-flex items-center gap-2 rounded-lg border border-slate-700 px-3 py-2 text-xs font-medium text-slate-100 hover:border-sky-500/70 hover:text-sky-300"
              >
                <Users className="h-4 w-4" />
                Manage Guests
              </Link>
            </div>
          </div>

          {/* Status card */}
          <div className="space-y-3 rounded-lg border border-slate-800 bg-slate-950/60 p-4 text-sm">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-400">
                Session
              </span>
              <span className="rounded-full bg-slate-800 px-2 py-0.5 text-[11px] text-slate-200">
                {loading ? 'Checking…' : user ? 'Connected' : 'Guest'}
              </span>
            </div>

            <div className="space-y-1 text-xs text-slate-300">
              <p>
                {user
                  ? 'You are signed in and can access your private dashboard and tools.'
                  : 'You are currently browsing as a guest. Log in to access private dashboards and workflows.'}
              </p>
              {!user && (
                <p className="text-[11px] text-slate-400">
                  Use the Login link in the top right or go directly to /login
                  to start a secure session.
                </p>
              )}
            </div>
          </div>
        </section>

        {/* Quick links grid */}
        <section className="space-y-3">
          <h3 className="text-sm font-semibold text-slate-100">
            Portal sections
          </h3>
          <div className="grid gap-4 md:grid-cols-3">
            <Link
              href="/shows"
              className="group rounded-lg border border-slate-800 bg-slate-900/40 p-4 text-sm hover:border-sky-500/60 hover:bg-slate-900/80"
            >
              <div className="mb-2 flex items-center gap-2 text-slate-100">
                <Mic className="h-4 w-4 text-sky-400" />
                <span className="font-medium">Shows</span>
              </div>
              <p className="text-xs text-slate-400">
                Create, organize, and track your podcast or show series.
              </p>
            </Link>

            <Link
              href="/guests"
              className="group rounded-lg border border-slate-800 bg-slate-900/40 p-4 text-sm hover:border-sky-500/60 hover:bg-slate-900/80"
            >
              <div className="mb-2 flex items-center gap-2 text-slate-100">
                <Users className="h-4 w-4 text-sky-400" />
                <span className="font-medium">Guests</span>
              </div>
              <p className="text-xs text-slate-400">
                Manage guest profiles, contact details, and booking status.
              </p>
            </Link>

            <Link
              href="/stories"
              className="group rounded-lg border border-slate-800 bg-slate-900/40 p-4 text-sm hover:border-sky-500/60 hover:bg-slate-900/80"
            >
              <div className="mb-2 flex items-center gap-2 text-slate-100">
                <Inbox className="h-4 w-4 text-sky-400" />
                <span className="font-medium">Story Inbox</span>
              </div>
              <p className="text-xs text-slate-400">
                Review listener submissions and route approved stories into
                episodes.
              </p>
            </Link>

            <Link
              href="/assistant"
              className="group rounded-lg border border-slate-800 bg-slate-900/40 p-4 text-sm hover:border-sky-500/60 hover:bg-slate-900/80"
            >
              <div className="mb-2 flex items-center gap-2 text-slate-100">
                <Sparkles className="h-4 w-4 text-sky-400" />
                <span className="font-medium">AI Assistant</span>
              </div>
              <p className="text-xs text-slate-400">
                Use AI to brainstorm topics, outline episodes, and tighten
                show structure.
              </p>
            </Link>

            <Link
              href="/guide"
              className="group rounded-lg border border-slate-800 bg-slate-900/40 p-4 text-sm hover:border-sky-500/60 hover:bg-slate-900/80"
            >
              <div className="mb-2 flex items-center gap-2 text-slate-100">
                <BookOpen className="h-4 w-4 text-sky-400" />
                <span className="font-medium">User Guide</span>
              </div>
              <p className="text-xs text-slate-400">
                Reference best practices, checklists, and workflows for your
                team.
              </p>
            </Link>

            <Link
              href="/video-chat"
              className="group rounded-lg border border-slate-800 bg-slate-900/40 p-4 text-sm hover:border-sky-500/60 hover:bg-slate-900/80"
            >
              <div className="mb-2 flex items-center gap-2 text-slate-100">
                <Video className="h-4 w-4 text-sky-400" />
                <span className="font-medium">Guest Interview Room</span>
              </div>
              <p className="text-xs text-slate-400">
                Join the integrated video room for remote recording sessions.
              </p>
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
