import Link from 'next/link';

export default function CarCard({ car }) {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  // Generate a placeholder image URL based on the car brand and model for premium look
  // (In a real app, you would use actual image URLs from the database)
  const imageUrl = car.imageName ? `/images/${car.imageName}` : `https://source.unsplash.com/600x400/?car,${car.brand},${car.name.replace(' ', '')}`;

  return (
    <Link href={`/car/${car.id}`} style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
      <div className="car-card">
        <div className="car-image">
          {/* Using a standard img tag with the local generated image */}
          <img src={imageUrl} alt={`${car.brand} ${car.name}`} />
        </div>
        <div className="car-details">
          <h3 className="car-title">{car.year} {car.brand} {car.name}</h3>
          
          <div className="car-specs">
            <span className="spec-badge">{car.fuelType}</span>
            <span className="spec-badge">{car.transmission}</span>
            <span className="spec-badge">{car.mileage} kmpl</span>
          </div>
          
          <div className="car-price">{formatPrice(car.price)}</div>
        </div>
      </div>
    </Link>
  );
}
