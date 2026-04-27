'use client';
import { faqData } from '@/shared/lib/consts';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';

export default function FaqSection() {
  const [isOpenIndex, setIsOpenIndex] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState(faqData[2].title);

  const activeCategory = faqData.find((faq) => faq.title === activeTab);

  const handleTabClick = (title: string) => {
    setActiveTab(title);
    setIsOpenIndex(null);
  };

  const toggleAccordion = (index: number) => {
    if (isOpenIndex === index) {
      setIsOpenIndex(null);
    } else {
      setIsOpenIndex(index);
    }
  };

  return (
    <section className="w-full bg-white! py-25">
      <div className="container">
        <h2 className="text-5xl font-semibold mb-8! text-center">Have Any Question</h2>
        <div className="flex flex-wrap gap-5 justify-center mb-10!">
          {faqData.map((faq, index) => (
            <span
              key={index}
              className={`px-4 py-3 bg-white text-gray-400 rounded-sm cursor-pointer ${
                activeTab === faq.title ? 'bg-gray-200! text-black! font-semibold' : ''
              }`}
              onClick={() => handleTabClick(faq.title)}
            >
              {faq.title}
            </span>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-10">
          {activeCategory?.items.map((faq, index) => (
            <div key={index} className="mb-2!">
              <div
                className="flex items-center justify-between cursor-pointer border border-gray-300 rounded-sm px-6.25 py-4.5"
                onClick={() => toggleAccordion(index)}
              >
                <h3 className="text-[18px] font-semibold ">{faq.question}</h3>
                <ChevronDown
                  className={`${
                    isOpenIndex === index ? 'rotate-180' : ''
                  } transition-transform duration-300 ease-in-out text-gray-400`}
                />
              </div>
              {isOpenIndex === index && (
                <p className="text-gray-500 text-[16px] mt-5! leading-relaxed">{faq.answer}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
