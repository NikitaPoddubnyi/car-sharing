import { notFound } from 'next/navigation';
import { CarApi } from '@/entities/car';

export default async function CarPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const car = await CarApi.getOne(id);

  if (!car) {
    notFound();
  }

  return (
    <main className="flex min-h-screen flex-col items-center p-10">
      <h1 className="text-2xl font-bold">
        {car.brand} {car.model}
      </h1>
      <p>Год: {car.year}</p>
      <p>Цена: ${car.pricePerDay} / день</p>
    </main>
  );
}
