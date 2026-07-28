import { EntetePage } from "@/components/admin/EntetePage";
import { FormulaireVenteRapide } from "@/components/admin/ventes-rapides/FormulaireVenteRapide";

export const metadata = { title: "Vente rapide — Admin" };

export default function PageVenteRapide() {
  return (
    <>
      <EntetePage
        titre="Vente rapide"
        description="Pour un client qui vient au comptoir régler un travail ponctuel (photocopies, impression à la page…) — sans passer par un devis. La facture est émise et payée immédiatement, prête à imprimer en reçu."
      />
      <FormulaireVenteRapide />
    </>
  );
}
