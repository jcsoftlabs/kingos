import { notFound } from "next/navigation";
import Image from "next/image";
import { apiBackendAuthentifie } from "@/lib/auth-serveur";
import { formaterHTG } from "@/lib/types-catalogue";
import { BoutonImprimer } from "@/components/admin/BoutonImprimer";

export const dynamic = "force-dynamic";

interface LigneContenu {
  serviceNom: string;
  quantite: number;
  totalCents: string;
}

interface ContenuFacture {
  emetteur: { raisonSociale: string; adresse: string; ville: string; telephone: string };
  client: { nom: string; entreprise?: string | null };
  lignes: LigneContenu[];
  sousTotalCents: string;
  taxeCents: string;
  totalCents: string;
}

interface Facture {
  id: string;
  numero: string;
  statut: string;
  payeCents: string;
  totalCents: string;
  contenu: ContenuFacture;
  creeLe: string;
}

export async function generateMetadata({ params }: { params: Promise<{ numero: string }> }) {
  const { numero } = await params;
  return { title: `Reçu ${numero}` };
}

export default async function PageRecu({ params }: { params: Promise<{ numero: string }> }) {
  const { numero } = await params;
  const { corps } = await apiBackendAuthentifie<Facture>(`/api/factures/${numero}`);
  if (!corps.succes || !corps.donnees) notFound();
  const facture = corps.donnees;
  const { contenu } = facture;

  return (
    <div>
      <div className="mb-6 print:hidden">
        <BoutonImprimer />
      </div>

      {/* Format pensé pour une imprimante thermique 80mm — largeur fixe,
          typographie monospace, aucune couleur (la plupart des imprimantes
          de caisse sont noir et blanc). */}
      <div className="mx-auto w-[80mm] bg-white p-3 font-mono text-[11px] leading-tight text-black print:w-full">
        <div className="text-center">
          <Image
            src="/logo-kingos.png"
            alt={contenu.emetteur.raisonSociale}
            width={200}
            height={200}
            className="mx-auto h-10 w-auto grayscale"
          />
          <p className="mt-1 text-sm font-bold">{contenu.emetteur.raisonSociale.toUpperCase()}</p>
          <p>{contenu.emetteur.adresse}</p>
          <p>{contenu.emetteur.ville}</p>
          <p>{contenu.emetteur.telephone}</p>
        </div>

        <div className="my-2 border-t border-dashed border-black" />

        <p>Reçu : {facture.numero}</p>
        <p>Date : {new Date(facture.creeLe).toLocaleString("fr-HT", { timeZone: "America/Port-au-Prince" })}</p>
        <p>Client : {contenu.client.entreprise || contenu.client.nom}</p>

        <div className="my-2 border-t border-dashed border-black" />

        {contenu.lignes.map((ligne, i) => (
          <div key={i} className="mb-1">
            <p>{ligne.serviceNom}</p>
            <div className="flex justify-between">
              <span>× {ligne.quantite}</span>
              <span>{formaterHTG(ligne.totalCents)}</span>
            </div>
          </div>
        ))}

        <div className="my-2 border-t border-dashed border-black" />

        <div className="flex justify-between">
          <span>Sous-total</span>
          <span>{formaterHTG(contenu.sousTotalCents)}</span>
        </div>
        {Number(contenu.taxeCents) > 0 && (
          <div className="flex justify-between">
            <span>Taxe</span>
            <span>{formaterHTG(contenu.taxeCents)}</span>
          </div>
        )}
        <div className="mt-1 flex justify-between text-sm font-bold">
          <span>TOTAL</span>
          <span>{formaterHTG(contenu.totalCents)}</span>
        </div>
        <div className="flex justify-between">
          <span>Payé</span>
          <span>{formaterHTG(facture.payeCents)}</span>
        </div>

        <div className="my-2 border-t border-dashed border-black" />

        <p className="text-center">Merci de votre confiance !</p>
        <p className="text-center">Kingo&apos;s — print your natural like a reality</p>
      </div>
    </div>
  );
}
