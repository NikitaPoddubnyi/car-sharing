'use client';

import {
  bodyTypeOptions,
  driveTrainOptions,
  transmissionOptions,
} from '@/entities/car/models/consts';
import { useLocationStore } from '@/entities/location/store';
import { fuelTypeOptions } from '@/shared/types';
import { Portal } from '@/shared/ui/components/portal';
import { X, ChevronDown } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

interface Props {
  onClose: () => void;
}

export function CarFilterModal({ onClose }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { locations, fetchLocations } = useLocationStore();

  const [isOpen, setIsOpen] = useState(false);
  const [searchLocation, setSearchLocation] = useState('');

  const [filters, setFilters] = useState({
    bodyType: searchParams.get('bodyType') || '',
    transmission: searchParams.get('transmission') || '',
    driveTrain: searchParams.get('driveTrain') || '',
    fuelType: searchParams.get('fuelType') || '',
    seats: searchParams.get('seats') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    locationId: searchParams.get('locationId') || '',
  });

  useEffect(() => {
    fetchLocations();
  }, [fetchLocations]);

  useEffect(() => {
    setFilters({
      bodyType: searchParams.get('bodyType') || '',
      transmission: searchParams.get('transmission') || '',
      driveTrain: searchParams.get('driveTrain') || '',
      fuelType: searchParams.get('fuelType') || '',
      seats: searchParams.get('seats') || '',
      minPrice: searchParams.get('minPrice') || '',
      maxPrice: searchParams.get('maxPrice') || '',
      locationId: searchParams.get('locationId') || '',
    });
  }, [searchParams]);

  // useEffect(() => {
  //   document.body.style.overflow = 'hidden';

  //   return () => {
  //     document.body.style.overflow = 'unset';
  //   }
  // }, []);

  const filteredLocations = locations.filter(
    (loc) =>
      loc.name.toLowerCase().includes(searchLocation.toLowerCase()) ||
      loc.city.toLowerCase().includes(searchLocation.toLowerCase())
  );

  const selectedLocation = locations.find((loc) => loc.id === filters.locationId);

  const set = (key: string, value: string) => setFilters((prev) => ({ ...prev, [key]: value }));

  const handleApply = () => {
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(filters).forEach(([k, v]) => {
      if (v && v !== '') {
        params.set(k, v);
      } else {
        params.delete(k);
      }
    });

    router.push(`?${params.toString()}`);
    onClose();
  };

  const handleReset = () => {
    setFilters({
      bodyType: '',
      transmission: '',
      driveTrain: '',
      fuelType: '',
      seats: '',
      minPrice: '',
      maxPrice: '',
      locationId: '',
    });

    const params = new URLSearchParams();
    router.push(`?${params.toString()}`);
    onClose();
  };

  return (
    <>
    <Portal>
      <div className="fixed inset-0 bg-gray-900/50 z-5" onClick={onClose} />

      <div className="fixed inset-0 z-50 border border-gray-200 flex items-center justify-center pointer-events-none">
        <div
          className="bg-gray-100 rounded-xl shadow-2xl shadow-gray-600 w-full max-w-lg p-6 pointer-events-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-6!">
            <h3 className="text-lg font-bold text-gray-900">Car Filters</h3>
            <button onClick={onClose} className="hover:bg-gray-100 rounded-full p-1 transition">
              <X size={20} className="text-gray-400 hover:text-black" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-gray-500! mb-1! block">Body Type</label>
              <select
                value={filters.bodyType}
                onChange={(e) => set('bodyType', e.target.value)}
                className="w-full border border-gray-300 text-gray-500! rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black/20"
              >
                <option value="">Any</option>
                {bodyTypeOptions.map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-medium text-gray-500 mb-1! block">Transmission</label>
              <select
                value={filters.transmission}
                onChange={(e) => set('transmission', e.target.value)}
                className="w-full border border-gray-300 rounded-md text-gray-500! px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black/20"
              >
                <option value="">Any</option>
                {transmissionOptions.map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-medium text-gray-500 mb-1! block">Drive Train</label>
              <select
                value={filters.driveTrain}
                onChange={(e) => set('driveTrain', e.target.value)}
                className="w-full border border-gray-300 rounded-md text-gray-500! px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black/20"
              >
                <option value="">Any</option>
                {driveTrainOptions.map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-medium text-gray-500 mb-1! block">Fuel Type</label>
              <select
                value={filters.fuelType}
                onChange={(e) => set('fuelType', e.target.value)}
                className="w-full border border-gray-300 rounded-md text-gray-500! px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black/20"
              >
                <option value="">Any</option>
                {fuelTypeOptions.map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-medium text-gray-500 mb-1! block">Seats</label>
              <select
                value={filters.seats}
                onChange={(e) => set('seats', e.target.value)}
                className="w-full border border-gray-300 rounded-md text-gray-500! px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black/20"
              >
                <option value="">Any</option>
                {[2, 4, 5, 6, 7, 8].map((n) => (
                  <option key={n} value={n}>
                    {n} seats
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-medium text-gray-500 mb-1! block">
                Price per day ($)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={filters.minPrice}
                  onChange={(e) => set('minPrice', e.target.value)}
                  className="w-full border border-gray-300 rounded-md text-gray-500! px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black/20"
                  min="0"
                />
                <span className="text-gray-400">—</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={filters.maxPrice}
                  onChange={(e) => set('maxPrice', e.target.value)}
                  className="w-full border border-gray-300 text-gray-500! rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black/20"
                  min="0"
                />
              </div>
            </div>
          </div>

          <div className="mt-6! relative text-gray-500">
            <label className="text-xs font-medium text-gray-500! mb-1! block">Location</label>

            <div
              onClick={() => setIsOpen(!isOpen)}
              className="flex items-center justify-between border border-gray-300 rounded-md px-3 py-2 cursor-pointer hover:border-gray-400 transition"
            >
              <span className="text-sm text-gray-500">
                {selectedLocation ? `${selectedLocation.name} (${selectedLocation.city})` : 'Any'}
              </span>
              <ChevronDown size={14} className={`${isOpen ? 'rotate-180' : ''} transition`} />
            </div>

            {isOpen && (
              <div className="absolute left-0 top-full mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-30">
                <div className="p-3 border-b">
                  <input
                    type="text"
                    placeholder="Search city..."
                    value={searchLocation}
                    onChange={(e) => setSearchLocation(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none"
                  />
                </div>

                <div className="max-h-60 overflow-auto">
                  {filteredLocations.length ? (
                    filteredLocations.map((loc) => (
                      <div
                        key={loc.id}
                        onClick={() => {
                          set('locationId', loc.id);
                          setIsOpen(false);
                        }}
                        className="px-4 py-3 hover:bg-gray-50 cursor-pointer"
                      >
                        <div className="text-sm font-medium text-black">{loc.name}</div>
                        <div className="text-xs text-gray-500">{loc.city}</div>
                      </div>
                    ))
                  ) : (
                    <div className="p-4 text-center text-sm">No cities found</div>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-3 mt-6!">
            <button
              onClick={handleReset}
              className="flex-1 border border-gray-300 text-gray-600 py-2.5 rounded-md text-sm hover:bg-gray-50 transition"
            >
              Reset
            </button>
            <button
              onClick={handleApply}
              className="flex-1 bg-black text-white py-2.5 rounded-md text-sm hover:bg-gray-700 transition"
            >
              Apply Filters
            </button>
          </div>
        </div>
      </div>
      </Portal>
    </>
  );
}
