import { CustomerSayingImg, CustomerSayingImg2, CustomerSayingImg3 } from '@/assets';
import { StaticImageData } from 'next/image';

export type ICustomerSaying = {
  name: string;
  text: string;
  img: StaticImageData;
};

export const customerSaying = [
  {
    name: 'Rover Harvest',
    text: 'We have been using Rentaly for our trips needs for several years now and have always been happy with their service. Their customer support is Excellent Service! and they are always available to help with any issues we have. Their prices are also very competitive.',
    img: CustomerSayingImg,
  },
  {
    name: 'Jovan Reels',
    text: 'I have been using Rentaly for my Car Rental needs for over 5 years now. I have never had any problems with their service. Their customer support is always responsive and helpful. I would recommend Rentaly to anyone looking for a reliable Car Rental provider.',
    img: CustomerSayingImg2,
  },
  {
    name: 'Kanesha Keyton',
    text: 'Endorsed by industry experts, Rentaly is the Car Rental solution you can trust. With years of experience in the field, we provide fast, reliable and secure Car Rental services.',
    img: CustomerSayingImg3,
  },
];
