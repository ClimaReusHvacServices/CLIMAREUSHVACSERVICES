import { auth } from "@/auth/config";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { setRequestLocale } from "next-intl/server";
import dynamic from "next/dynamic";
import Footer from "@/components/landing/Footer";
import { CheckoutClient } from "./CheckoutClient";

const Navbar = dynamic(() => import("@/components/landing/Navbar"));

export const metadata = {
  title: "Confirmar pedido | Clima HVAC Service",
};

async function getAddress(userId: string) {
  const cliente = await db.cliente.findUnique({ where: { userId } });
  if (!cliente) return null;
  const address = await db.clientAddress.findFirst({
    where: { clienteId: cliente.id },
    orderBy: { isDefault: "desc" },
    select: { street: true, city: true, state: true, postalCode: true, country: true },
  });
  return address;
}

export default async function CheckoutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const session = await auth();
  if (!session || session.user?.role !== "cliente") {
    redirect(`/${locale}/login?callbackUrl=/${locale}/checkout`);
  }

  const address = await getAddress(session.user.id);

  return (
    <main className="bg-gray-50 min-h-screen">
      <Navbar />
      <div data-logo="green" className="pt-24 pb-16 px-4">
        <CheckoutClient address={address} />
      </div>
      <Footer />
    </main>
  );
}
