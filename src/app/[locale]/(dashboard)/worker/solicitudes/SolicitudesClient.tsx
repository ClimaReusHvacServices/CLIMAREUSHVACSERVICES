"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { CheckCircle2, PhoneCall, ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import { takeServiceRequest, resolveServiceRequest } from "./actions";
import { toast } from "sonner";

const PAGE_SIZE = 10;

interface Request {
  id: string;
  number: number;
  name: string;
  phone: string;
  description: string;
  status: string;
  takenAt: Date | null;
  createdAt: Date;
  takenBy?: { firstName: string; lastName: string } | null;
}

function TakeButton({ id }: { id: string }) {
  const t = useTranslations("serviceRequest");
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function handleTake() {
    startTransition(async () => {
      const result = await takeServiceRequest(id);
      if (result.ok) {
        toast.success(t("takenSuccess"));
        router.refresh();
      } else if (result.alreadyTaken) {
        toast.error(t("takenError"));
        router.refresh();
      }
    });
  }

  return (
    <button
      onClick={handleTake}
      disabled={pending}
      className="px-3 py-1.5 rounded-xl text-xs font-semibold text-white disabled:opacity-60 transition-opacity flex items-center gap-1.5 shrink-0"
      style={{ background: "linear-gradient(to right, #008f65, #1d7291)" }}
    >
      {pending ? (
        <span className="w-3 h-3 border-2 border-white/40 border-t-white rounded-full animate-spin" />
      ) : null}
      {pending ? t("taking") : t("takeSolicitud")}
    </button>
  );
}

function ResolveButton({ id }: { id: string }) {
  const t = useTranslations("serviceRequest");
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function handleResolve() {
    startTransition(async () => {
      await resolveServiceRequest(id);
      toast.success(t("resolvedSuccess"));
      router.refresh();
    });
  }

  return (
    <button
      onClick={handleResolve}
      disabled={pending}
      className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-green-50 text-green-700 border border-green-200 hover:bg-green-100 disabled:opacity-60 transition-colors flex items-center gap-1.5 shrink-0"
    >
      {pending ? (
        <span className="w-3 h-3 border-2 border-green-400/40 border-t-green-600 rounded-full animate-spin" />
      ) : (
        <CheckCircle2 size={12} />
      )}
      {t("markResolved")}
    </button>
  );
}

function Pagination({
  total,
  page,
  onPage,
}: {
  total: number;
  page: number;
  onPage: (p: number) => void;
}) {
  const pages = Math.ceil(total / PAGE_SIZE);
  if (pages <= 1) return null;
  return (
    <div className="flex items-center justify-center gap-2 px-5 py-3 border-t border-gray-50">
      <button
        onClick={() => onPage(page - 1)}
        disabled={page === 0}
        className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 disabled:opacity-30 transition-colors"
      >
        <ChevronLeft size={14} />
      </button>
      <span className="text-xs text-gray-500 font-medium">
        {page + 1} / {pages}
      </span>
      <button
        onClick={() => onPage(page + 1)}
        disabled={page >= pages - 1}
        className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 disabled:opacity-30 transition-colors"
      >
        <ChevronRight size={14} />
      </button>
    </div>
  );
}

