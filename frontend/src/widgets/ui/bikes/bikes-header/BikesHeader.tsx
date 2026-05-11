import { BikesHeaderImg, CarsHeaderImg, MapCarsHeaderImg } from '@/assets';
import { VehicleFilter } from '@/features/vehicles';
import { VehicleTypes } from '@/shared/lib/consts';
import Image from 'next/image';

export default function BikesHeader() {
  return (
    <header className="w-full bg-slate-900! relative pt-20 pb-40">
      <div className="container">
        <div className="text-white flex flex-col">
          <h1 className="text-[40px] pt-19 pb-6 z-2 text-center font-semibold leading-tight">
            Rent A Bike Rent Your Freedom
          </h1>
          <Image
            src={MapCarsHeaderImg}
            alt="Map header"
            width={492}
            height={400}
            className="absolute bottom-20 left-0 z-1"
          />
          <Image
            src={BikesHeaderImg}
            alt="Bike"
            width={416}
            height={353}
            className="absolute bottom-0 right-0 z-1"
          />

          <div className="absolute bottom-0 translate-y-1/2 left-0 right-0 z-2 flex justify-center px-6">
            <VehicleFilter type={VehicleTypes.BIKE} />
          </div>
        </div>
      </div>
    </header>
  );
}
