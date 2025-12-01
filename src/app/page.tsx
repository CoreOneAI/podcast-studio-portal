// app/page.tsx

export const dynamic = "force-dynamic";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-50">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-10">
        {/* Top title */}
        <header className="flex flex-col gap-2 border-b border-slate-800 pb-6">
          <h1 className="text-3xl font-semibold tracking-tight">
            Encore Studio Portal
          </h1>
          <p className="max-w-2xl text-sm text-slate-300">
            Central hub for shows, guests, stories, and your AI research
            assistant. This is the live portal home page — no demo video room,
            no placeholder screen.
          </p>
        </header>

        {/* Main grid */}
        <section className="grid gap-4 md:grid-cols-3">
          {/* Dashboard card */}
          <a
            href="/dashboard"
            className="flex flex-col rounded-xl border border-slate-800 bg-slate-900/60 p-4 shadow-sm transition hover:border-sky-500 hover:bg-slate-900"
          >
            <h2 className="text-base font-semibold">Dashboard</h2>
            <p className="mt-1 text-xs text-slate-300">
              See upcoming recordings, active shows, and quick stats in one
              place.
            </p>
          </a>

          {/* Shows card */}
          <a
            href="/shows"
            className="flex flex-col rounded-xl border border-slate-800 bg-slate-900/60 p-4 shadow-sm transition hover:border-sky-500 hover:bg-slate-900"
          >
            <h2 className="text-base font-semibold">Shows</h2>
            <p className="mt-1 text-xs text-slate-300">
              Create and manage your shows. Attach guests, episodes, and
              research notes.
            </p>
          </a>

          {/* Guests card */}
          <a
            href="/guests"
            className="flex flex-col rounded-xl border border-slate-800 bg-slate-900/60 p-4 shadow-sm transition hover:border-sky-500 hover:bg-slate-900"
          >
            <h2 className="text-base font-semibold">Guests</h2>
            <p className="mt-1 text-xs text-slate-300">
              Maintain your guest roster with bios, topics, and contact details.
            </p>
          </a>

          {/* Board card */}
          <a
            href="/board"
            className="flex flex-col rounded-xl border border-slate-800 bg-slate-900/60 p-4 shadow-sm transition hover:border-sky-500 hover:bg-slate-900"
          >
            <h2 className="text-base font-semibold">Board</h2>
            <p className="mt-1 text-xs text-slate-300">
              Kanban-style view of what’s in development, booked, and recorded.
            </p>
          </a>

          {/* Calendar card */}
          <a
            href="/calendar"
            className="flex flex-col rounded-xl border border-slate-800 bg-slate-900/60 p-4 shadow-sm transition hover:border-sky-500 hover:bg-slate-900"
          >
            <h2 className="text-base font-semibold">Calendar</h2>
            <p className="mt-1 text-xs text-slate-300">
              See all upcoming interviews, deadlines, and release dates.
            </p>
          </a>

          {/* AI Assistant card */}
          <a
            href="/assistant"
            className="flex flex-col rounded-xl border border-slate-800 bg-slate-900/60 p-4 shadow-sm transition hover:border-sky-500 hover:bg-slate-900"
          >
            <h2 className="text-base font-semibold">AI Assistant</h2>
            <p className="mt-1 text-xs text-slate-300">
              Use the AI assistant to generate show outlines, questions, and
              research notes.
            </p>
          </a>

          {/* Story Inbox card */}
          <a
            href="/stories"
            className="flex flex-col rounded-xl border border-slate-800 bg-slate-900/60 p-4 shadow-sm transition hover:border-sky-500 hover:bg-slate-900"
          >
            <h2 className="text-base font-semibold">Story Inbox</h2>
            <p className="mt-1 text-xs text-slate-300">
              Listener stories submitted from the public site flow into this
              inbox.
            </p>
          </a>

          {/* Video Chat card */}
          <a
            href="/video-chat"
            className="flex flex-col rounded-xl border border-slate-800 bg-slate-900/60 p-4 shadow-sm transition hover:border-sky-500 hover:bg-slate-900"
          >
            <h2 className="text-base font-semibold">Guest Interview Room</h2>
            <p className="mt-1 text-xs text-slate-300">
              Launch the guest video interview room when everything is ready.
            </p>
          </a>

          {/* Guide card */}
          <a
            href="/guide"
            className="flex flex-col rounded-xl border border-slate-800 bg-slate-900/60 p-4 shadow-sm transition hover:border-sky-500 hover:bg-slate-900"
          >
            <h2 className="text-base font-semibold">User Guide</h2>
            <p className="mt-1 text-xs text-slate-300">
              Reference guide for you or your team on how to use Encore Studio.
            </p>
          </a>
        </section>

        <footer className="mt-4 border-t border-slate-800 pt-4 text-xs text-slate-400">
          Encore Studio Portal · Built for show runners, producers, and hosts.
        </footer>
      </div>
    </main>
  );
}
