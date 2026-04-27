import { Users, Trophy, Clock } from 'lucide-react';

export default function WhyChooseUsSection() {
  return (
    <section className="py-25 bg-white!">
      <div className="container">
        <div className="flex items-start justify-between gap-12 max-w-6xl">
          <div className="max-w-142.5">
            <h2 className="text-5xl font-bold text-gray-900 mb-5!">Why Choose Us</h2>
            <p className="text-[16px] text-gray-500 leading-relaxed">
              Booking a self-driving car with us is simple and easy. You can browse our selection of
              vehicles online, choose the car that best fits your needs, and book it for the
              duration of your choice.
            </p>
          </div>

          <div className="flex items-center gap-px border border-gray-200 rounded-xl shadow-xl overflow-hidden">
            <div className="flex flex-col items-center px-10 py-6 bg-white">
              <div className="flex items-center gap-1 mb-1">
                <Trophy size={18} className="text-gray-700" />
                <span className="text-2xl font-bold text-gray-900">45k+</span>
              </div>
              <span className="text-xs text-gray-400">SuccessTour</span>
            </div>
            <div className="w-px h-16 bg-gray-200" />
            <div className="flex flex-col items-center px-10 py-6 bg-white">
              <div className="flex items-center gap-1 mb-1">
                <Users size={18} className="text-gray-700" />
                <span className="text-2xl font-bold text-gray-900">1M+</span>
              </div>
              <span className="text-xs text-gray-400">Happy Customer</span>
            </div>
            <div className="w-px h-16 bg-gray-200" />
            <div className="flex flex-col items-center px-10 py-6 bg-white">
              <div className="flex items-center gap-1 mb-1">
                <Clock size={18} className="text-gray-700" />
                <span className="text-2xl font-bold text-gray-900">3+</span>
              </div>
              <span className="text-xs text-gray-400">Year Experience</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
