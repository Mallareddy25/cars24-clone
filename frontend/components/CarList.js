import CarCard from './CarCard';

export default function CarList({ cars }) {
  if (!cars || cars.length === 0) {
    return (
      <div className="no-results">
        <h2>No cars found.</h2>
        <p>Try adjusting your search query or filters.</p>
      </div>
    );
  }

  return (
    <div className="car-grid">
      {cars.map(car => (
        <CarCard key={car.id} car={car} />
      ))}
    </div>
  );
}
