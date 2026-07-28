import { apiBackendAuthentifie } from "@/lib/auth-serveur";
import { EntetePage } from "@/components/admin/EntetePage";
import { FormulaireNouvelleCommande } from "@/components/admin/commandes/FormulaireNouvelleCommande";

export const metadata = { title: "Nouvelle commande — Admin" };

interface Categorie {
  id: string;
  nom: string;
  services: {
    id: string;
    slug: string;
    nom: string;
    mode: string;
    attributs: {
      id: string;
      cle: string;
      libelle: string;
      type: string;
      obligatoire: boolean;
      options: { id: string; valeur: string; libelle: string }[];
    }[];
  }[];
}

export default async function PageNouvelleCommande() {
  const { corps } = await apiBackendAuthentifie<Categorie[]>("/api/admin/catalogue");
  const categories = corps.succes && corps.donnees ? corps.donnees : [];

  return (
    <>
      <EntetePage titre="Nouvelle commande" description="Créée au nom d'un client — par téléphone, e-mail ou au comptoir." />
      <FormulaireNouvelleCommande categories={categories} />
    </>
  );
}
