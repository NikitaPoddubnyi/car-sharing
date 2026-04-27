import { BikeRentalImg, CarRentalImg } from '@/assets';
import type { StaticImageData } from 'next/image';

export type IRent = {
  title: string;
  description: string;
  path: string;
  img: StaticImageData;
  text: string;
};

export type IAdvantages = {
  id: number;
  title: string;
};

export const rent: IRent[] = [
  {
    title: 'Rent A Car',
    description:
      'Booking a self-driving car with us is simple and easy. You can browse our selection of vehicles online, choose the car that best fits your needs, and book it for the duration of your choice. Our user-friendly platform allows you to manage your bookings and view your trip history with ease.',
    path: '/cars',
    img: CarRentalImg,
    text: 'Rent Car',
  },
  {
    title: 'Rent A Bike',
    description:
      'Booking a self-driving bike with us is simple and easy. You can browse our selection of vehicles online, choose the bike that best fits your needs, and book it for the duration of your choice. Our user-friendly platform allows you to manage your bookings and view your trip history with ease.',
    path: '/bikes',
    img: BikeRentalImg,
    text: 'Rent Bike',
  },
];

export const advantages: IAdvantages[] = [
  {
    id: 1,
    title: 'Luxury',
  },
  {
    id: 2,
    title: 'Comfort',
  },

  {
    id: 3,
    title: 'Prestige',
  },
];
