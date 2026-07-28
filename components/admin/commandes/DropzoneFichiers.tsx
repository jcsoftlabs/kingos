"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";

interface Fichier {
  id: string;
  nomOriginal: string;
  extension: string;
  tailleOctets: string;
  statut: string;
  creeLe: string;
}

function formaterTaille(octets: number) {
  if (octets < 1024) return `${octets} o`;
  if (octets < 1024 * 1024) return `${(octets / 1024).toFixed(0)} Ko`;
  return `${(octets / (1024 * 1024)).toFixed(1)} Mo`;
}

const LIBELLES_STATUT_FICHIER: Record<string, string> = {
  EN_ATTENTE_UPLOAD: "Envoi en cours…",
  RECU: "Reçu",
  EN_VERIFICATION: "En vérification",
  VALIDE: "Validé",
  REJETE: "Rejeté",
  ARCHIVE: "Archivé",
};

export function DropzoneFichiers({ commandeId, fichiers }: { commandeId: string; fichiers: Fichier[] }) {
  const router = useRouter();
  const [survole, setSurvole] = useState(false);
  const [enCours, setEnCours] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);
  const [progression, setProgression] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function televerser(fichiers: FileList | null) {
    if (!fichiers || fichiers.length === 0) return;
    setEnCours(true);
    setErreur(null);

    try {
      for (const fichier of Array.from(fichiers)) {
        setProgression(`Envoi de ${fichier.name}…`);

        const reponseSignature = await fetch("/api/admin/fichiers/signature", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            commandeId,
            nomFichier: fichier.name,
            tailleOctets: fichier.size,
            typeMime: fichier.type || "application/octet-stream",
          }),
        });
        const corpsSignature = await reponseSignature.json();
        if (!corpsSignature.succes) {
          throw new Error(corpsSignature.erreur?.message ?? "Signature refusée");
        }

        const s = corpsSignature.donnees;
        const donneesFormulaire = new FormData();
        donneesFormulaire.append("file", fichier);
        donneesFormulaire.append("api_key", s.apiKey);
        donneesFormulaire.append("timestamp", String(s.timestamp));
        donneesFormulaire.append("signature", s.signature);
        donneesFormulaire.append("folder", s.dossier);
        donneesFormulaire.append("public_id", s.publicId);
        if (s.accesAuthentifie) {
          donneesFormulaire.append("type", "authenticated");
          donneesFormulaire.append("access_mode", "authenticated");
        }

        // Le fichier part directement vers Cloudinary depuis le navigateur —
        // jamais par notre API, dont la charge utile serait limitée et le
        // transfert lent sur une connexion mobile (voir fichiers/routes.ts).
        const reponseCloudinary = await fetch(
          `https://api.cloudinary.com/v1_1/${s.cloudName}/${s.typeRessource}/upload`,
          { method: "POST", body: donneesFormulaire },
        );
        if (!reponseCloudinary.ok) throw new Error(`Échec de l'envoi de ${fichier.name}`);
      }

      router.refresh();
    } catch (e) {
      setErreur(e instanceof Error ? e.message : "Échec de l'envoi");
    } finally {
      setEnCours(false);
      setProgression(null);
    }
  }

  return (
    <div>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setSurvole(true);
        }}
        onDragLeave={() => setSurvole(false)}
        onDrop={(e) => {
          e.preventDefault();
          setSurvole(false);
          void televerser(e.dataTransfer.files);
        }}
        onClick={() => inputRef.current?.click()}
        className={`cursor-pointer rounded-marque border-2 border-dashed p-6 text-center transition-colors ${
          survole ? "border-magenta-500 bg-magenta-50" : "border-marine-100 hover:border-marine-200"
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          multiple
          className="hidden"
          onChange={(e) => void televerser(e.target.files)}
        />
        <p className="text-sm font-bold text-marine-500">
          {enCours ? progression : "Glissez-déposez les fichiers ici, ou cliquez pour parcourir"}
        </p>
        <p className="mt-1 text-xs text-marine-400">PDF, AI, EPS, PSD, SVG, JPG, PNG, TIFF, ZIP — 400 Mo max</p>
      </div>

      {erreur && <p className="mt-2 text-sm text-magenta-600">{erreur}</p>}

      {fichiers.length > 0 && (
        <ul className="mt-4 divide-y divide-marine-100 rounded-marque border border-marine-100 bg-white">
          {fichiers.map((f) => (
            <li key={f.id} className="flex items-center justify-between px-4 py-2.5 text-sm">
              <div className="min-w-0">
                <p className="truncate font-medium text-marine-500">{f.nomOriginal}</p>
                <p className="text-xs text-marine-400">{formaterTaille(Number(f.tailleOctets))}</p>
              </div>
              <span className="shrink-0 rounded-full bg-creme-200 px-2.5 py-1 text-[11px] font-bold text-marine-500">
                {LIBELLES_STATUT_FICHIER[f.statut] ?? f.statut}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
