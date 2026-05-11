'use client';
import { VehicleTypes } from '@/shared/lib/consts/vehicle-types.const';
import { ChevronDown, Search, SlidersHorizontal, X } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState, useCallback, useRef } from 'react';
import { CarFilterModal } from './CarFilterModal';
import { BikeFilterModal } from './BikeFilterModal';
import { carBrands } from '@/entities/car/models/consts';
import { bikeBrands } from '@/entities/bike/models/consts';

export default function VehicleFilter({ type }: { type: VehicleTypes }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState('');
  const [priceSort, setPriceSort] = useState('');
  const [timeDuration, setTimeDuration] = useState('');
  const [brand, setBrand] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    setSearch(searchParams.get('search') || '');
    setPriceSort(searchParams.get('priceSort') || '');
    setTimeDuration(searchParams.get('timeDuration') || '');
    setBrand(searchParams.get('brand') || '');
  }, [searchParams]);

  const debouncedSearch = useCallback(
    (value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) params.set('search', value);
      else params.delete('search');
      router.push(`?${params.toString()}`);
    },
    [router, searchParams]
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      if (search !== (searchParams.get('search') || '')) {
        debouncedSearch(search);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [search, debouncedSearch, searchParams]);

  const handlePriceSortChange = (value: string) => {
    setPriceSort(value);
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set('priceSort', value);
    else params.delete('priceSort');
    router.push(`?${params.toString()}`);
  };

  const handleTimeDurationChange = (value: string) => {
    setTimeDuration(value);
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set('timeDuration', value);
    else params.delete('timeDuration');
    router.push(`?${params.toString()}`);
  };

  const handleBrandChange = (value: string) => {
    setBrand(value);
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set('brand', value);
    else params.delete('brand');
    router.push(`?${params.toString()}`);
  };

  const handleReset = () => {
    setSearch('');
    setPriceSort('');
    setTimeDuration('');
    setBrand('');
    router.push('?');
  };

  const hasActiveFilters = search || priceSort || timeDuration || brand;

  return (
    <>
      <div className="w-full max-w-6xl mx-auto!">
        <div className="bg-white rounded-sm shadow-lg border-2 border-gray-300 px-6 h-40 flex items-center">
          <div className="flex items-center gap-4 w-full">
            <div className="flex-1 text-gray-500">
              <div className="text-base font-semibold text-gray-800! mb-2! pb-2">Search</div>
              <div className="flex items-center border border-gray-300 rounded-sm px-3 py-3">
                <input
                  type="text"
                  placeholder="Search by name, brand..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="bg-transparent outline-none text-sm w-full "
                />
                {search && (
                  <button onClick={() => setSearch('')}>
                    <X size={14} className="mx-2!" />
                  </button>
                )}
                <Search size={20} className="" />
              </div>
            </div>

            <div className="flex-1 text-gray-500">
              <div className="text-base font-semibold text-gray-800 mb-2! pb-2">Price</div>
              <div className="relative border border-gray-300 rounded-sm px-3 py-3">
                <select
                  value={priceSort}
                  onChange={(e) => handlePriceSortChange(e.target.value)}
                  className="appearance-none w-full bg-transparent outline-none text-sm"
                >
                  <option value="">Sort by price</option>
                  <option value="asc">From low to high </option>
                  <option value="desc">From high to low</option>
                </select>
                <ChevronDown
                  size={14}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                />
              </div>
            </div>

            <div className="flex-1 text-gray-500">
              <div className="text-base font-semibold text-gray-800 mb-2! pb-2">Duration</div>
              <div className="relative border border-gray-300 rounded-sm px-3 py-3">
                <select
                  value={timeDuration}
                  onChange={(e) => handleTimeDurationChange(e.target.value)}
                  className="appearance-none w-full bg-transparent outline-none text-sm"
                >
                  <option value="">Rental period</option>
                  <option value="hour">Per Hour</option>
                  <option value="day">Per Day</option>
                </select>
                <ChevronDown
                  size={14}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                />
              </div>
            </div>

            <div className="flex-1 text-gray-500">
              <div className="text-base font-semibold text-gray-800 mb-2! pb-2">Brand</div>
              <div className="relative border border-gray-300 rounded-sm px-3 py-3">
                <select
                  value={brand}
                  onChange={(e) => handleBrandChange(e.target.value)}
                  className="appearance-none w-full bg-transparent outline-none text-sm"
                >
                  <option value="">All brands</option>
                  {type === VehicleTypes.CAR &&
                    carBrands.map((brand) => (
                      <option key={brand} value={brand}>
                        {brand}
                      </option>
                    ))}
                  {type === VehicleTypes.BIKE &&
                    bikeBrands.map((brand) => (
                      <option key={brand} value={brand}>
                        {brand}
                      </option>
                    ))}
                </select>
                <ChevronDown
                  size={14}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                />
              </div>
            </div>

            <div className="flex flex-row translate-y-1/2 justify-center items-center gap-2 text-gray-500">
              <button
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 hover:bg-gray-100 text-sm rounded-sm"
              >
                <SlidersHorizontal size={16} />
                Filters
              </button>

              {hasActiveFilters && (
                <button
                  onClick={handleReset}
                  className="flex items-center gap-2 px-4 py-2 rounded-sm text-red-500 text-sm  hover:text-red-600 hover:bg-red-500/10"
                >
                  <X size={14} />
                  Reset
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {isModalOpen && type === VehicleTypes.CAR && (
        <CarFilterModal onClose={() => setIsModalOpen(false)} />
      )}
      {isModalOpen && type === VehicleTypes.BIKE && (
        <BikeFilterModal onClose={() => setIsModalOpen(false)} />
      )}
    </>
  );
}
