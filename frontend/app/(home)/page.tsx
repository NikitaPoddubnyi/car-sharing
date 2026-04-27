import {
  ChooseUsSection,
  CitiesSection,
  CustomerSayingSection,
  FaqSection,
  HomeHeader,
  RentSection,
  ShareSection,
} from '@/widgets/ui/home';

export default function Home() {
  return (
    <>
      <HomeHeader />
      <RentSection />
      <ShareSection />
      <ChooseUsSection />
      <CustomerSayingSection />
      <CitiesSection />
      <FaqSection />
    </>
  );
}
