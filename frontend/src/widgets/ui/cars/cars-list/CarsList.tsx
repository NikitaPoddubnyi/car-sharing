'use client';

import { Car, CarApi, SearchCarsDto } from '@/entities/car';
import {
  Body_TYPE_LABELS,
  DRIVE_TRAIN_LABELS,
  TRANSMISSION_LABELS,
} from '@/entities/car/models/consts';
import { BodyType, DriveTrain, Transmission } from '@/entities/car/models/types';
import { FUEL_TYPE_LABELS, FuelType } from '@/shared/types';
import { Pagination } from '@/shared/ui/components/pagination';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState, useCallback } from 'react';

export default function CarsList() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [cars, setCars] = useState<Car[]>([]);
  const [meta, setMeta] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const page = Number(searchParams.get('page')) || 1;
  const limit = Number(searchParams.get('limit')) || 12;

  const fetchCars = useCallback(async () => {
    setLoading(true);
    setError(null);

    const params: SearchCarsDto = {
      locationId: searchParams.get('locationId') || undefined,
      startDate: searchParams.get('startDate') || undefined,
      endDate: searchParams.get('endDate') || undefined,
      search: searchParams.get('search') || undefined,
      bodyType: (searchParams.get('bodyType') as BodyType) || undefined,
      transmission: (searchParams.get('transmission') as Transmission) || undefined,
      driveTrain: (searchParams.get('driveTrain') as DriveTrain) || undefined,
      fuelType: (searchParams.get('fuelType') as FuelType) || undefined,
      brand: searchParams.get('brand') || undefined,
      seats: searchParams.get('seats') ? Number(searchParams.get('seats')) : undefined,
      minPrice: searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined,
      maxPrice: searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined,
      priceSort: (searchParams.get('priceSort') as 'asc' | 'desc') || undefined,
      timeDuration: (searchParams.get('timeDuration') as 'hour' | 'day') || undefined,
    };

    try {
      const response = await CarApi.findAvailable(params, page, limit);
      setCars(response.items);
      setMeta(response.meta);
    } catch (err) {
      setError('Failed to load cars');
    } finally {
      setLoading(false);
    }
  }, [searchParams, page, limit]);

  useEffect(() => {
    fetchCars();
  }, [fetchCars]);

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
          {cars.map((car) => (
            <div
              key={car.id}
              className="bg-white border border-gray-300 rounded-lg p-4 flex flex-col justify-between hover:shadow-lg transition-shadow"
            >
              <div
                className="flex justify-center mb-4! cursor-pointer"
                onClick={() => {
                  router.push(`cars/${car.id}`);
                }}
              >
                <Image
                  src={car.images[0]?.url || '/car-placeholder.jpg'}
                  alt={`${car.brand} ${car.model}`}
                  width={200}
                  height={120}
                  className="object-contain h-28"
                />
              </div>

              <div className="mb-3!">
                <h3 className="font-semibold text-lg">
                  {car.brand} {car.model}
                </h3>
                <p className="text-xs text-gray-500">{car.year}</p>
              </div>

              <div className="grid grid-cols-2 text-[10px] text-gray-500 gap-y-1 mb-4!">
                <span className="text-[12px] font-semibold text-gray-600">Seats: {car.seats}</span>
                <span className="text-[12px] font-semibold text-gray-600">
                  Fuel: {FUEL_TYPE_LABELS[car.fuelType]}
                </span>
                <span>Luggage: {car.luggage}</span>
                <span>Engine: {car.engineSize}</span>
                <span>Doors: {car.doors}</span>
                <span>Drive: {DRIVE_TRAIN_LABELS[car.driveTrain]}</span>
                <span>Transmission: {TRANSMISSION_LABELS[car.transmission]}</span>
                <span>Type: {Body_TYPE_LABELS[car.bodyType]}</span>
              </div>

              <div className="flex items-center justify-between mt-auto!">
                <div>
                  <p className="text-xs text-gray-400">Per Day</p>
                  <p className="font-bold text-lg">${car.pricePerDay}</p>
                </div>

                <button
                  onClick={() => router.push(`/cars/${car.id}`)}
                  className="bg-black text-white text-xs px-4 py-2 rounded hover:bg-gray-700 transition"
                >
                  Rent Car
                </button>
              </div>
            </div>
          ))}
        </div>

        {meta && meta.totalPages > 1 && (
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
