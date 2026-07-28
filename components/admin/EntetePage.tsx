export function EntetePage({
  titre,
  description,
  children,
}: {
  titre: string;
  description?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-start justify-between gap-4 border-b border-marine-100 pb-5">
      <div>
        <h1 className="text-xl font-extrabold tracking-tight text-marine-500">{titre}</h1>
        {description && <p className="mt-1 max-w-2xl text-sm text-marine-400">{description}</p>}
      </div>
      {children && <div className="shrink-0">{children}</div>}
    </div>
  );
}
