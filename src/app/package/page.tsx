import PackageListClient from "./(components)/PackageList";
import { fetchPackages } from "../../utils/fetchPackages";

interface SearchParams {
  category?: string;
  city?: string;
}

interface PageProps {
  searchParams: Promise<SearchParams>;
}

const PackagePage = async ({ searchParams }: PageProps) => {
  const params = await searchParams;
  const selectedCategory = params.category || null;
  const selectedCity = params.city || null;
  const packages = await fetchPackages();

  // Filter packages by selected category and city
  const filteredPackages = packages.filter(pkg => {
    return (!selectedCategory || pkg.category === selectedCategory) &&
           (!selectedCity || pkg.city === selectedCity);
  });

  return (
    <PackageListClient packages={filteredPackages} selectedCategory={selectedCategory} selectedCity={selectedCity} />
  );
};

export default PackagePage;