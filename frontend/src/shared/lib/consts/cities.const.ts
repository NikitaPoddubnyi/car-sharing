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
  src: string; // Добавляем поле для ссылки
};

export const cities: ICities[] = [
  {
    name: 'Zaporizhia',
    img: zaporizhiaImg,
    src: 'https://www.google.com/maps/search/?api=1&query=Zaporizhia+Ukraine',
  },
  {
    name: 'Kyiv',
    img: kyivImg,
    src: 'https://www.google.com/maps/search/?api=1&query=Kyiv+Ukraine',
  },
  {
    name: 'Lviv',
    img: lvivImg,
    src: 'https://www.google.com/maps/search/?api=1&query=Lviv+Ukraine',
  },
  {
    name: 'Vinnitsa',
    img: vinitsaImg,
    src: 'https://www.google.com/maps/search/?api=1&query=Vinnytsia+Ukraine',
  },
  {
    name: 'Odessa',
    img: odessaImg,
    src: 'https://www.google.com/maps/search/?api=1&query=Odessa+Ukraine',
  },
  {
    name: 'Kharkiv',
    img: harkivImg,
    src: 'https://www.google.com/maps/search/?api=1&query=Kharkiv+Ukraine',
  },
  {
    name: 'Dnipro',
    img: dniproImg,
    src: 'https://www.google.com/maps/search/?api=1&query=Dnipro+Ukraine',
  },
];
