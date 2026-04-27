import { advantages, rent } from '@/shared/lib/consts';
import Image from 'next/image';
import Link from 'next/link';

export default function RentSection() {
  return (
    <section className="w-full bg-white! mb-24 pt-50">
      <div className="container">
        {rent.map((item, index) => (
          <div key={index} className="w-full h-full grid grid-cols-2 gap-10 pt-12 pb-12 ">
            <div className={` mt-15! ${index % 2 !== 0 ? 'order-2 ml-2! ' : 'mr-2!'}`}>
              <h2 className="text-5xl font-semibold mb-8!">{item.title}</h2>
              <div className="flex flex-wrap gap-5">
                {advantages.map((advantage, index) => (
                  <span
                    key={index}
                    className="px-4 py-3 bg-gray-100 text-gray-400 rounded-sm cursor-pointer"
                  >
                    {advantage.title}
                  </span>
                ))}
              </div>
              <p className="text-xl my-8! text-gray-500 leading-relaxed! ">{item.description}</p>
              <Link
                href={item.path}
                className="px-4 py-3  bg-black text-white! text-lg rounded-sm hover:bg-gray-600 transition-colors"
              >
                {item.text}
              </Link>
            </div>
            <div
              className={`relative h-125 ${
                index % 2 === 0 ? 'w-[calc(100%+140px)]' : '-ml-35! order-1'
              }`}
            >
              <Image src={item.img} alt={item.title} fill priority className="object-cover" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
