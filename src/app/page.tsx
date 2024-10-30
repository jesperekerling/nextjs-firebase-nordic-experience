import { fetchPackages } from "../utils/fetchPackages";
import PackageList from "./package/(components)/PackageList";
import FrontPageInfoModal from "../components/FrontPageInfoModal";

const FrontPage = async ({ searchParams }) => {
  const resolvedSearchParams = await searchParams;
  const selectedCategory = resolvedSearchParams?.category || null;
  const packages = await fetchPackages();

  // Filter packages by selected category
  const filteredPackages = selectedCategory
    ? packages.filter(pkg => pkg.category === selectedCategory)
    : packages;

  return (
    <div className="items-center justify-items-center p-8 pb-20 font-[family-name:var(--font-geist-sans)]">
      <main className="">
        <section className="text-center">
          <h1 className="text-2xl font-bold">Packages</h1>
          <FrontPageInfoModal />
        </section>
        <section className="mt-8">
          <PackageList packages={filteredPackages} selectedCategory={selectedCategory} />
        </section>
      </main>


    </div>
  );
};

export default FrontPage;