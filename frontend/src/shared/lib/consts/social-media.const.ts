import { Facebook, Instagram, Linkedin, Twitter } from "@/assets";
import { StaticImageData } from "next/image";

export type ISocialLink = {
	icon: StaticImageData;
	href: string;
	label: string;
};

export const socialLinks: ISocialLink[] = [
  { icon: Facebook, href: 'https://facebook.com', label: 'Facebook' },
  { icon: Twitter, href: 'https://twitter.com', label: 'Twitter' },
  { icon: Instagram, href: 'https://instagram.com', label: 'Instagram' },
  { icon: Linkedin, href: 'https://linkedin.com', label: 'Linkedin' },
];