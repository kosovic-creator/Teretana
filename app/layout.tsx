import type { Metadata, Viewport } from "next";
import Link from "next/link";
import { BarChart3, CreditCard, Dumbbell, LogOut, ScanLine, UserRoundCog, Users } from "lucide-react";
import { auth, signOut } from "@/auth";
import { Pwa } from "@/components/pwa";
import "./globals.css";

export const metadata: Metadata = {
  title: "Hulk23 Admin",
  description: "Administracija teretane",
  applicationName: "Hulk23",
  appleWebApp: { capable: true, title: "Hulk23", statusBarStyle: "default" },
  icons: { icon: "/icons/icon-192.png", apple: "/icons/apple-touch-icon.png" },
};

export const viewport: Viewport = { themeColor: "#131b16" };

const navigation = [
  { href: "/", label: "Pregled", icon: BarChart3 },
  { href: "/members", label: "Članovi", icon: Users },
  { href: "/payments", label: "Uplate", icon: CreditCard },
  { href: "/visits", label: "Dolasci", icon: ScanLine },
  { href: "/staff", label: "Zaposleni", icon: UserRoundCog },
];

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const session = await auth();
  if (!session?.user) return <html lang="sr-Latn"><body><Pwa />{children}</body></html>;
  return (
    <html lang="sr-Latn">
      <body>
        <Pwa />
        <div className="min-h-screen bg-[#071b17] text-foreground md:grid md:grid-cols-[240px_1fr]">
          <aside className="border-b border-emerald-900/20 bg-[#0c1d1a] px-4 py-5 text-white shadow-[0_20px_45px_-35px_rgba(0,0,0,0.8)] md:border-b-0 md:border-r md:px-5 md:py-7">
            <div className="flex items-center justify-between gap-3 md:block">
              <Link href="/" className="flex items-center gap-3 text-xl font-extrabold">
                <span className="grid size-10 place-items-center rounded-2xl bg-gradient-to-br from-emerald-500 via-emerald-600 to-amber-400 text-white shadow-lg shadow-emerald-900/20"><Dumbbell className="size-5" /></span>
                Hulk23
              </Link>
            </div>
            <p className="mt-8 px-3 text-[10px] font-bold uppercase tracking-[0.22em] text-emerald-200/60">Radni prostor</p>
            <nav className="mt-3 flex flex-col gap-2">
              {navigation.map(({ href, label, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  className="flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-semibold text-white/70 transition-all duration-200 hover:bg-white/8 hover:text-white hover:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.04)]"
                >
                  <Icon className="size-4 text-amber-300" />{label}
                </Link>
              ))}
            </nav>
            <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-4 text-xs leading-5 text-white/60 shadow-inner shadow-black/10 md:mt-[42vh]">
              <span className="block truncate text-white/90">{session.user.email}</span>
              <form action={async () => { "use server"; await signOut({ redirectTo: "/login" }); }}>
                <button className="mt-3 flex items-center gap-2 font-semibold text-white/75 transition hover:text-white" type="submit">
                  <LogOut className="size-4 text-amber-300" />Odjavi se
                </button>
              </form>
            </div>
          </aside>
          <main className="min-w-0 px-2 py-3 md:px-4 md:py-6">{children}</main>
        </div>
      </body>
    </html>
  );
}
