import { EntetePage } from "@/components/admin/EntetePage";
import { PanneauSupport } from "@/components/admin/support/PanneauSupport";

export const metadata = { title: "Support — Admin" };

export default function PageSupportAdmin() {
  return (
    <>
      <EntetePage
        titre="Support"
        description="Conversations démarrées depuis la bulle de chat du site vitrine — activez votre disponibilité pour répondre en direct."
      />
      <PanneauSupport />
    </>
  );
}
