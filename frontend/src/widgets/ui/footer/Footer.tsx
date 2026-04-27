import { mainLinks, socialLinks, vehicleTypes } from "@/shared/lib/consts";
import { cities } from "@/shared/lib/consts/cities.const";
import Image from "next/image";
import Link from "next/link";


export default function Footer() {
	return (
		<footer className="w-full bg-mist-950 pt-19 pb-12">
			<div className="px-35! max-w-360 mx-auto!">
				<div className="grid grid-cols-4 gap-8">
					<div className="">
						<h4 className="text-3xl font-semibold text-white mb-2.75!">Drivee</h4>
						<p className="text-[18px] text-gray-400 leading-relaxed">
							Is Just A Drivee Ride Away. Take Control Of You Journey Today
						</p>
						<div className="flex flex-row gap-6 mt-9!">
							{socialLinks.map((item, index) => (
								<Link
									key={index}
									href={item.href}
									target="_blank"
									className="w-9 h-9 flex items-center hover:text-gray-600 hover:-translate-y-0.5 justify-center rounded-full transition-colors"
								>
									<Image
										src={item.icon}
										width={28}
										height={28}
										alt={item.label}
									/>
								</Link>
							))}
						</div>
					</div>
					<div className="ml-25!">
						<h6 className="text-xl font-semibold text-white mb-2.75! ">About Company</h6>
						<ul className="text-sm text-gray-400 leading-relaxed list-disc list-inside">
							{mainLinks.map((item, index) => (
								<li key={index}>
									<Link href={item.src} className="hover:text-gray-100! transition-colors">{item.name}</Link>
								</li>
							))}
						</ul>
					</div>

					<div className="ml-25!">
						<h6 className="text-xl font-semibold text-white mb-2.75! ">Cities</h6>
						<ul className="text-sm text-gray-400 leading-relaxed list-disc list-inside">
							{cities	.map((item, index) => (
								<li key={index}>
									<Link href={item.src} className="hover:text-gray-100! transition-colors">{item.name}</Link>
								</li>
							))}
						</ul>
					</div>
				
					<div className="ml-8!">
						<h6 className="text-xl font-semibold text-white mb-2.75! ">Vehicle Types</h6>
						<ul className="text-sm text-gray-400 leading-relaxed list-disc list-inside">
							{vehicleTypes.map((item, index) => (
								<li key={index}>
									<Link href={item.src} className="hover:text-gray-100! transition-colors">{item.name}</Link>
								</li>
							))}
						</ul>
					</div>
				</div>
			</div>
		</footer>
	);
}