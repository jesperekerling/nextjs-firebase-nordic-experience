import Head from "next/head";
import { fetchPackages } from "../utils/fetchPackages";
import PackageList from "./package/(components)/PackageList";
import FrontPageInfoModal from "../components/FrontPageInfoModal";

interface SearchParams {
  category?: string;
  city?: string;
}


export async function generateMetadata() {
  return {
    title: "Nordic Experiences",
    description: "Travel packages for the Nordic Capital cities",
  };
}

const FrontPage = async ({ searchParams }: { searchParams: Promise<SearchParams> }) => {
  const params = await searchParams;
  const selectedCategory = params?.category || null;
  const selectedCity = params?.city || null;
  const packages = await fetchPackages();

  // Filter packages by selected category and city
  const filteredPackages = packages.filter(pkg => {
    return (!selectedCategory || pkg.category === selectedCategory) &&
           (!selectedCity || pkg.city === selectedCity);
  });

  return (
    <>
      <Head>
        <meta name="description" content="Travel packages for the Nordic Capital cities" />
        <title>Nordic Experiences</title>
      </Head>
      <div className="pb-20 font-[family-name:var(--font-geist-sans)]">
        <section className="text-center">
          <h1 className="text-2xl font-bold">Packages</h1>
          <FrontPageInfoModal />
        </section>
        <section className="mt-8">
          <PackageList packages={filteredPackages} selectedCategory={selectedCategory} selectedCity={selectedCity} />
        </section>
      </div>
    </>
  );
};

export default FrontPage;