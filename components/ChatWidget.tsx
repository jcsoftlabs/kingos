"use client";

import { useEffect, useRef, useState } from "react";

const CLE_STOCKAGE = "kingos_support_conversation_id";
const INTERVALLE_MS = 4000;

interface Message {
  id: string;
  expediteur: "CLIENT" | "STAFF";
  contenu: string;
  creeLe: string;
}

interface Conversation {
  id: string;
  statut: "OUVERTE" | "FERMEE";
  origineSansAgent: boolean;
  messages: Message[];
}

function IconeChat({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M4 4h16v12H8l-4 4z" />
    </svg>
  );
}

function IconeFermer({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" className={className}>
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}

/** Avatar de l'agent — visage stylisé, cheveux longs, pour humaniser le côté "réponse du staff" du fil. */
function AvatarAgente({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className}>
      <circle cx="16" cy="16" r="16" fill="#E6008C" />
      <path d="M16 6c-5 0-8 3.6-8 8.2 0 2 .4 3.6 1 5l1-.8c-.6-2-.6-9 6-9s6.6 7 6 9l1 .8c.6-1.4 1-3 1-5C24 9.6 21 6 16 6Z" fill="#1A124B" />
      <circle cx="16" cy="15.5" r="6" fill="#FBCCE9" />
      <circle cx="13.3" cy="15.5" r="0.9" fill="#1A124B" />
      <circle cx="18.7" cy="15.5" r="0.9" fill="#1A124B" />
      <path d="M13.5 18.3c1.6 1.2 3.4 1.2 5 0" fill="none" stroke="#1A124B" strokeWidth="1.1" strokeLinecap="round" />
      <path d="M6 27c1.5-4 4.8-6 10-6s8.5 2 10 6" fill="#1A124B" />
    </svg>
  );
}

