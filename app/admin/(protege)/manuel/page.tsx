import Link from "next/link";
import { EntetePage } from "@/components/admin/EntetePage";

export const metadata = { title: "Manuel d'utilisation — Admin" };

interface Etape {
  titre: string;
  texte: string;
}

function Section({ id, titre, description, children }: { id: string; titre: string; description?: string; children: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-6 rounded-xl border border-marine-100 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-extrabold text-marine-500">{titre}</h2>
      {description && <p className="mt-1 text-sm text-marine-400">{description}</p>}
      <div className="mt-4 space-y-4">{children}</div>
    </section>
  );
}

function Etapes({ items }: { items: Etape[] }) {
  return (
    <ol className="space-y-3">
      {items.map((e, i) => (
        <li key={i} className="flex gap-3">
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-magenta-50 text-xs font-bold text-magenta-600">
            {i + 1}
          </span>
          <div>
            <p className="text-sm font-bold text-marine-500">{e.titre}</p>
            <p className="text-sm text-marine-400">{e.texte}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}

function Astuce({ children }: { children: React.ReactNode }) {
  return <p className="rounded-marque bg-creme-200 px-4 py-3 text-sm text-marine-500">💡 {children}</p>;
}

const SOMMAIRE = [
  { id: "commandes", titre: "Créer une commande et suivre son paiement" },
  { id: "vente-rapide", titre: "Vente rapide (guichet)" },
  { id: "cheques", titre: "Chèques en attente" },
  { id: "clients", titre: "Clients" },
  { id: "contrats", titre: "Contrats" },
  { id: "support", titre: "Chat Support" },
  { id: "demandes", titre: "Demandes spéciales" },
  { id: "inventaire", titre: "Inventaire" },
  { id: "catalogue", titre: "Catalogue" },
  { id: "parametres", titre: "Paramètres de l'entreprise" },
];

export default function PageManuelAdmin() {
  return (
    <>
      <EntetePage
        titre="Manuel d'utilisation"
        description="Comment faire les tâches courantes du back-office, étape par étape — pas de jargon technique."
      />

      <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
        <nav className="h-fit rounded-xl border border-marine-100 bg-white p-4 shadow-sm lg:sticky lg:top-6">
          <p className="px-1 pb-2 text-[11px] font-bold uppercase tracking-wide text-marine-300">Sommaire</p>
          <ul className="space-y-0.5">
            {SOMMAIRE.map((s) => (
              <li key={s.id}>
                <a href={`#${s.id}`} className="block rounded-marque px-2 py-1.5 text-sm text-marine-400 hover:bg-creme-100 hover:text-magenta-500">
                  {s.titre}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="space-y-6">
          <Section
            id="commandes"
            titre="Créer une commande et suivre son paiement"
            description="Le chemin normal d'un client qui commande un service du catalogue."
          >
            <Etapes
              items={[
                { titre: "Nouvelle commande", texte: "Menu Commandes → « Nouvelle commande ». Cherchez le client par nom, e-mail ou téléphone — s'il existe déjà, ses coordonnées se remplissent seules. Sinon, remplissez-les à la main." },
                { titre: "Ajoutez les lignes", texte: "Choisissez un service, une quantité, et pour les services au pied carré (bannières, etc.) une hauteur et une largeur — vous pouvez saisir en pouces, pieds, mètres, millimètres ou yards." },
                { titre: "Générer le devis", texte: "Une fois la commande créée, ouvrez-la et cliquez « Générer le devis ». Le client reçoit un PDF avec le prix, valable 15 jours." },
                { titre: "Marquer le devis accepté", texte: "Quand le client confirme (par téléphone, en personne, par e-mail), cliquez « Marquer le devis accepté »." },
                { titre: "Émettre la facture", texte: "Cliquez « Émettre la facture » — elle reprend les montants du devis. C'est ce document que le client règle." },
                { titre: "Enregistrer un paiement", texte: "Sur la facture, « Enregistrer un paiement » : choisissez espèces, virement ou chèque, et le montant. Un paiement partiel est accepté — le solde restant s'affiche automatiquement." },
              ]}
            />
            <Astuce>
              Un chèque n'est considéré payé qu'une fois encaissé — voir la section « Chèques en attente » plus bas.
            </Astuce>
          </Section>

          <Section
            id="vente-rapide"
            titre="Vente rapide (guichet)"
            description="Pour un travail remis sur place tout de suite (photocopies, plastification…), sans passer par le catalogue ni un devis."
          >
            <Etapes
              items={[
                { titre: "Menu Vente rapide", texte: "Choisissez « Client de passage » si vous ne connaissez pas le client, ou « Client identifié » pour renseigner ses coordonnées." },
                { titre: "Décrivez chaque article", texte: "Une ligne = une description libre (ex. « Photocopies 40 pages ») + un prix que vous fixez vous-même." },
                { titre: "Encaisser et imprimer le reçu", texte: "La vente est enregistrée comme déjà payée — un reçu s'imprime immédiatement." },
              ]}
            />
          </Section>

          <Section
            id="cheques"
            titre="Chèques en attente"
            description="Un paiement par chèque n'est pas définitif tant qu'il n'est pas passé en banque."
          >
            <Etapes
              items={[
                { titre: "Menu Chèques en attente", texte: "Liste tous les chèques enregistrés mais pas encore encaissés." },
                { titre: "Encaisser", texte: "Une fois le chèque réellement déposé et validé en banque — la facture concernée passe payée (ou partiellement payée)." },
                { titre: "Rejeter", texte: "Si le chèque revient sans provision — annule le paiement, la facture redevient impayée." },
              ]}
            />
          </Section>

          <Section id="clients" titre="Clients" description="Chaque client existe soit parce qu'il a déjà commandé, soit parce qu'on l'a entré à la main.">
            <Etapes
              items={[
                { titre: "Nouveau client", texte: "Menu Clients → « Nouveau client », pour entrer quelqu'un qui n'a pas encore commandé (ex. import d'un ancien fichier client)." },
                { titre: "Import CSV", texte: "Pour entrer toute une liste d'un coup : « Télécharger le modèle » (fichier exemple), le remplir, puis l'importer. Réimporter le même fichier corrigé ne crée pas de doublons." },
                { titre: "Modifier une fiche", texte: "Sur la fiche client, « Modifier » pour corriger téléphone, adresse ou type de client." },
              ]}
            />
          </Section>

          <Section
            id="contrats"
            titre="Contrats"
            description="Pour un client régulier (école, entreprise) avec des conditions négociées une fois pour toutes."
          >
            <Etapes
              items={[
                { titre: "Nouveau contrat", texte: "Menu Contrats → « Nouveau contrat ». Cherchez le client comme pour une commande, décrivez l'objet, et notez la remise et le délai de paiement convenus." },
                { titre: "Rattacher une commande", texte: "En créant une commande pour ce client, un menu « Rattacher à un contrat » apparaît automatiquement s'il a un contrat actif. C'est facultatif — ça sert juste à retrouver plus tard toutes les commandes d'un même contrat." },
                { titre: "Changer le statut", texte: "Sur la fiche du contrat : Actif, Suspendu, Résilié ou Expiré." },
              ]}
            />
            <Astuce>
              Rattacher une commande à un contrat n'applique pas la remise automatiquement — c'est un rappel pour vous, pas un calcul. La remise se saisit toujours à la main sur la commande.
            </Astuce>
          </Section>

          <Section
            id="support"
            titre="Chat Support"
            description="La bulle de discussion visible sur le site vitrine, en bas à droite."
          >
            <Etapes
              items={[
                { titre: "Activer ma disponibilité", texte: "Menu Support → basculez « Ma disponibilité » sur ON quand vous pouvez répondre en direct." },
                { titre: "Répondre", texte: "Cliquez une conversation dans la liste, tapez la réponse en bas, « Envoyer »." },
                { titre: "Sans agent disponible", texte: "Si personne n'a activé sa disponibilité, le visiteur laisse quand même son message — il apparaît marqué « Laissé pour suivi », à traiter dès que possible." },
              ]}
            />
            <Astuce>N'oubliez pas de désactiver votre disponibilité en partant — sinon le site affiche « agent disponible » alors que personne ne répond.</Astuce>
          </Section>

          <Section
            id="demandes"
            titre="Demandes spéciales"
            description="Un besoin qui ne rentre pas dans le configurateur de devis (service sur mesure, réparation, conseil)."
          >
            <Etapes
              items={[
                { titre: "Menu Demandes", texte: "Chaque demande montre le besoin décrit par le client, son e-mail et son téléphone." },
                { titre: "Ouvrir une demande", texte: "Changez le statut (Nouvelle → En cours → Traitée ou Rejetée) et notez ce qui a été convenu dans « Notes internes »." },
              ]}
            />
          </Section>

          <Section
            id="inventaire"
            titre="Inventaire"
            description="Suivi du stock de matières premières (vinyle, encre, t-shirts vierges…)."
          >
            <Etapes
              items={[
                { titre: "Nouvel article", texte: "Menu Inventaires → « Nouvel article » : nom, unité (rouleau, litre, pièce…), quantité actuelle et seuil d'alerte." },
                { titre: "Enregistrer un mouvement", texte: "Sur la fiche d'un article : Entrée (réapprovisionnement), Sortie (utilisé), ou Ajustement (correction après un inventaire physique)." },
                { titre: "Alerte automatique", texte: "Un badge apparaît dans le menu quand un article passe sous son seuil — pensez à recommander." },
              ]}
            />
            <Astuce>
              Si un service du catalogue est relié à un article (dans sa fiche, section « Consommation »), le stock se décrémente tout seul quand une commande utilisant ce service passe en production.
            </Astuce>
          </Section>

          <Section id="catalogue" titre="Catalogue" description="Les services proposés aux clients, avec leurs prix et options.">
            <Etapes
              items={[
                { titre: "Nouveau service / catégorie", texte: "Menu Catalogue → formulaires en haut de page." },
                { titre: "Import CSV", texte: "Pour ajouter ou corriger plusieurs services d'un coup — même principe que l'import de clients : télécharger le modèle, le remplir, l'importer." },
                { titre: "Attributs (matériau, finition…)", texte: "Se gèrent service par service, après création, depuis sa fiche." },
              ]}
            />
          </Section>

          <Section
            id="parametres"
            titre="Paramètres de l'entreprise"
            description="Coordonnées, comptes bancaires, taxe et taux de change — utilisés sur tous les devis et factures."
          >
            <Etapes
              items={[
                { titre: "Coordonnées", texte: "Adresse, téléphone, NIF — affichés en en-tête de chaque document." },
                { titre: "Comptes bancaires / MonCash", texte: "Affichés dans la section « Modalités de paiement » des factures non payées." },
                { titre: "Taux de change (HTG/USD)", texte: "Une fois renseigné, chaque facture affiche automatiquement l'équivalent en dollars à côté du montant en gourdes." },
              ]}
            />
            <Astuce>Un changement ici s'applique aux prochains documents seulement — une facture déjà émise ne change jamais après coup.</Astuce>
          </Section>

          <p className="text-center text-xs text-marine-300">
            Une question qui n&apos;est pas couverte ici ? <Link href="/admin" className="font-bold text-magenta-500 hover:underline">Retour au tableau de bord</Link>
          </p>
        </div>
      </div>
    </>
  );
}
