import { fetchHousing } from '@/utils/fetchHousing';
import { Housing } from '@/types/housing';
import HousingListClient from './HousingListClient';
import Head from 'next/head';

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
    <>
      <Head>
        <title>Housing - Nordic Experiences</title>
        <meta name="description" content="Browse our list of available housing options." />
      </Head>
      <div className="pb-20 font-[family-name:var(--font-geist-sans)]">
        <section className="text-center">
          <h1 className="text-2xl font-bold">Housing</h1>
          <p className="text-grey2 dark:text-gray-200 py-3">Select a housing option from our list. (optional)</p>
        </section>
        <section className="mt-8">
          {error ? (
            <div>{error}</div>
          ) : (
            <HousingListClient housingList={housingList} />
          )}
        </section>
      </div>
    </>
  );
};

export default HousingList;