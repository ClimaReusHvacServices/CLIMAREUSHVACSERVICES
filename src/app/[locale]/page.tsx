import { auth } from "@/auth/config";
import { redirect } from "next/navigation";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const session = await auth();

  if (session) {
    if (session.user?.role === "admin") {
      redirect(`/${locale}/admin`);
    } else if (session.user?.role === "cliente") {
      redirect(`/${locale}/dashboard`);
    } else if (session.user?.role === "trabajador") {
      redirect(`/${locale}/worker`);
    }
  }

  redirect(`/${locale}/login`);
}
