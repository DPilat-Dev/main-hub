import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { LoginForm } from "./LoginForm";

export const metadata = {
  title: "Sign in",
  robots: { index: false, follow: false },
};

export default async function LoginPage() {
  // Already have a valid session? Skip the form and go straight to the dashboard.
  const session = await auth();
  if (session?.user) redirect("/admin");

  return <LoginForm />;
}
