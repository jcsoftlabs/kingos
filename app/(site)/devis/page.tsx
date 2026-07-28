import { apiBackend } from "@/lib/api-backend";
import { ConfigurateurDevis } from "@/components/devis/ConfigurateurDevis";
import { PageProvisoire } from "@/components/PageProvisoire";
import type { CategorieResume } from "@/lib/types-catalogue";

export const metadata = { title: "Demander un devis" };

async function chargerCategories(): Promise<CategorieResume[]> {
  try {
    const { corps } = await apiBackend<CategorieResume[]>("/api/catalogue/categories", { revalidate: 60 });
    return corps.succes && corps.donnees ? corps.donnees.filter((c) => c.services.length > 0) : [];
  } catch {
    // L'API Railway peut être injoignable au moment précis du build Vercel
    // (redéploiement croisé, premier déploiement avant que le backend existe...).
    // Ne jamais faire échouer le build du site pour ça : on sert un état de
    // repli, l'ISR réessaiera à la prochaine revalidation (60s).
    return [];
  }
}

export default async function PageDevis() {
  const categories = await chargerCategories();

  if (categories.length === 0) {
    return (
      <PageProvisoire
        titre="Demander un devis"
        description="Le catalogue n'est pas encore configuré côté back-office — revenez bientôt."
      />
    );
  }

  return (
    <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
      <p className="text-sm font-bold uppercase tracking-wide text-magenta-500">Devis instantané</p>
      <h1 className="mt-2 text-3xl font-extrabold text-marine-500 sm:text-4xl">Configurez votre projet</h1>
      <p className="mt-3 max-w-2xl text-marine-400">
        Le prix s&apos;affiche en direct pendant que vous réglez les options — c&apos;est le serveur qui calcule,
        jamais une estimation approximative.
      </p>

      <div className="mt-10">
        <ConfigurateurDevis categories={categories} />
      </div>
    </section>
  );
}
