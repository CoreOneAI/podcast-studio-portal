import { useEffect, useMemo, useState, createContext, useContext } from "react";
import { useRouter } from "next/router";

import { initializeApp, getApps } from "firebase/app";
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth";

/**
 * Netlify/Next.js NOTE:
 * Firebase App Hosting's initializeApp() (no-args) auto-injection will NOT happen on Netlify.
 * So we initialize explicitly from NEXT_PUBLIC_* env vars.
 */
function initFirebase() {
  if (getApps().length) return;

  const missing = [];
  const cfg = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  };

  for (const [k, v] of Object.entries(cfg)) if (!v) missing.push(k);
  if (missing.length) {
    // Fail loud so you don't ship a "Firebase not configured" mystery again
    throw new Error(`Firebase env missing: ${missing.join(", ")}`);
  }

  initializeApp(cfg);
}

const AuthCtx = createContext(null);
export const useAuth = () => useContext(AuthCtx);

function Shell({ children }) {
  const router = useRouter();
  const { user, logout } = useAuth();

  const nav = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/shows", label: "Shows" },
    { href: "/guests", label: "Guests" },
    { href: "/board", label: "Board" },
    { href: "/calendar", label: "Calendar" },
    { href: "/assistant", label: "AI Assistant" },
    { href: "/stories", label: "Story Inbox" },
    { href: "/guide", label: "User Guide" }
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#0b1220", color: "#e5e7eb" }}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 16px", borderBottom: "1px solid #1f2937", background: "#111827" }}>
        <div style={{ fontWeight: 800 }}>Encore Studio</div>

        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          {nav.map((n) => (
            <a
              key={n.href}
              href={n.href}
              style={{
                textDecoration: "none",
                color: router.pathname.startsWith(n.href) ? "#93c5fd" : "#e5e7eb",
                fontWeight: 700
              }}
            >
              {n.label}
            </a>
          ))}
        </div>

        {user ? (
          <button
            onClick={logout}
            style={{ background: "transparent", border: "1px solid #334155", color: "#e5e7eb", padding: "8px 10px", borderRadius: 10, cursor: "pointer" }}
          >
            Sign out
          </button>
        ) : null}
      </header>

      <main style={{ padding: 16, maxWidth: 1100, margin: "0 auto" }}>{children}</main>
    </div>
  );
}

function AuthProvider({ children }) {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      initFirebase();
      const auth = getAuth();
      return onAuthStateChanged(auth, (u) => {
        setUser(u || null);
        setReady(true);
      });
    } catch (e) {
      console.error(e);
      setReady(true);
    }
  }, []);

  const api = useMemo(() => {
    return {
      user,
      ready,
      async login(email, password) {
        initFirebase();
        const auth = getAuth();
        await signInWithEmailAndPassword(auth, email, password);
        router.push("/dashboard");
      },
      async logout() {
        initFirebase();
        const auth = getAuth();
        await signOut(auth);
        router.push("/login");
      }
    };
  }, [user, ready, router]);

  return <AuthCtx.Provider value={api}>{children}</AuthCtx.Provider>;
}

function AuthGate({ children }) {
  const router = useRouter();
  const { user, ready } = useAuth();

  // Public route
  const isLogin = router.pathname === "/login";

  useEffect(() => {
    if (!ready) return;
    if (!user && !isLogin) router.replace("/login");
    if (user && isLogin) router.replace("/dashboard");
  }, [ready, user, isLogin, router]);

  if (!ready) return null;
  if (!user && !isLogin) return null;
  return children;
}

export default function App({ Component, pageProps }) {
  return (
    <AuthProvider>
      <AuthGate>
        {/* Shell is hidden on login, so login page can be clean */}
        <RouteShell Component={Component} pageProps={pageProps} />
      </AuthGate>
    </AuthProvider>
  );
}

function RouteShell({ Component, pageProps }) {
  const router = useRouter();
  if (router.pathname === "/login") return <Component {...pageProps} />;
  return (
    <Shell>
      <Component {...pageProps} />
    </Shell>
  );
}
