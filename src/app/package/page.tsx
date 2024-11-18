import { fetchPackages } from "../../utils/fetchPackages";
import PackageListClient from "./(components)/PackageList";

const PackagePage = async ({ searchParams }) => {
  const selectedCategory = searchParams.category || null;
  const packages = await fetchPackages();

  // Filter packages by selected category
  const filteredPackages = selectedCategory
    ? packages.filter(pkg => pkg.category === selectedCategory)
    : packages;

  return (
    <PackageListClient packages={filteredPackages} selectedCategory={selectedCategory} />
  );
};

export default PackagePage;