export function ChatWidget() {
  const [ouvert, setOuvert] = useState(false);
  const [disponible, setDisponible] = useState(false);
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [coordonnees, setCoordonnees] = useState({ nomContact: "", emailContact: "", telContact: "" });
  const [premierMessage, setPremierMessage] = useState("");
  const [texte, setTexte] = useState("");
  const [enCours, setEnCours] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);
  const finFilRef = useRef<HTMLDivElement>(null);

  // Vérifie la disponibilité d'un agent, même quand le panneau est fermé —
  // pour proposer d'emblée le bon mode (chat en direct ou message pour suivi).
  useEffect(() => {
    function verifier() {
      fetch("/api/support/disponibilite")
        .then((r) => r.json())
        .then((corps) => corps.succes && setDisponible(corps.donnees.disponible))
        .catch(() => {});
    }
    verifier();
    const minuteur = setInterval(verifier, 30000);
    return () => clearInterval(minuteur);
  }, []);

  // Reprend une conversation déjà commencée sur cet appareil.
  useEffect(() => {
    const id = localStorage.getItem(CLE_STOCKAGE);
    if (!id) return;
    fetch(`/api/support/conversations/${id}`)
      .then((r) => r.json())
      .then((corps) => {
        if (corps.succes) setConversation(corps.donnees);
        else localStorage.removeItem(CLE_STOCKAGE);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!ouvert || !conversation) return;
    const minuteur = setInterval(() => {
      fetch(`/api/support/conversations/${conversation.id}`)
        .then((r) => r.json())
        .then((corps) => corps.succes && setConversation(corps.donnees));
    }, INTERVALLE_MS);
    return () => clearInterval(minuteur);
  }, [ouvert, conversation?.id, conversation]);

  useEffect(() => {
    finFilRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversation?.messages.length]);

  async function demarrer(e: React.FormEvent) {
    e.preventDefault();
    setEnCours(true);
    setErreur(null);
    try {
      const reponse = await fetch("/api/support/conversations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...coordonnees, telContact: coordonnees.telContact || undefined, message: premierMessage }),
      });
      const corps = await reponse.json();
      if (!corps.succes) {
        setErreur(corps.erreur?.message ?? "Impossible d'envoyer le message");
        return;
      }
      localStorage.setItem(CLE_STOCKAGE, corps.donnees.conversation.id);
      setConversation(corps.donnees.conversation);
    } catch {
      setErreur("Erreur réseau — réessayez dans un instant");
    } finally {
      setEnCours(false);
    }
  }

  async function envoyer(e: React.FormEvent) {
    e.preventDefault();
    if (!conversation || !texte.trim()) return;
    setEnCours(true);
    try {
      await fetch(`/api/support/conversations/${conversation.id}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contenu: texte.trim() }),
      });
      setTexte("");
      const reponse = await fetch(`/api/support/conversations/${conversation.id}`);
      const corps = await reponse.json();
      if (corps.succes) setConversation(corps.donnees);
    } finally {
      setEnCours(false);
    }
  }

  function nouvelleConversation() {
    localStorage.removeItem(CLE_STOCKAGE);
    setConversation(null);
    setCoordonnees({ nomContact: "", emailContact: "", telContact: "" });
    setPremierMessage("");
  }

  return (
    <div className="fixed bottom-5 right-5 z-50 print:hidden">
      {ouvert && (
        <div className="mb-3 flex h-[480px] w-[min(360px,calc(100vw-2.5rem))] flex-col overflow-hidden rounded-marque border border-marine-100 bg-white shadow-2xl">
          <div className="flex items-center justify-between bg-marine-500 px-4 py-3 text-white">
            <div>
              <p className="text-sm font-bold">Discuter avec Kingo&apos;s</p>
              <p className="text-[11px] text-marine-100">
                {disponible ? "Un agent est disponible" : "Laissez-nous un message, on vous recontacte"}
              </p>
            </div>
            <button type="button" onClick={() => setOuvert(false)} aria-label="Fermer" className="rounded-full p-1 hover:bg-white/10">
              <IconeFermer className="h-5 w-5" />
            </button>
          </div>

          {!conversation ? (
            <form onSubmit={demarrer} className="flex-1 space-y-3 overflow-y-auto p-4">
              <div>
                <label className="block text-xs font-bold text-marine-500">Nom</label>
                <input
                  required
                  value={coordonnees.nomContact}
                  onChange={(e) => setCoordonnees((c) => ({ ...c, nomContact: e.target.value }))}
                  className="mt-1 w-full rounded-marque border border-marine-100 px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-marine-500">E-mail</label>
                <input
                  required
                  type="email"
                  value={coordonnees.emailContact}
                  onChange={(e) => setCoordonnees((c) => ({ ...c, emailContact: e.target.value }))}
                  className="mt-1 w-full rounded-marque border border-marine-100 px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-marine-500">Téléphone (optionnel)</label>
                <input
                  value={coordonnees.telContact}
                  onChange={(e) => setCoordonnees((c) => ({ ...c, telContact: e.target.value }))}
                  placeholder="+509 ..."
                  className="mt-1 w-full rounded-marque border border-marine-100 px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-marine-500">Votre message</label>
                <textarea
                  required
                  rows={3}
                  value={premierMessage}
                  onChange={(e) => setPremierMessage(e.target.value)}
                  className="mt-1 w-full rounded-marque border border-marine-100 px-3 py-2 text-sm"
                />
              </div>
              {erreur && <p className="text-xs text-magenta-600">{erreur}</p>}
              <button
                type="submit"
                disabled={enCours}
                className="w-full rounded-marque bg-magenta-500 py-2 text-sm font-bold text-white transition-colors hover:bg-magenta-600 disabled:opacity-50"
              >
                {enCours ? "Envoi…" : "Envoyer"}
              </button>
            </form>
          ) : (
            <>
              <div className="flex-1 space-y-3 overflow-y-auto bg-creme-100 p-4">
                {conversation.origineSansAgent && conversation.messages.length <= 1 && (
                  <p className="rounded-marque bg-creme-200 p-3 text-xs text-marine-500">
                    Merci ! Aucun agent n&apos;est en ligne pour le moment — on vous répond ici dès que possible.
                  </p>
                )}
                {conversation.messages.map((m) => (
                  <div key={m.id} className={`flex items-end gap-2 ${m.expediteur === "CLIENT" ? "justify-end" : "justify-start"}`}>
                    {m.expediteur === "STAFF" && <AvatarAgente className="h-6 w-6 shrink-0" />}
                    <div
                      className={`max-w-[80%] rounded-marque px-3 py-2 text-sm ${
                        m.expediteur === "CLIENT" ? "bg-magenta-500 text-white" : "bg-white text-marine-500 shadow-sm"
                      }`}
                    >
                      {m.contenu}
                    </div>
                  </div>
                ))}
                <div ref={finFilRef} />
              </div>
              <form onSubmit={envoyer} className="flex gap-2 border-t border-marine-100 p-3">
                <input
                  value={texte}
                  onChange={(e) => setTexte(e.target.value)}
                  placeholder="Écrire un message…"
                  className="flex-1 rounded-marque border border-marine-100 px-3 py-2 text-sm"
                />
                <button
                  type="submit"
                  disabled={enCours || !texte.trim()}
                  className="rounded-marque bg-magenta-500 px-3 py-2 text-sm font-bold text-white transition-colors hover:bg-magenta-600 disabled:opacity-50"
                >
                  Envoyer
                </button>
              </form>
              <button type="button" onClick={nouvelleConversation} className="border-t border-marine-100 py-1.5 text-center text-[11px] text-marine-300 hover:text-magenta-500">
                Démarrer une nouvelle conversation
              </button>
            </>
          )}
        </div>
      )}

      <button
        type="button"
        onClick={() => setOuvert((v) => !v)}
        aria-label={ouvert ? "Fermer le chat" : "Ouvrir le chat"}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-magenta-500 text-white shadow-lg shadow-magenta-500/30 transition-transform hover:scale-105"
      >
        {ouvert ? <IconeFermer className="h-6 w-6" /> : <IconeChat className="h-6 w-6" />}
      </button>
    </div>
  );
}
