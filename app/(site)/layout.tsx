import { Entete } from "@/components/Entete";
import { PiedDePage } from "@/components/PiedDePage";
import { ChatWidget } from "@/components/ChatWidget";

export default function LayoutSite({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Entete />
      <main className="flex-1">{children}</main>
      <div className="print:hidden">
        <PiedDePage />
      </div>
      <ChatWidget />
    </div>
  );
}
