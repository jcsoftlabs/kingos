"use client";

import { useRef, useState } from "react";

interface Props {
  type: "realisation" | "ressource-apercu" | "ressource-fichier";
  slug: string;
  resourceType?: "image" | "raw";
  label: string;
  onTeleverse: (info: { publicId: string; format: string; tailleOctets: number; resourceType: "image" | "raw" }) => void;
}

/** Upload direct vers Cloudinary (signature côté serveur) — même schéma que DropzoneFichiers, pour le contenu vitrine. */
export function TeleverseurFichier({ type, slug, resourceType = "image", label, onTeleverse }: Props) {
  const [enCours, setEnCours] = useState(false);
  const [nomFichier, setNomFichier] = useState<string | null>(null);
  const [erreur, setErreur] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function televerser(fichiers: FileList | null) {
    const fichier = fichiers?.[0];
    if (!fichier || !slug) {
      if (!slug) setErreur("Renseignez d'abord un slug");
      return;
    }
    setEnCours(true);
    setErreur(null);
    try {
      const reponseSignature = await fetch("/api/admin/contenu/signature", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, slug, resourceType }),
      });
      const corpsSignature = await reponseSignature.json();
      if (!corpsSignature.succes) throw new Error(corpsSignature.erreur?.message ?? "Signature refusée");

      const s = corpsSignature.donnees;
      const donneesFormulaire = new FormData();
      donneesFormulaire.append("file", fichier);
      donneesFormulaire.append("api_key", s.apiKey);
      donneesFormulaire.append("timestamp", String(s.timestamp));
      donneesFormulaire.append("signature", s.signature);
      donneesFormulaire.append("folder", s.dossier);
      donneesFormulaire.append("public_id", s.publicId);

      const reponseCloudinary = await fetch(`https://api.cloudinary.com/v1_1/${s.cloudName}/${s.typeRessource}/upload`, {
        method: "POST",
        body: donneesFormulaire,
      });
      if (!reponseCloudinary.ok) throw new Error("Échec de l'envoi");
      const resultat = await reponseCloudinary.json();

      setNomFichier(fichier.name);
      onTeleverse({
        publicId: resultat.public_id,
        format: (resultat.format ?? fichier.name.split(".").pop() ?? "").toLowerCase(),
        tailleOctets: resultat.bytes ?? fichier.size,
        resourceType: resourceType,
      });
    } catch (e) {
      setErreur(e instanceof Error ? e.message : "Échec de l'envoi");
    } finally {
      setEnCours(false);
    }
  }

  return (
    <div>
      <label className="block text-xs font-bold text-marine-500">{label}</label>
      <div className="mt-1 flex items-center gap-2">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={enCours}
          className="rounded-marque border border-marine-100 bg-white px-3 py-1.5 text-xs font-bold text-marine-500 hover:border-marine-200 disabled:opacity-50"
        >
          {enCours ? "Envoi…" : nomFichier ? "Remplacer" : "Choisir un fichier"}
        </button>
        {nomFichier && <span className="text-xs text-foret-600">✓ {nomFichier}</span>}
      </div>
      <input ref={inputRef} type="file" className="hidden" onChange={(e) => void televerser(e.target.files)} />
      {erreur && <p className="mt-1 text-xs text-magenta-600">{erreur}</p>}
    </div>
  );
}
