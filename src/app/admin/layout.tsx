import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { Sidebar } from "@/components/admin/Sidebar";

export const metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  return (
    <div className="container-page grid gap-8 py-8 lg:grid-cols-[220px_1fr]">
      <div className="lg:sticky lg:top-8 lg:h-[calc(100vh-4rem)]">
        <Sidebar userName={session.user.name ?? session.user.email} />
      </div>
      <div className="min-w-0">{children}</div>
    </div>
  );
}
