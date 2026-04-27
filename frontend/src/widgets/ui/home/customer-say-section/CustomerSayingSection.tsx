import { customerSaying } from '@/shared/lib/consts';
import Image from 'next/image';

export default function CustomerSayingSection() {
  return (
    <section className="w-full bg-gray-100 py-25">
      <div className="container px-4 ">
        <h2 className="text-4xl font-semibold text-center mb-15!">What Our Customer Saying...</h2>

        <div className="grid grid-cols-3 gap-8">
          {customerSaying.map((item, index) => (
            <div key={index} className=" relative w-full h-140 rounded-xl overflow-hidden group">
              <Image src={item.img} alt={item.name} fill className="object-cover" />

              <div className="absolute inset-0 bg-linear-to-t from-black/20 via-black/30 to-transparent" />

              <div className="flex flex-col justify-end absolute h-57.75 bottom-0 left-0 right-0 p-6 text-white bg-black/30! pb-10">
                <h4 className="font-semibold mb-2!">Excellent Service! Car Rent Service</h4>

                <p className="text-sm text-gray-300 mb-4! leading-relaxed line-clamp-4">
                  {item.text}
                </p>

                <div className="flex items-center gap-2 text-sm">
                  <span
                    className="relative pl-12 font-medium
				  before:content-['']
				  before:absolute
				  before:left-0
				  before:top-1/2
				  before:-translate-y-1/2
				  before:w-8
				  before:h-0.5
				  before:bg-white"
                  >
                    {item.name}
                  </span>
                </div>
              </div>

              <div className="absolute inset-0 bg-black/15! opacity-0 group-hover:opacity-100! transition duration-300" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
