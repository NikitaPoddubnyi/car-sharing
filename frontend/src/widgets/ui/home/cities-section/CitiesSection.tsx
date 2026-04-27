'use client';
import { mapImg } from '@/assets';
import { cities } from '@/shared/lib/consts/cities.const';
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';

export default function CitiesSection() {
  const [sliderRef, emblaApi] = useEmblaCarousel({
    loop: true,
    // align: 'center',
    // dragFree: true,
  });

  return (
    <section
      className="w-full py-25 bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${mapImg.src})` }}
    >
      <div className="container">
        <h2 className="text-5xl font-bold text-center mb-14!">Local Service We Provide</h2>

        <div className="relative flex items-center gap-4">
          <button
            onClick={() => emblaApi?.scrollPrev()}
            className="shrink-0 w-15 h-15 flex items-center justify-center -ml-35!  text-gray-500 hover:text-black transition"
          >
            <ChevronLeft size={50} />
          </button>

          <div className="overflow-hidden mx-20!" ref={sliderRef}>
            <div className="flex gap-15 px-15">
              {cities.map((city, index) => (
                <div key={index} className="flex flex-col items-center gap-3 shrink-0">
                  <Image
                    src={city.img}
                    alt={city.name}
                    width={176}
                    height={176}
                    className="object-cover border-4 border-white rounded-full w-44 h-44"
                  />
                  <span className="text-xl text-gray-800 font-medium">{city.name}</span>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => emblaApi?.scrollNext()}
            className="shrink-0 w-15 -mr-35! h-15 flex items-center justify-center text-gray-500 hover:text-black transition"
          >
            <ChevronRight size={50} />
          </button>
        </div>
      </div>
    </section>
  );
}
