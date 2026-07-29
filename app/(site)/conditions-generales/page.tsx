import { apiBackend } from "@/lib/api-backend";
import { PageLegale } from "@/components/PageLegale";

export const metadata = { title: "Conditions générales de vente" };

interface ParametresPublics {
  raisonSociale: string;
  adresse: string;
  ville: string;
  telephone: string;
  email: string;
}

async function chargerParametres(): Promise<ParametresPublics | null> {
  try {
    const { corps } = await apiBackend<ParametresPublics>("/api/parametres-publics", { revalidate: 300 });
    return corps.succes && corps.donnees ? corps.donnees : null;
  } catch {
    return null;
  }
}

export default async function PageConditionsGenerales() {
  const p = await chargerParametres();
  const raisonSociale = p?.raisonSociale ?? "Kingo's";
  const adresse = p ? `${p.adresse}, ${p.ville}, Haïti` : "adresse à compléter";
  const telephone = p?.telephone ?? "à compléter";
  const email = p?.email ?? "à compléter";

  return (
    <PageLegale titre="Conditions générales de vente">
      <h2>1. Objet</h2>
      <p>
        Les présentes conditions régissent les commandes de services d&apos;impression grand format, textile et de
        conception graphique passées auprès de {raisonSociale} ({adresse}), que ce soit via le site, par téléphone,
        ou directement au comptoir. Toute commande implique l&apos;acceptation pleine et entière de ces conditions.
      </p>

      <h2>2. Devis</h2>
      <p>
        Un devis établi à partir du configurateur du site ou par notre équipe est valable 15 jours à compter de sa
        date d&apos;émission, sauf mention contraire indiquée sur le document. Passé ce délai, un nouveau devis peut
        être nécessaire si nos tarifs ont évolué. Le devis n&apos;engage {raisonSociale} qu&apos;après acceptation
        expresse du client et, le cas échéant, réception d&apos;un acompte ou du paiement intégral.
      </p>

      <h2>3. Commande et paiement</h2>
      <p>
        La commande est confirmée à réception du paiement, selon les modalités indiquées sur la facture : espèces,
        virement bancaire, chèque, ou MonCash lorsque ce moyen est proposé. Les montants sont exprimés en gourdes
        haïtiennes (HTG). Pour un règlement par chèque, la commande n&apos;est considérée comme payée qu&apos;après
        encaissement effectif du chèque.
      </p>
      <p>
        Pour un client institutionnel ou une entreprise avec un délai de règlement convenu, une échéance de paiement
        peut être fixée sur la facture. Le non-respect de cette échéance peut suspendre le traitement de commandes
        ultérieures.
      </p>

      <h2>4. Fichiers fournis par le client</h2>
      <p>
        Le client est responsable de la qualité, de la résolution et de la conformité des fichiers transmis pour
        l&apos;impression. {raisonSociale} peut signaler un problème visible (résolution insuffisante, format non
        conforme) mais n&apos;est pas tenu de corriger le contenu fourni. Un bon à tirer (BAT) peut être proposé
        avant lancement en production pour les commandes qui le justifient ; sa validation par le client engage sa
        responsabilité sur le rendu final.
      </p>

      <h2>5. Délais de production et livraison</h2>
      <p>
        Le délai indiqué sur le devis ou la commande démarre à compter de la réception du paiement (ou de
        l&apos;acompte convenu) et d&apos;un fichier conforme. La commande est disponible en retrait à
        l&apos;atelier ({adresse}), ou livrée à Port-au-Prince ou en province selon l&apos;option choisie ; des
        frais de livraison peuvent s&apos;appliquer. {raisonSociale} ne peut être tenu responsable d&apos;un retard
        causé par un cas de force majeure ou par un fichier client non conforme fourni tardivement.
      </p>

      <h2>6. Réception et réclamations</h2>
      <p>
        Le client est invité à vérifier la conformité de la commande dès la remise ou la livraison. Toute
        réclamation relative à un défaut apparent (impression, découpe, finition) doit être signalée dans les 48
        heures suivant la réception ; passé ce délai, la commande est considérée acceptée.
      </p>

      <h2>7. Propriété intellectuelle</h2>
      <p>
        Les fichiers fournis par le client restent sa propriété ; il garantit détenir les droits nécessaires sur
        les visuels, marques et contenus transmis pour impression. Les créations réalisées par {raisonSociale}
        dans le cadre d&apos;une prestation de conception graphique demeurent la propriété de {raisonSociale}
        jusqu&apos;au règlement intégral de la facture correspondante.
      </p>

      <h2>8. Annulation</h2>
      <p>
        Une commande peut être annulée tant qu&apos;elle n&apos;est pas entrée en production. Un travail déjà lancé
        en production (impression, découpe, façonnage) ne peut plus être annulé. Une facture déjà réglée, même
        partiellement, ne peut être annulée directement — un remboursement éventuel se traite au cas par cas avec
        notre équipe.
      </p>

      <h2>9. Droit applicable</h2>
      <p>
        Les présentes conditions sont soumises au droit haïtien. Tout litige relatif à leur interprétation ou à
        leur exécution relève de la compétence des juridictions compétentes en Haïti.
      </p>

      <h2>10. Contact</h2>
      <p>
        Pour toute question relative à une commande ou à ces conditions, contactez-nous à {email} ou au {telephone}.
      </p>
    </PageLegale>
  );
}
