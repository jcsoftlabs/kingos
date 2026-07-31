import Link from "next/link";
import { notFound } from "next/navigation";
import { apiBackendAuthentifie } from "@/lib/auth-serveur";
import { EntetePage } from "@/components/admin/EntetePage";
import { PanneauStatutDemande } from "@/components/admin/demandes/PanneauStatutDemande";

interface Demande {
  id: string;
  nomContact: string;
  emailContact: string;
  telContact: string | null;
  description: string;
  statut: string;
  notesInternes: string | null;
  creeLe: string;
  traiteeLe: string | null;
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { corps } = await apiBackendAuthentifie<Demande>(`/api/admin/demandes/${id}`);
  return { title: `${corps.donnees?.nomContact ?? "Demande"} — Admin` };
}

export default async function PageDemandeAdmin({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { corps } = await apiBackendAuthentifie<Demande>(`/api/admin/demandes/${id}`);
  if (!corps.succes || !corps.donnees) notFound();
  const demande = corps.donnees;

  return (
    <>
      <Link href="/admin/demandes" className="text-xs font-bold text-marine-400 hover:text-magenta-500">
        ← Toutes les demandes
      </Link>

      <EntetePage
        titre={demande.nomContact}
        description={`Reçue le ${new Date(demande.creeLe).toLocaleString("fr-HT", { timeZone: "America/Port-au-Prince", dateStyle: "long", timeStyle: "short" })}`}
      />

      <div className="grid gap-5 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-5">
          <div className="rounded-xl border border-marine-100 bg-white p-5 shadow-sm">
            <h2 className="text-sm font-bold text-marine-500">Besoin décrit</h2>
            <p className="mt-3 whitespace-pre-wrap text-sm text-marine-500">{demande.description}</p>
          </div>
          <div className="rounded-xl border border-marine-100 bg-white p-5 shadow-sm">
            <h2 className="text-sm font-bold text-marine-500">Contact</h2>
            <dl className="mt-3 space-y-2 text-sm">
              <div>
                <dt className="text-xs text-marine-400">E-mail</dt>
                <dd className="font-medium text-marine-500">
                  <a href={`mailto:${demande.emailContact}`} className="hover:text-magenta-500 hover:underline">
                    {demande.emailContact}
                  </a>
                </dd>
              </div>
              {demande.telContact && (
                <div>
                  <dt className="text-xs text-marine-400">Téléphone</dt>
                  <dd className="font-medium text-marine-500">{demande.telContact}</dd>
                </div>
              )}
              {demande.traiteeLe && (
                <div>
                  <dt className="text-xs text-marine-400">Traitée le</dt>
                  <dd className="font-medium text-marine-500">
                    {new Date(demande.traiteeLe).toLocaleString("fr-HT", { timeZone: "America/Port-au-Prince", dateStyle: "long", timeStyle: "short" })}
                  </dd>
                </div>
              )}
            </dl>
          </div>
        </div>

        <PanneauStatutDemande demandeId={demande.id} statut={demande.statut} notesInternes={demande.notesInternes} />
      </div>
    </>
  );
}
