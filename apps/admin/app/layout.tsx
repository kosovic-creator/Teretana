import type { Metadata } from "next";
import Link from "next/link";
import { BarChart3, CreditCard, Dumbbell, LogOut, ScanLine, UserRoundCog, Users } from "lucide-react";
import { auth, signOut } from "@/auth";
import "./globals.css";

export const metadata: Metadata = { title: "Puls Admin", description: "Administracija teretane" };

const navigation = [
  { href: "/", label: "Pregled", icon: BarChart3 },
  { href: "/members", label: "Članovi", icon: Users },
  { href: "/payments", label: "Uplate", icon: CreditCard },
  { href: "/visits", label: "Dolasci", icon: ScanLine },
  { href: "/staff", label: "Zaposleni", icon: UserRoundCog },
];

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const session = await auth();
  if (!session?.user) return <html lang="sr-Latn"><body>{children}</body></html>;
  return (
    <html lang="sr-Latn">
      <body>
        <div className="min-h-screen md:grid md:grid-cols-[240px_1fr]">
          <aside className="bg-[#131b16] px-5 py-7 text-white">
            <Link href="/" className="flex items-center gap-3 text-xl font-extrabold">
              <span className="grid size-9 place-items-center rounded-xl bg-primary text-primary-foreground"><Dumbbell className="size-5" /></span>
              puls<span className="-ml-3 text-primary">.</span>
            </Link>
            <p className="mt-10 px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">Radni prostor</p>
            <nav className="mt-3 flex gap-2 overflow-x-auto md:flex-col">
              {navigation.map(({ href, label, icon: Icon }) => (
                <Link key={href} href={href} className="flex shrink-0 items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-white/65 transition hover:bg-white/10 hover:text-white">
                  <Icon className="size-4" />{label}
                </Link>
              ))}
            </nav>
            <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-4 text-xs leading-5 text-white/55 md:mt-[45vh]"><span className="block truncate text-white/85">{session.user.email}</span><form action={async () => { "use server"; await signOut({ redirectTo: "/login" }); }}><button className="mt-3 flex items-center gap-2 font-semibold text-white/60 transition hover:text-white" type="submit"><LogOut className="size-4" />Odjavi se</button></form></div>
          </aside>
          <main className="min-w-0">{children}</main>
        </div>
      </body>
    </html>
  );
}
