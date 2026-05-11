'use client';

import { Bike, BikeApi, SearchBikesDto } from '@/entities/bike';
import { GearBox, TyreType } from '@/entities/bike/models/types';
import { FUEL_TYPE_LABELS, FuelType } from '@/shared/types';
import { GearBoxLabels, TyreTypeLabels } from '@/entities/bike/models/consts';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState, useCallback } from 'react';
import { Pagination } from '@/shared/ui/components/pagination';

export default function BikesList() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [bikes, setBikes] = useState<Bike[]>([]);
  const [meta, setMeta] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const page = Number(searchParams.get('page')) || 1;
  const limit = Number(searchParams.get('limit')) || 12;

  const fetchBikes = useCallback(async () => {
    setLoading(true);
    setError(null);

    const params: SearchBikesDto = {
      locationId: searchParams.get('locationId') || undefined,
      startDate: searchParams.get('startDate') || undefined,
      endDate: searchParams.get('endDate') || undefined,
      search: searchParams.get('search') || undefined,
      tyreType: (searchParams.get('tyreType') as TyreType) || undefined,
      gearBox: (searchParams.get('gearBox') as GearBox) || undefined,
      fuelType: (searchParams.get('fuelType') as FuelType) || undefined,
      brand: searchParams.get('brand') || undefined,
      minPrice: searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined,
      maxPrice: searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined,
      priceSort: (searchParams.get('priceSort') as 'asc' | 'desc') || undefined,
      timeDuration: (searchParams.get('timeDuration') as 'hour' | 'day') || undefined,
    };

    try {
      const response = await BikeApi.findAvailable(params, page, limit);
      setBikes(response.items);
      setMeta(response.meta);
    } catch (err) {
      setError('Failed to load bikes');
    } finally {
      setLoading(false);
    }
  }, [searchParams, page, limit]);

  useEffect(() => {
    fetchBikes();
  }, [fetchBikes]);

  const goToPage = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', String(newPage));
    router.push(`?${params.toString()}`);
  };

  if (error) {
    return <div className="text-center py-10 text-red-500">{error}</div>;
  }

  return (
    <section className="py-30 bg-gray-200!">
      <div className="container">
        {loading && <div className="text-center py-10">Loading...</div>}

        <div className="grid grid-cols-4 gap-6">
          {bikes.map((bike) => (
            <div
              key={bike.id}
              className="bg-white border border-gray-300 rounded-lg p-4 flex flex-col justify-between hover:shadow-lg transition-shadow"
            >
              <div
                className="flex justify-center mb-4! cursor-pointer"
                onClick={() => router.push(`/bikes/${bike.id}`)}
              >
                <Image
                  src={bike.images[0]?.url || '/car-placeholder.jpg'}
                  alt={`${bike.brand} ${bike.model}`}
                  width={200}
                  height={120}
                  className="object-contain h-28"
                />
              </div>

              <div className="mb-3!">
                <h3 className="font-semibold text-lg">
                  {bike.brand} {bike.model}
                </h3>
                <p className="text-xs text-gray-500">{bike.year}</p>
              </div>

              <div className="grid grid-cols-2 text-[10px] text-gray-500 gap-y-1 mb-4!">
                <span className="text-[12px] font-semibold text-gray-600">
                  Engine: {bike.engineDisplacement}
                </span>
                <span className="text-[12px] font-semibold text-gray-600">
                  Fuel: {FUEL_TYPE_LABELS[bike.fuelType]}
                </span>
                <span>ABS: {bike.abs}</span>
                <span>Emmision: {bike.emmisionType}</span>
                <span>Tyre Type: {TyreTypeLabels[bike.tyreType]}</span>
                <span>GearBox: {GearBoxLabels[bike.gearBox]}</span>
                <span>Crearence: {bike.groundClearance}</span>
                <span>Milleage: {bike.mileage}</span>
              </div>

              <div className="flex items-center justify-between mt-auto!">
                <div>
                  <p className="text-xs text-gray-400">Per Day</p>
                  <p className="font-bold text-lg">${bike.pricePerDay}</p>
                </div>

                <button
                  onClick={() => router.push(`/bikes/${bike.id}`)}
                  className="bg-black text-white text-xs px-4 py-2 rounded hover:bg-gray-700 transition"
                >
                  Rent Bike
                </button>
              </div>
            </div>
          ))}
        </div>

        {meta && meta.totalPages > 0 && (
            <Pagination
              currentPage={page}
              totalPages={meta.totalPages}
              onPageChange={goToPage}
            />
        )}
      </div>
    </section>
  );
}
