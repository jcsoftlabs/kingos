import { PageProvisoire } from "@/components/PageProvisoire";

export const metadata = { title: "Demander un devis" };

export default function PageDevis() {
  return (
    <PageProvisoire
      titre="Demander un devis"
      description="Le configurateur de service (dimensions, matériaux, quantités) et la simulation de prix en direct arrivent avec le module Commande en ligne — phase 3."
    />
  );
}
