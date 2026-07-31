"use client";

import { useEffect, useRef, useState, useCallback } from "react";

const INTERVALLE_LISTE_MS = 8000;
const INTERVALLE_FIL_MS = 4000;

interface Message {
  id: string;
  expediteur: "CLIENT" | "STAFF";
  contenu: string;
  creeLe: string;
}

interface ConversationResume {
  id: string;
  nomContact: string;
  emailContact: string;
  telContact: string | null;
  statut: "OUVERTE" | "FERMEE";
  origineSansAgent: boolean;
  derniereActiviteLe: string;
  dernierMessage: Message | null;
  nbNonLus: number;
}

interface ConversationDetail {
  id: string;
  nomContact: string;
  emailContact: string;
  telContact: string | null;
  statut: "OUVERTE" | "FERMEE";
  origineSansAgent: boolean;
  messages: Message[];
}

function formaterHeure(iso: string) {
  return new Date(iso).toLocaleString("fr-HT", { dateStyle: "short", timeStyle: "short", timeZone: "America/Port-au-Prince" });
}

export function PanneauSupport() {
  const [conversations, setConversations] = useState<ConversationResume[]>([]);
  const [selectionId, setSelectionId] = useState<string | null>(null);
  const [detail, setDetail] = useState<ConversationDetail | null>(null);
  const [disponible, setDisponible] = useState(false);
  const [texte, setTexte] = useState("");
  const [envoiEnCours, setEnvoiEnCours] = useState(false);
  const finFilRef = useRef<HTMLDivElement>(null);

  const chargerListe = useCallback(async () => {
    const reponse = await fetch("/api/admin/support/conversations");
    const corps = await reponse.json();
    if (corps.succes) setConversations(corps.donnees);
  }, []);

  const chargerDetail = useCallback(async (id: string) => {
    const reponse = await fetch(`/api/admin/support/conversations/${id}`);
    const corps = await reponse.json();
    if (corps.succes) setDetail(corps.donnees);
  }, []);

  useEffect(() => {
    chargerListe();
    fetch("/api/admin/support/disponibilite")
      .then((r) => r.json())
      .then((corps) => corps.succes && setDisponible(corps.donnees.disponibleSupport));
    const minuteur = setInterval(chargerListe, INTERVALLE_LISTE_MS);
    return () => clearInterval(minuteur);
  }, [chargerListe]);

  useEffect(() => {
    if (!selectionId) return;
    chargerDetail(selectionId);
    const minuteur = setInterval(() => chargerDetail(selectionId), INTERVALLE_FIL_MS);
    return () => clearInterval(minuteur);
  }, [selectionId, chargerDetail]);

  useEffect(() => {
    finFilRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [detail?.messages.length]);

  async function basculerDisponibilite() {
    const nouvelleValeur = !disponible;
    setDisponible(nouvelleValeur);
    await fetch("/api/admin/support/disponibilite", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ disponible: nouvelleValeur }),
    });
  }

  async function envoyer(e: React.FormEvent) {
    e.preventDefault();
    if (!selectionId || !texte.trim()) return;
    setEnvoiEnCours(true);
    try {
      await fetch(`/api/admin/support/conversations/${selectionId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contenu: texte.trim() }),
      });
      setTexte("");
      await chargerDetail(selectionId);
      await chargerListe();
    } finally {
      setEnvoiEnCours(false);
    }
  }

  async function fermer() {
    if (!selectionId) return;
    await fetch(`/api/admin/support/conversations/${selectionId}/fermer`, { method: "POST" });
    await chargerDetail(selectionId);
    await chargerListe();
  }

  return (
    <div className="grid gap-5 lg:grid-cols-[320px_1fr]">
      <div className="rounded-xl border border-marine-100 bg-white shadow-sm">
        <div className="flex items-center justify-between gap-2 border-b border-marine-100 p-4">
          <span className="text-sm font-bold text-marine-500">Ma disponibilité</span>
          <button
            type="button"
            onClick={basculerDisponibilite}
            className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${disponible ? "bg-foret-500" : "bg-marine-100"}`}
          >
            <span
              className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${disponible ? "translate-x-5" : "translate-x-0"}`}
            />
          </button>
        </div>
        <p className="border-b border-marine-100 px-4 py-2 text-xs text-marine-400">
          {disponible
            ? "Le chat public affiche le mode direct — les visiteurs vous voient disponible."
            : "Chat en veille — les visiteurs laissent leurs coordonnées pour un suivi ultérieur."}
        </p>

        <ul className="max-h-[65vh] divide-y divide-marine-100 overflow-y-auto">
          {conversations.length === 0 && <li className="px-4 py-8 text-center text-sm text-marine-400">Aucune conversation.</li>}
          {conversations.map((c) => (
            <li key={c.id}>
              <button
                type="button"
                onClick={() => setSelectionId(c.id)}
                className={`block w-full px-4 py-3 text-left transition-colors hover:bg-creme-100 ${selectionId === c.id ? "bg-creme-100" : ""}`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="truncate text-sm font-bold text-marine-500">{c.nomContact}</span>
                  {c.nbNonLus > 0 && (
                    <span className="flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-magenta-500 px-1 text-[10px] font-bold text-white">
                      {c.nbNonLus}
                    </span>
                  )}
                </div>
                <p className="mt-0.5 truncate text-xs text-marine-400">{c.dernierMessage?.contenu ?? "—"}</p>
                <div className="mt-1 flex items-center gap-1.5">
                  {c.origineSansAgent && (
                    <span className="rounded-full bg-lime-100 px-1.5 py-0.5 text-[9px] font-bold uppercase text-lime-700">
                      Laissé pour suivi
                    </span>
                  )}
                  {c.statut === "FERMEE" && (
                    <span className="rounded-full bg-marine-50 px-1.5 py-0.5 text-[9px] font-bold uppercase text-marine-400">Fermée</span>
                  )}
                  <span className="ml-auto text-[10px] text-marine-300">{formaterHeure(c.derniereActiviteLe)}</span>
                </div>
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex min-h-[65vh] flex-col rounded-xl border border-marine-100 bg-white shadow-sm">
        {!detail ? (
          <div className="flex flex-1 items-center justify-center text-sm text-marine-400">
            Sélectionnez une conversation.
          </div>
        ) : (
          <>
            <div className="flex items-start justify-between gap-3 border-b border-marine-100 p-4">
              <div>
                <p className="font-bold text-marine-500">{detail.nomContact}</p>
                <p className="text-xs text-marine-400">
                  {detail.emailContact}
                  {detail.telContact && ` · ${detail.telContact}`}
                </p>
              </div>
              {detail.statut === "OUVERTE" && (
                <button type="button" onClick={fermer} className="text-xs font-bold text-marine-400 hover:text-magenta-500 hover:underline">
                  Fermer la conversation
                </button>
              )}
            </div>

            <div className="flex-1 space-y-3 overflow-y-auto p-4">
              {detail.messages.map((m) => (
                <div key={m.id} className={`flex ${m.expediteur === "STAFF" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[75%] rounded-marque px-3 py-2 text-sm ${
                      m.expediteur === "STAFF" ? "bg-magenta-500 text-white" : "bg-creme-100 text-marine-500"
                    }`}
                  >
                    <p>{m.contenu}</p>
                    <p className={`mt-1 text-[10px] ${m.expediteur === "STAFF" ? "text-white/70" : "text-marine-300"}`}>
                      {formaterHeure(m.creeLe)}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={finFilRef} />
            </div>

            <form onSubmit={envoyer} className="flex gap-2 border-t border-marine-100 p-3">
              <input
                value={texte}
                onChange={(e) => setTexte(e.target.value)}
                placeholder="Écrire une réponse…"
                className="flex-1 rounded-marque border border-marine-100 px-3 py-2 text-sm"
              />
              <button
                type="submit"
                disabled={envoiEnCours || !texte.trim()}
                className="rounded-marque bg-magenta-500 px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-magenta-600 disabled:opacity-50"
              >
                Envoyer
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
