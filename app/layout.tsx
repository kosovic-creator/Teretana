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
        <div className="flex min-h-screen bg-[#071b17] text-foreground md:grid md:grid-cols-[240px_1fr]">
          <aside className="flex w-20 shrink-0 flex-col items-center justify-between border-r border-emerald-900/20 bg-[#0c1d1a] px-2 py-4 text-white shadow-[0_20px_45px_-35px_rgba(0,0,0,0.8)] md:w-auto md:border-b-0 md:border-r md:px-5 md:py-7 md:items-stretch">
            <div className="flex w-full flex-col items-center md:items-stretch">
              <Link href="/" className="grid size-10 place-items-center rounded-2xl bg-gradient-to-br from-emerald-500 via-emerald-600 to-amber-400 text-white shadow-lg shadow-emerald-900/20 md:flex md:w-auto md:items-center md:gap-3 md:text-xl md:font-extrabold">
                <Dumbbell className="size-5" />
                <span className="hidden md:inline">Hulk23</span>
              </Link>

              <nav className="mt-3 flex w-full flex-col items-center gap-2 md:items-stretch">
                {navigation.map(({ href, label, icon: Icon }) => (
                  <Link
                    key={href}
                    href={href}
                    className="flex size-11 items-center justify-center rounded-2xl text-sm font-semibold text-white/70 transition-all duration-200 hover:bg-white/8 hover:text-white hover:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.04)] md:size-auto md:justify-start md:px-3 md:py-3"
                    aria-label={label}
                    title={label}
                  >
                    <Icon className="size-4 text-amber-300" />
                    <span className="sr-only md:not-sr-only md:ml-3 md:inline">{label}</span>
                  </Link>
                ))}
              </nav>
            </div>

            <div className="mt-4 hidden w-full md:block md:mt-[42vh]">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-xs leading-5 text-white/60 shadow-inner shadow-black/10">
                <span className="block truncate text-white/90">{session.user.email}</span>
                <form action={async () => { "use server"; await signOut({ redirectTo: "/login" }); }}>
                  <button className="mt-3 flex items-center gap-2 font-semibold text-white/75 transition hover:text-white" type="submit">
                    <LogOut className="size-4 text-amber-300" />Odjavi se
                  </button>
                </form>
              </div>
            </div>
          </aside>
          <main className="min-w-0 flex-1 px-2 py-3 md:px-4 md:py-6">{children}</main>
        </div>
      </body>
    </html>
  );
}
