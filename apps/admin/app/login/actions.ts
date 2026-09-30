"use server";

import { AuthError } from "next-auth";
import { signIn } from "@/auth";

export async function loginAction(_state: string | undefined, formData: FormData) {
  try {
    await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirectTo: String(formData.get("callbackUrl") || "/"),
    });
  } catch (error) {
    if (error instanceof AuthError) {
      if (error.type !== "CredentialsSignin") {
        return "Prijava trenutno nije dostupna. Provjeri vezu sa bazom i Vercel varijable.";
      }
      return "Email ili lozinka nijesu ispravni.";
    }
    throw error;
  }
}
