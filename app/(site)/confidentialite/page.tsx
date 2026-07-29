import { apiBackend } from "@/lib/api-backend";
import { PageLegale } from "@/components/PageLegale";

export const metadata = { title: "Politique de confidentialité" };

interface ParametresPublics {
  raisonSociale: string;
  email: string;
  telephone: string;
}

async function chargerParametres(): Promise<ParametresPublics | null> {
  try {
    const { corps } = await apiBackend<ParametresPublics>("/api/parametres-publics", { revalidate: 300 });
    return corps.succes && corps.donnees ? corps.donnees : null;
  } catch {
    return null;
  }
}

export default async function PageConfidentialite() {
  const p = await chargerParametres();
  const raisonSociale = p?.raisonSociale ?? "Kingo's";
  const email = p?.email ?? "à compléter";

  return (
    <PageLegale titre="Politique de confidentialité">
      <p>
        {raisonSociale} respecte la confidentialité des informations que vous nous communiquez lorsque vous demandez
        un devis, passez commande, ou créez un compte. Cette page explique quelles données nous collectons,
        pourquoi, et comment vous pouvez en garder le contrôle.
      </p>

      <h2>Données que nous collectons</h2>
      <ul>
        <li>Identité et contact : nom, e-mail, numéro de téléphone, nom d&apos;entreprise le cas échéant.</li>
        <li>Adresse de livraison, lorsque vous demandez une livraison plutôt qu&apos;un retrait en atelier.</li>
        <li>
          Détails de commande : services demandés, spécifications (dimensions, quantités, options), montants,
          historique des devis et factures.
        </li>
        <li>Fichiers que vous téléversez pour l&apos;impression (visuels, logos, documents graphiques).</li>
        <li>Justificatifs de paiement (moyen de paiement utilisé, référence de transaction) — jamais vos identifiants bancaires complets.</li>
      </ul>

      <h2>Pourquoi nous les utilisons</h2>
      <ul>
        <li>Établir vos devis et factures, produire et livrer vos commandes.</li>
        <li>Vous informer de l&apos;avancement de votre commande (devis envoyé, facture émise, paiement confirmé).</li>
        <li>Vous permettre d&apos;accéder à votre espace client et à l&apos;historique de vos commandes.</li>
        <li>Répondre à vos demandes envoyées via le formulaire de contact.</li>
      </ul>
      <p>Nous n&apos;utilisons pas vos données à des fins de publicité ciblée et ne les vendons à personne.</p>

      <h2>Avec qui vos données sont partagées</h2>
      <p>
        Certaines données transitent par des prestataires techniques qui nous aident à faire fonctionner le
        service, uniquement pour cet usage :
      </p>
      <ul>
        <li>Cloudinary — stockage sécurisé de vos fichiers et documents (devis, factures).</li>
        <li>Resend — envoi des e-mails transactionnels (confirmation de commande, devis, factures, code de connexion).</li>
        <li>Railway et Vercel — hébergement de l&apos;application et du site.</li>
      </ul>

      <h2>Connexion sans mot de passe</h2>
      <p>
        L&apos;accès à votre espace client se fait par un code à usage unique envoyé par e-mail, jamais par mot de
        passe stocké en clair. Ce code expire après 10 minutes et ne peut être utilisé qu&apos;une seule fois.
      </p>

      <h2>Durée de conservation</h2>
      <p>
        Vos données de commande, devis et facturation sont conservées aussi longtemps que nécessaire pour nos
        obligations comptables et commerciales. Vous pouvez demander la suppression des données qui ne sont plus
        nécessaires à ces obligations.
      </p>

      <h2>Vos droits</h2>
      <p>
        Vous pouvez demander l&apos;accès, la correction ou la suppression de vos données personnelles en nous
        écrivant à {email}. Nous répondrons dans un délai raisonnable.
      </p>

      <h2>Cookies</h2>
      <p>
        Le site utilise un unique cookie technique, nécessaire à votre connexion (session sécurisée, non accessible
        en JavaScript). Aucun cookie de suivi publicitaire n&apos;est utilisé.
      </p>
    </PageLegale>
  );
}
