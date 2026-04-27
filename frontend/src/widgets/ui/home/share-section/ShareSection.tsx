import { CarShareImg } from '@/assets';
import { ArrowUpRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function ShareSection() {
  return (
    <section className="w-full pt-20 bg-white! py-24 h-175!">
      <div className="relative container">
        <div className="absolute right-0 -top-1/3 h-120 w-[55%]">
          <Image src={CarShareImg} alt="Car sharing" fill className="object-cover" priority />
        </div>

        <div className="relative z-2 mt-40! ">
          <div className="max-w-182.5 bg-white rounded-2xl shadow-xl p-10 relative border border-gray-200!">
            <div className="absolute right-6 top-6 w-5 h-5 bg-gray-400 rounded-full" />

            <h3 className="text-[38px] font-semibold mb-5!">Do You Want To Share Your Vehicle?</h3>

            <p className="text-gray-500 leading-relaxed mb-9!">
              We'll use your car's location to calculate your Onboard Bonus. Each ZIP code will
              belong to one of five zones. Zones are based on guest demand for cars—more guest
              demand means a higher zone, and bigger bonuses for cars. Zone 1 gets the highest
              bonus, while Zones 4 and 5 aren't eligible for the Onboard Bonus.
            </p>

            <Link
              href="/share"
              className="inline-flex items-center gap-2 px-5 py-3 bg-black text-white! rounded-md hover:bg-gray-600 transition"
            >
              Learn More
              <ArrowUpRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
