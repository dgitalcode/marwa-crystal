import Link from "next/link";

import { WhatsAppIcon } from "@/components/store/social-icons";

export function WhatsAppFloating() {
  const phone = process.env.NEXT_PUBLIC_WHATSAPP_PHONE ?? "212704460891";
  const message = encodeURIComponent(
    "Bonjour Marwa Crystal, je souhaite avoir plus d'informations sur vos accessoires.",
  );

  return (
    <Link
      href={`https://wa.me/${phone}?text=${message}`}
      target="_blank"
      rel="noreferrer"
      className="fixed bottom-4 right-4 z-50 grid h-12 w-12 place-items-center rounded-full bg-[#25D366] text-white shadow-2xl transition duration-300 hover:scale-105 hover:shadow-[0_12px_40px_rgba(37,211,102,0.45)] sm:bottom-5 sm:right-5 sm:h-14 sm:w-14"
      aria-label="Contact WhatsApp"
    >
      <WhatsAppIcon className="h-6 w-6 sm:h-7 sm:w-7" />
    </Link>
  );
}
