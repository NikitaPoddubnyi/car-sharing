import { BikeHeaderImg, CarHeaderImg, MapHeaderImg } from '@/assets';
import { SearchNow } from '@/features/home/header/SearchNow';
import { RentBikeHeaderBtn, RentCarHeaderBtn } from '@/shared/ui/buttons/header-btns/home-header';
import Image from 'next/image';

export default function HomeHeader() {
  return (
    <header className="w-full h-195 bg-mist-950! relative mb-24">
      <div className="container">
        <div className="text-white flex flex-col">
          <h1 className="text-6xl w-8/12 pt-19 pb-6 font-semibold leading-tight">
            Unlock Endless Driving With Drivee
          </h1>
          <p className="text-xl w-5/11 text-gray-300 leading-normal">
            To contribute to positive change and achieve our sustainability goals with many
            extraordinary
          </p>
        </div>

        <div className="flex flex-row gap-5 pt-12">
          <RentCarHeaderBtn />
          <RentBikeHeaderBtn />
        </div>

        <Image
          src={BikeHeaderImg}
          alt="Bike header"
          width={380}
          height={338}
          className="absolute bottom-27 right-0 z-3"
        />
        <Image
          src={CarHeaderImg}
          alt="Car header"
          width={858}
          height={332}
          className="absolute bottom-42 right-0 z-2"
        />
        <Image
          src={MapHeaderImg}
          alt="Map header"
          width={592}
          height={338}
          className="absolute bottom-57 right-0 z-1"
        />

        <div className="absolute bottom-0 translate-y-1/2 left-0 right-0 z-2 flex justify-center px-6">
          <SearchNow />
        </div>
      </div>
    </header>
  );
}
