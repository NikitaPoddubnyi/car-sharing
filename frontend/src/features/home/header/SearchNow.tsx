'use client';

import { LocationApi } from '@/entities/location/api';
import { Location } from '@/entities/location/models';
import { ChevronDown, MapPin, Search } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

type FormValues = {
  locationId?: string;
  startDate?: string;
  endDate?: string;
};

export function SearchNow() {
  const { register, handleSubmit, setValue, watch } = useForm<FormValues>();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [locations, setLocations] = useState<Location[] | null>(null);
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [searchLocation, setSearchLocation] = useState('');

  let selectedLocation: Location | undefined = undefined;

  const selectedLocationId = watch('locationId');
  if (selectedLocationId) {
    selectedLocation = locations?.find((location) => location.id === selectedLocationId);
  }

  useEffect(() => {
    const fetchLocations = async () => {
      const allLocations = await LocationApi.getAll();
      setLocations(allLocations);
    };

    fetchLocations();
  }, []);

  useEffect(() => {
    const locationId = searchParams.get('locationId') || undefined;
    const startDate = searchParams.get('startDate') || undefined;
    const endDate = searchParams.get('endDate') || undefined;

    setValue('locationId', locationId);
    setValue('startDate', startDate);
    setValue('endDate', endDate);
  }, [searchParams, setValue]);

  const onSubmit = (data: FormValues) => {
    const queryParams = new URLSearchParams();

    if (data.locationId) queryParams.set('locationId', data.locationId);
    if (data.startDate) queryParams.set('startDate', data.startDate);
    if (data.endDate) queryParams.set('endDate', data.endDate);

    router.push(`/cars?${queryParams.toString()}`);
  };

  const handleSelectLocation = (location: Location) => {
    setValue('locationId', location.id);
    setSearchLocation(location.name);
    setIsLocationOpen(false);
  };

  let filteredLocations: Location[] | undefined = undefined;

  if (locations && searchLocation) {
    filteredLocations = locations.filter(
      (location) =>
        location.name.toLowerCase().includes(searchLocation.toLowerCase()) ||
        location.city.toLowerCase().includes(searchLocation.toLowerCase())
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-6xl mx-auto">
      <div className="bg-white rounded-sm shadow-lg border-2 border-gray-300 px-6 h-40 flex items-center">
        <div className="flex items-center gap-3 w-full">
          <div className="flex-1 relative">
            <div className="text-base font-semibold text-gray-800 mb-2 pb-4">Location</div>
            <div
              className="flex items-center justify-between border border-gray-300  rounded-sm px-3 py-3 cursor-pointer hover:border-gray-400 transition"
              onClick={() => setIsLocationOpen(!isLocationOpen)}
            >
              <span className="text-sm text-gray-500">
                {selectedLocation ? selectedLocation.name : 'Select Location'}
              </span>
              <div className="flex flex-col gap-0.5 ml-2">
                <ChevronDown size={10} className="text-gray-400 -mb-1" />
                <ChevronDown size={10} className="text-gray-400 rotate-180 -mt-1" />
              </div>
            </div>

            {isLocationOpen && (
              <>
                <div className="fixed inset-0 z-2" onClick={() => setIsLocationOpen(false)} />
                <div className="absolute left-0 top-full mt-1 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-20">
                  <div className="p-3 border-b">
                    <input
                      type="text"
                      placeholder="Search city..."
                      value={searchLocation}
                      onChange={(e) => setSearchLocation(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none"
                      autoFocus
                    />
                  </div>
                  <div className="max-h-60 overflow-auto">
                    {filteredLocations?.length ? (
                      filteredLocations.map((location) => (
                        <div
                          key={location.id}
                          onClick={() => handleSelectLocation(location)}
                          className="px-4 py-3 hover:bg-gray-50 cursor-pointer"
                        >
                          <div className="text-sm font-medium">{location.name}</div>
                          <div className="text-xs text-gray-500">{location.city}</div>
                        </div>
                      ))
                    ) : (
                      <div className="p-4 text-center text-sm text-gray-500">No cities found</div>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="flex-1">
            <div className="text-base font-semibold text-gray-800 mb-2 pb-4">Start Date</div>
            <div className="flex items-center border border-gray-300 rounded-sm px-3 py-3">
              <input
                type="date"
                {...register('startDate')}
                className="bg-transparent outline-none text-sm text-gray-500 w-full cursor-pointer"
              />
            </div>
          </div>

          <div className="flex-1">
            <div className="text-base font-semibold text-gray-800 mb-2 pb-4">End Date</div>
            <div className="flex items-center border border-gray-300 rounded-sm px-3 py-3">
              <input
                type="date"
                {...register('endDate')}
                className="bg-transparent outline-none text-sm text-gray-500 w-full cursor-pointer"
              />
            </div>
          </div>

          <button
            type="submit"
            className="bg-black text-white px-8 py-2 h-11 w-55 text-sm font-medium hover:bg-gray-600! transition whitespace-nowrap rounded-sm self-end mb-0.5 cursor-pointer!"
          >
            Search Now
          </button>
        </div>
      </div>
    </form>
  );
}
