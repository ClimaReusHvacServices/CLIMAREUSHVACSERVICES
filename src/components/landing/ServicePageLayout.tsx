import dynamic from "next/dynamic";
import Footer from "@/components/landing/Footer";
import ServiceContactForm from "@/components/landing/ServiceContactForm";

const Navbar = dynamic(() => import("@/components/landing/Navbar"));
const WhatsAppButton = dynamic(() => import("@/components/landing/WhatsAppButton"));

interface Props {
  heroImage: string;
  title: string;
  subtitle: string;
  serviceTitle: string;
  children: React.ReactNode;
}

export default function ServicePageLayout({ heroImage, title, subtitle, serviceTitle, children }: Props) {
  return (
    <main>
      <Navbar />

      {/* Hero */}
      <div
        className="relative h-72 sm:h-96 flex items-center justify-center text-white overflow-hidden"
        style={{ backgroundImage: `url('${heroImage}')`, backgroundSize: "cover", backgroundPosition: "center" }}
      >
        <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(13,60,77,0.75) 0%, rgba(29,114,145,0.65) 100%)" }} />
        <div className="relative z-10 text-center max-w-3xl px-4 sm:px-6">
          <h1 className="text-2xl sm:text-4xl font-extrabold leading-tight drop-shadow">{title}</h1>
          <p className="mt-3 text-sm sm:text-base text-white/85 max-w-2xl mx-auto">{subtitle}</p>
        </div>
      </div>

      {/* Body */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-14 grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-10 items-start">
        {/* Contact form — left column */}
        <ServiceContactForm serviceTitle={serviceTitle} />

        {/* Content — right column */}
        <article className="prose prose-gray max-w-none prose-headings:font-bold prose-headings:text-gray-900 prose-h2:text-2xl prose-h3:text-lg prose-p:text-gray-600 prose-li:text-gray-600 prose-strong:text-gray-800">
          {children}
        </article>
      </div>

      <WhatsAppButton />
      <Footer />
    </main>
  );
}
