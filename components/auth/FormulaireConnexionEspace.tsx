"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Bouton } from "@/components/Bouton";

export function FormulaireConnexionEspace() {
  const router = useRouter();
  const [etape, setEtape] = useState<"email" | "code">("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [enCours, setEnCours] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  async function demanderCode(e: React.FormEvent) {
    e.preventDefault();
    setEnCours(true);
    setErreur(null);
    try {
      await fetch("/api/auth/espace/code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      // Toujours la même réponse côté serveur, e-mail connu ou non — même
      // message ici, pour ne jamais révéler quels e-mails ont un compte.
      setInfo("Si cette adresse est associée à une commande, un code à 4 chiffres vient de lui être envoyé.");
      setEtape("code");
    } catch {
      setErreur("Erreur réseau");
    } finally {
      setEnCours(false);
    }
  }

  async function verifierCode(e: React.FormEvent) {
    e.preventDefault();
    setEnCours(true);
    setErreur(null);
    try {
      const reponse = await fetch("/api/auth/espace/verifier", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      });
      const corps = await reponse.json();
      if (!corps.succes) {
        setErreur(corps.erreur?.message ?? "Code invalide");
        return;
      }
      router.refresh();
    } catch {
      setErreur("Erreur réseau");
    } finally {
      setEnCours(false);
    }
  }

  if (etape === "email") {
    return (
      <form onSubmit={demanderCode} className="mx-auto max-w-sm space-y-4">
        <div>
          <label className="block text-sm font-bold text-marine-500">E-mail</label>
          <input
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-2 w-full rounded-marque border border-marine-100 px-4 py-3 text-sm"
          />
          <p className="mt-2 text-xs text-marine-400">
            L&apos;adresse utilisée lors de votre commande. Aucun mot de passe — un code à usage unique vous sera
            envoyé par e-mail.
          </p>
        </div>

        {erreur && <p className="text-sm text-magenta-600">{erreur}</p>}

        <Bouton taille="normal" className="w-full" disabled={enCours}>
          {enCours ? "Envoi…" : "Recevoir un code"}
        </Bouton>
      </form>
    );
  }

  return (
    <form onSubmit={verifierCode} className="mx-auto max-w-sm space-y-4">
      {info && <p className="text-sm text-foret-600">{info}</p>}
      <div>
        <label className="block text-sm font-bold text-marine-500">Code à 4 chiffres</label>
        <input
          type="text"
          inputMode="numeric"
          pattern="[0-9]{4}"
          maxLength={4}
          required
          autoFocus
          value={code}
          onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 4))}
          className="mt-2 w-full rounded-marque border border-marine-100 px-4 py-3 text-center text-2xl font-bold tracking-[0.5em]"
        />
      </div>

      {erreur && <p className="text-sm text-magenta-600">{erreur}</p>}

      <Bouton taille="normal" className="w-full" disabled={enCours || code.length !== 4}>
        {enCours ? "Vérification…" : "Confirmer"}
      </Bouton>

      <button
        type="button"
        onClick={() => {
          setEtape("email");
          setCode("");
          setErreur(null);
          setInfo(null);
        }}
        className="w-full text-center text-xs font-bold text-marine-400 hover:text-magenta-500"
      >
        Changer d&apos;e-mail ou redemander un code
      </button>
    </form>
  );
}
