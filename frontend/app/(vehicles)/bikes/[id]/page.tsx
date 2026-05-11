import { notFound } from 'next/navigation';
import { CarApi } from '@/entities/car';
import { BikeApi } from '@/entities/bike';

export default async function CarPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const bike = await BikeApi.getOne(id);

  if (!bike) {
    notFound();
  }

  return (
    <main className="flex min-h-screen flex-col items-center p-10">
      <h1 className="text-2xl font-bold">
        {bike.brand} {bike.model}
      </h1>
      <p>Год: {bike.year}</p>
      <p>Цена: ${bike.pricePerDay} / день</p>
    </main>
  );
}
