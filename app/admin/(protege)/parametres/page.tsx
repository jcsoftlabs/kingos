import { apiBackendAuthentifie, obtenirUtilisateurCourant } from "@/lib/auth-serveur";
import { FormulaireParametres } from "@/components/admin/parametres/FormulaireParametres";
import { EntetePage } from "@/components/admin/EntetePage";

export const metadata = { title: "Paramètres — Admin" };

export interface ParametresEntreprise {
  raisonSociale: string;
  adresse: string;
  ville: string;
  telephone: string;
  email: string;
  siteWeb: string | null;
  nif: string | null;
  banques: { banque: string; titulaire: string; numeroCompte: string; type?: string }[];
  moncashNumero: string | null;
  natcashNumero: string | null;
  conditionsDevis: string;
  conditionsFacture: string;
  tauxTaxePct: string;
  tauxChangeUSD: string | null;
}

export default async function PageParametresAdmin() {
  const utilisateurCourant = await obtenirUtilisateurCourant();
  const peutModifier = utilisateurCourant?.role === "SUPER_ADMIN" || utilisateurCourant?.role === "ADMIN";

  const { corps } = await apiBackendAuthentifie<ParametresEntreprise>("/api/admin/parametres");
  const parametres = corps.succes && corps.donnees ? corps.donnees : null;

  return (
    <>
      <EntetePage
        titre="Paramètres de l'entreprise"
        description="Ces informations apparaissent sur tous les devis, factures et reçus — un changement d'adresse ou de téléphone se fait ici, sans redéploiement."
      />

      <div className="max-w-3xl rounded-xl border border-marine-100 bg-white p-6 shadow-sm">
        {parametres ? (
          <FormulaireParametres parametres={parametres} lectureSeule={!peutModifier} />
        ) : (
          <p className="text-marine-400">Impossible de charger les paramètres.</p>
        )}
      </div>
    </>
  );
}
