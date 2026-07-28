import { apiBackendAuthentifie, obtenirUtilisateurCourant } from "@/lib/auth-serveur";
import { FormulaireParametres } from "@/components/admin/parametres/FormulaireParametres";

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
    <div>
      <h1 className="text-2xl font-extrabold text-marine-500">Paramètres de l&apos;entreprise</h1>
      <p className="mt-2 max-w-2xl text-sm text-marine-400">
        Ces informations apparaissent sur tous les devis, factures et reçus — un changement d&apos;adresse ou de
        téléphone se fait ici, sans redéploiement.
      </p>

      <div className="mt-8 max-w-2xl">
        {parametres ? (
          <FormulaireParametres parametres={parametres} lectureSeule={!peutModifier} />
        ) : (
          <p className="text-marine-400">Impossible de charger les paramètres.</p>
        )}
      </div>
    </div>
  );
}