export function SolicitudesClient({
  available,
  mine,
  locale,
}: {
  available: Request[];
  mine: Request[];
  locale: string;
}) {
  const t = useTranslations("serviceRequest");
  const router = useRouter();
  const [availablePage, setAvailablePage] = useState(0);
  const [minePage, setMinePage] = useState(0);

  useEffect(() => {
    const id = setInterval(() => router.refresh(), 5000);
    return () => clearInterval(id);
  }, [router]);

  const fmt = (d: Date) =>
    d.toLocaleDateString(locale, { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });

  const availableSlice = available.slice(availablePage * PAGE_SIZE, (availablePage + 1) * PAGE_SIZE);
  const mineSlice = mine.slice(minePage * PAGE_SIZE, (minePage + 1) * PAGE_SIZE);

  return (
    <div className="space-y-6">
      {/* Available requests */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div
          className="px-5 py-4 border-b border-gray-100 flex items-center gap-2"
          style={{ background: "linear-gradient(to right, #008f6508, #1d729108)" }}
        >
          <span className="w-2 h-2 rounded-full bg-blue-400 shrink-0" />
          <h2 className="text-sm font-bold text-gray-900">{t("workerTitle")}</h2>
          <span className="ml-auto text-xs text-gray-400">{available.length} {t("available")}</span>
        </div>

        {available.length === 0 ? (
          <div className="py-10 text-center">
            <p className="text-gray-400 text-sm">{t("noAvailable")}</p>
          </div>
        ) : (
          <>
            <div className="divide-y divide-gray-50">
              {availableSlice.map((r) => (
                <div key={r.id} className="px-5 py-4 flex gap-4 hover:bg-gray-50/50 transition-colors">
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-gray-900 text-sm">{r.name}</span>
                      <span className="text-gray-300">·</span>
                      <span className="text-xs text-gray-400 font-mono">#{r.number}</span>
                    </div>
                    <p className="text-xs text-gray-600 line-clamp-2">{r.description}</p>
                    <div className="flex items-center gap-3 pt-0.5 flex-wrap">
                      <a
                        href={`https://wa.me/${r.phone.replace(/[^0-9]/g, "")}`}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1 text-xs font-medium text-primary-700 hover:underline"
                      >
                        <PhoneCall size={10} />
                        {r.phone}
                      </a>
                      <span className="flex items-center gap-1 text-xs text-primary-600 font-semibold bg-primary-50 px-2 py-0.5 rounded-md">
                        <Calendar size={10} />
                        {fmt(r.createdAt)}
                      </span>
                    </div>
                  </div>
                  <TakeButton id={r.id} />
                </div>
              ))}
            </div>
            <Pagination total={available.length} page={availablePage} onPage={setAvailablePage} />
          </>
        )}
      </div>

      {/* My taken requests */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div
          className="px-5 py-4 border-b border-gray-100 flex items-center gap-2"
          style={{ background: "linear-gradient(to right, #1d729108, #083a5708)" }}
        >
          <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0" />
          <h2 className="text-sm font-bold text-gray-900">{t("myRequests")}</h2>
          <span className="ml-auto text-xs text-gray-400">{mine.length}</span>
        </div>

        {mine.length === 0 ? (
          <div className="py-8 text-center">
            <p className="text-gray-400 text-sm">{t("noMine")}</p>
          </div>
        ) : (
          <>
            <div className="divide-y divide-gray-50">
              {mineSlice.map((r) => (
                <div key={r.id} className="px-5 py-4 flex gap-4 hover:bg-gray-50/50 transition-colors">
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-gray-900 text-sm">{r.name}</span>
                      <span className="text-gray-300">·</span>
                      <span className="text-xs text-gray-400 font-mono">#{r.number}</span>
                      {r.status === "resuelta" && (
                        <span className="px-1.5 py-0.5 rounded-md text-xs font-semibold bg-green-50 text-green-700 border border-green-200">
                          {t("status_resuelta")}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-600 line-clamp-2">{r.description}</p>
                    <div className="flex items-center gap-3 pt-0.5 flex-wrap">
                      <a
                        href={`https://wa.me/${r.phone.replace(/[^0-9]/g, "")}`}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1 text-xs font-medium text-primary-700 hover:underline"
                      >
                        <PhoneCall size={10} />
                        {r.phone}
                      </a>
                      <span className="flex items-center gap-1 text-xs text-primary-600 font-semibold bg-primary-50 px-2 py-0.5 rounded-md">
                        <Calendar size={10} />
                        {fmt(r.createdAt)}
                      </span>
                      {r.takenAt && (
                        <span className="text-xs text-amber-600 font-medium bg-amber-50 px-2 py-0.5 rounded-md">
                          Tomada: {fmt(r.takenAt)}
                        </span>
                      )}
                    </div>
                  </div>
                  {r.status === "tomada" && <ResolveButton id={r.id} />}
                </div>
              ))}
            </div>
            <Pagination total={mine.length} page={minePage} onPage={setMinePage} />
          </>
        )}
      </div>
    </div>
  );
}
