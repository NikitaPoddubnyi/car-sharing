const cars = [
  { id: 1, name: 'Tesla Model 3', price: 10 },
  { id: 2, name: 'BMW i3', price: 8 },
];

export default function Cars() {
  return (
    <main className="p-6">
      <h1 className="text-xl font-bold mb-4">Доступные авто 🚗</h1>

      <div className="grid gap-4">
        {cars.map((car) => (
          <div key={car.id} className="border p-4 rounded-xl">
            <p className="font-semibold">{car.name}</p>
            <p className="text-gray-500">{car.price}$/час</p>
          </div>
        ))}
      </div>
    </main>
  );
}
