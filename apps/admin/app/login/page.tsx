import { Dumbbell } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@puls/ui/components/card";
import { LoginForm } from "./login-form";

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ callbackUrl?: string }> }) {
  const { callbackUrl = "/" } = await searchParams;
  return (
    <main className="grid min-h-screen place-items-center bg-[#131b16] px-5 py-12">
      <div className="w-full max-w-md">
        <div className="mb-7 flex justify-center"><span className="grid size-12 place-items-center rounded-2xl bg-primary text-primary-foreground"><Dumbbell className="size-6" /></span></div>
        <Card className="border-white/10 shadow-2xl"><CardHeader className="text-center"><CardTitle className="text-2xl">Puls administracija</CardTitle><p className="text-sm text-muted-foreground">Prijavi se da pristupiš radnom prostoru.</p></CardHeader><CardContent><LoginForm callbackUrl={callbackUrl.startsWith("/") ? callbackUrl : "/"} /></CardContent></Card>
      </div>
    </main>
  );
}
