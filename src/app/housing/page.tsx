import { fetchHousing } from '@/utils/fetchHousing';
import { Housing } from '@/types/housing';
import HousingListClient from './HousingListClient';

export async function generateMetadata() {
  return {
    title: "Housing - Nordic Experiences",
    description: "Browse our list of available housing options.",
  };
}

const HousingList = async () => {
  let housingList: Housing[] = [];
  let error: string | null = null;

  try {
    housingList = await fetchHousing();
  } catch (err) {
    error = "Failed to fetch housing list.";
    console.error("Error fetching housing list:", err);
  }

  return (
    <div className="pb-20 font-[family-name:var(--font-geist-sans)]">
      <section className="text-center">
        <h1 className="text-2xl font-bold">Housing</h1>
      </section>
      <section className="mt-8">
        {error ? (
          <div>{error}</div>
        ) : (
          <HousingListClient housingList={housingList} />
        )}
      </section>
    </div>
  );
};

export default HousingList;