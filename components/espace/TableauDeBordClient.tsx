import { formaterHTG } from "@/lib/types-catalogue";
import { BadgeStatut } from "@/components/admin/BadgeStatut";

interface Commande {
  id: string;
  numero: string;
  statut: string;
  totalCents: string;
  creeLe: string;
  lignes: { serviceNom: string; quantite: number }[];
}
interface Devis {
  id: string;
  numero: string;
  statut: string;
  totalCents: string;
  creeLe: string;
  expireLe: string;
}
interface Facture {
  id: string;
  numero: string;
  statut: string;
  totalCents: string;
  payeCents: string;
  echeanceLe: string | null;
  creeLe: string;
}

export function TableauDeBordClient({ commandes, devis, factures }: { commandes: Commande[]; devis: Devis[]; factures: Facture[] }) {
  const facturesImpayees = factures.filter((f) => f.statut !== "PAYEE" && f.statut !== "ANNULEE");
  const facturesPayees = factures.filter((f) => f.statut === "PAYEE");

  return (
    <div className="space-y-8">
      {facturesImpayees.length > 0 && (
        <div className="rounded-marque border border-magenta-100 bg-magenta-50 p-5">
          <h2 className="text-sm font-bold text-magenta-700">Factures en attente de paiement</h2>
          <ul className="mt-3 divide-y divide-magenta-100">
            {facturesImpayees.map((f) => (
              <li key={f.id} className="flex items-center gap-3 py-2 text-sm">
                <span className="flex-1 font-bold text-marine-500">{f.numero}</span>
                <BadgeStatut statut={f.statut} />
                <span className="w-32 text-right font-bold tabular-nums text-marine-500">
                  {formaterHTG((BigInt(f.totalCents) - BigInt(f.payeCents)).toString())} restant
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="rounded-marque border border-marine-100 bg-white">
        <div className="border-b border-marine-100 px-5 py-4">
          <h2 className="text-sm font-bold text-marine-500">Mes commandes ({commandes.length})</h2>
        </div>
        {commandes.length === 0 ? (
          <p className="px-5 py-8 text-center text-sm text-marine-400">Aucune commande pour l&apos;instant.</p>
        ) : (
          <ul className="divide-y divide-marine-100">
            {commandes.map((c) => (
              <li key={c.id} className="flex items-center gap-3 px-5 py-3 text-sm">
                <div className="flex-1">
                  <p className="font-bold text-marine-500">{c.numero}</p>
                  <p className="text-xs text-marine-400">{c.lignes[0]?.serviceNom ?? "—"}</p>
                </div>
                <BadgeStatut statut={c.statut} />
                <span className="w-24 text-right font-bold tabular-nums text-marine-500">{formaterHTG(c.totalCents)}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="rounded-marque border border-marine-100 bg-white">
          <div className="border-b border-marine-100 px-5 py-4">
            <h2 className="text-sm font-bold text-marine-500">Mes devis ({devis.length})</h2>
          </div>
          {devis.length === 0 ? (
            <p className="px-5 py-8 text-center text-sm text-marine-400">Aucun devis.</p>
          ) : (
            <ul className="divide-y divide-marine-100">
              {devis.map((d) => (
                <li key={d.id} className="flex items-center gap-3 px-5 py-3 text-sm">
                  <span className="flex-1 font-bold text-marine-500">{d.numero}</span>
                  <BadgeStatut statut={d.statut} />
                  <span className="w-24 text-right font-bold tabular-nums text-marine-500">{formaterHTG(d.totalCents)}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="rounded-marque border border-marine-100 bg-white">
          <div className="border-b border-marine-100 px-5 py-4">
            <h2 className="text-sm font-bold text-marine-500">Factures payées ({facturesPayees.length})</h2>
          </div>
          {facturesPayees.length === 0 ? (
            <p className="px-5 py-8 text-center text-sm text-marine-400">Aucune facture payée pour l&apos;instant.</p>
          ) : (
            <ul className="divide-y divide-marine-100">
              {facturesPayees.map((f) => (
                <li key={f.id} className="flex items-center gap-3 px-5 py-3 text-sm">
                  <span className="flex-1 font-bold text-marine-500">{f.numero}</span>
                  <span className="text-right font-bold tabular-nums text-marine-500">{formaterHTG(f.totalCents)}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
