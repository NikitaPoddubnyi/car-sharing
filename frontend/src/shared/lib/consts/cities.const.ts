import {
  dniproImg,
  harkivImg,
  kyivImg,
  lvivImg,
  odessaImg,
  vinitsaImg,
  zaporizhiaImg,
} from '@/assets';
import { StaticImageData } from 'next/image';

export type ICities = {
  name: string;
  img: StaticImageData;
};

export const cities: ICities[] = [
  {
    name: 'Zaporizhia',
    img: zaporizhiaImg,
  },
  {
    name: 'Kyiv',
    img: kyivImg,
  },
  {
    name: 'Lviv',
    img: lvivImg,
  },
  {
    name: 'Vinnitsa',
    img: vinitsaImg,
  },
  {
    name: 'Odessa',
    img: odessaImg,
  },
  {
    name: 'Kharkiv',
    img: harkivImg,
  },
  {
    name: 'Dnipro',
    img: dniproImg,
  },
];
