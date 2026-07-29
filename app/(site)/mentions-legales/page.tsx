import { apiBackend } from "@/lib/api-backend";
import { PageLegale } from "@/components/PageLegale";

export const metadata = { title: "Mentions légales" };

interface ParametresPublics {
  raisonSociale: string;
  adresse: string;
  ville: string;
  telephone: string;
  email: string;
  nif: string | null;
}

async function chargerParametres(): Promise<ParametresPublics | null> {
  try {
    const { corps } = await apiBackend<ParametresPublics>("/api/parametres-publics", { revalidate: 300 });
    return corps.succes && corps.donnees ? corps.donnees : null;
  } catch {
    return null;
  }
}

export default async function PageMentionsLegales() {
  const p = await chargerParametres();
  const raisonSociale = p?.raisonSociale ?? "Kingo's";
  const adresse = p ? `${p.adresse}, ${p.ville}, Haïti` : "adresse à compléter";
  const telephone = p?.telephone ?? "à compléter";
  const email = p?.email ?? "à compléter";

  return (
    <PageLegale titre="Mentions légales">
      <h2>Éditeur du site</h2>
      <p>
        Le présent site est édité par <strong>{raisonSociale}</strong>, entreprise d&apos;impression et de
        conception graphique établie en Haïti.
      </p>
      <ul>
        <li>Raison sociale : {raisonSociale}</li>
        <li>Adresse : {adresse}</li>
        <li>Téléphone : {telephone}</li>
        <li>E-mail : {email}</li>
        {p?.nif && <li>NIF : {p.nif}</li>}
      </ul>
      <p>
        Forme juridique, capital social et numéro d&apos;immatriculation à préciser ici une fois l&apos;entreprise
        formellement enregistrée auprès des autorités compétentes.
      </p>

      <h2>Directeur de la publication</h2>
      <p>Le responsable de la publication du site est le représentant légal de {raisonSociale} — nom à préciser.</p>

      <h2>Hébergement</h2>
      <p>
        Le site vitrine est hébergé par Vercel Inc. L&apos;application de gestion (devis, commandes, factures) est
        hébergée par Railway Corporation. Les fichiers et documents (visuels, devis, factures) sont stockés chez
        Cloudinary Ltd. Ces prestataires techniques n&apos;ont pas accès au contenu des documents à des fins autres
        que l&apos;hébergement du service.
      </p>

      <h2>Propriété intellectuelle</h2>
      <p>
        Le nom « Kingo&apos;s », le logo, la charte graphique et l&apos;ensemble des contenus du site (textes,
        images, structure) sont la propriété de {raisonSociale}, sauf mention contraire, et ne peuvent être
        reproduits sans autorisation écrite préalable.
      </p>

      <h2>Contact</h2>
      <p>
        Pour toute question relative au site ou à ces mentions légales, contactez-nous à {email} ou au {telephone}.
      </p>
    </PageLegale>
  );
}
