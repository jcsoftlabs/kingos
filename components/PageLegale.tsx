export function PageLegale({ titre, majLe, children }: { titre: string; majLe?: string; children: React.ReactNode }) {
  return (
    <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <p className="text-sm font-bold uppercase tracking-wide text-magenta-500">Kingo&apos;s</p>
      <h1 className="mt-2 text-3xl font-extrabold text-marine-500">{titre}</h1>

      <div className="mt-4 rounded-marque border border-lime bg-creme-200 px-4 py-3 text-sm text-marine-500">
        Document type généré pour démarrer — à faire relire par un juriste avant de s&apos;y fier en cas de litige,
        et à adapter si votre situation (forme juridique, activité) diffère de ce qui est décrit ici.
      </div>

      <div className="mt-8 [&_h2]:mt-8 [&_h2]:text-lg [&_h2]:font-extrabold [&_h2]:text-marine-500 [&_p]:mt-3 [&_p]:leading-relaxed [&_p]:text-marine-400 [&_ul]:mt-3 [&_ul]:list-disc [&_ul]:space-y-1 [&_ul]:pl-5 [&_ul]:text-marine-400">
        {children}
      </div>

      {majLe && <p className="mt-10 text-xs text-marine-300">Dernière mise à jour : {majLe}</p>}
    </section>
  );
}
