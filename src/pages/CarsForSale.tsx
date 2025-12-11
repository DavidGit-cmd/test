import { Heart, Gauge, Calendar, Fuel, Settings } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

interface Car {
  id: number;
  brand: string;
  model: string;
  year: number;
  mileage: number;
  fuel: string;
  transmission: string;
  price: number;
  image: string;
  condition: string;
}

const cars: Car[] = [
  {
    id: 1,
    brand: "Mercedes-Benz",
    model: "Sprinter 9-seater",
    year: 2019,
    mileage: 314800,
    fuel: "Diesel",
    transmission: "Automat",
    price: 429000,
    image: "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800&h=600&fit=crop",
    condition: "Rutehøyde"
  },
  {
    id: 2,
    brand: "BMW",
    model: "3-serie 320i",
    year: 2016,
    mileage: 229500,
    fuel: "Bensin",
    transmission: "Automat",
    price: 159000,
    image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&h=600&fit=crop",
    condition: "M-Sport"
  },
  {
    id: 3,
    brand: "Audi",
    model: "A4 Avant 2.0 TDI",
    year: 2017,
    mileage: 185000,
    fuel: "Diesel",
    transmission: "Automat",
    price: 219000,
    image: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&h=600&fit=crop",
    condition: "Quattro"
  },
  {
    id: 4,
    brand: "Volvo",
    model: "XC60 D4 AWD",
    year: 2018,
    mileage: 156000,
    fuel: "Diesel",
    transmission: "Automat",
    price: 329000,
    image: "https://images.unsplash.com/photo-1617654112368-307921291f42?w=800&h=600&fit=crop",
    condition: "Inscription"
  },
  {
    id: 5,
    brand: "Volkswagen",
    model: "Golf 1.5 TSI",
    year: 2020,
    mileage: 67000,
    fuel: "Bensin",
    transmission: "Manuell",
    price: 279000,
    image: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&h=600&fit=crop",
    condition: "Highline"
  },
  {
    id: 6,
    brand: "Tesla",
    model: "Model 3 Long Range",
    year: 2021,
    mileage: 45000,
    fuel: "El",
    transmission: "Automat",
    price: 389000,
    image: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800&h=600&fit=crop",
    condition: "Premium"
  },
  {
    id: 7,
    brand: "Ford",
    model: "Focus 1.0 EcoBoost",
    year: 2019,
    mileage: 98000,
    fuel: "Bensin",
    transmission: "Manuell",
    price: 189000,
    image: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800&h=600&fit=crop",
    condition: "Titanium"
  },
  {
    id: 8,
    brand: "Toyota",
    model: "RAV4 Hybrid",
    year: 2020,
    mileage: 72000,
    fuel: "Hybrid bensin",
    transmission: "Automat",
    price: 429000,
    image: "https://images.unsplash.com/photo-1581540222194-0def2dda95b8?w=800&h=600&fit=crop",
    condition: "AWD"
  },
  {
    id: 9,
    brand: "Skoda",
    model: "Octavia Combi 2.0 TDI",
    year: 2018,
    mileage: 134000,
    fuel: "Diesel",
    transmission: "Automat",
    price: 239000,
    image: "https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=800&h=600&fit=crop",
    condition: "Style"
  },
  {
    id: 10,
    brand: "Hyundai",
    model: "Kona Electric",
    year: 2021,
    mileage: 38000,
    fuel: "El",
    transmission: "Automat",
    price: 319000,
    image: "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=800&h=600&fit=crop",
    condition: "64 kWh"
  },
  {
    id: 11,
    brand: "BMW",
    model: "3-serie 320i X-Drive",
    year: 2014,
    mileage: 229500,
    fuel: "Bensin",
    transmission: "Automat",
    price: 159000,
    image: "https://images.unsplash.com/photo-1617531653332-bd46c24f2068?w=800&h=600&fit=crop",
    condition: "M-Sport HUD"
  }
];

export default function CarsForSale() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Results Header */}
        <div className="mb-6">
          <p className="text-foreground/60 mb-4">{cars.length} treff</p>
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-foreground">Biler til salgs</h1>
          </div>
        </div>

        {/* Car Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cars.map((car) => (
            <Card key={car.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300 animate-fade-in">
              <div className="relative">
                <img 
                  src={car.image} 
                  alt={`${car.brand} ${car.model}`}
                  className="w-full h-48 object-cover"
                />
                <button 
                  className="absolute top-3 right-3 bg-white/90 hover:bg-white p-2 rounded-full transition-colors"
                  aria-label="Legg til favoritter"
                >
                  <Heart className="h-5 w-5 text-foreground/60" />
                </button>
              </div>
              
              <CardContent className="p-4">
                <h3 className="font-bold text-lg mb-2 text-foreground">
                  {car.brand} {car.model}
                </h3>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-4 text-sm text-foreground/70">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>{car.year}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Gauge className="h-4 w-4" />
                      <span>{car.mileage.toLocaleString('no-NO')} km</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-foreground/70">
                    <div className="flex items-center gap-1">
                      <Fuel className="h-4 w-4" />
                      <span>{car.fuel}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Settings className="h-4 w-4" />
                      <span>{car.transmission}</span>
                    </div>
                  </div>
                  
                  <Badge variant="secondary" className="mt-2">
                    {car.condition}
                  </Badge>
                </div>
                
                <div className="pt-4 border-t border-border">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-2xl font-bold text-button-teal">
                      {car.price.toLocaleString('no-NO')} kr
                    </span>
                  </div>
                  
                  <div className="text-xs text-foreground/60 mb-3">
                    Forhandler · Superia Cars · 6 mnd garanti
                  </div>
                  
                  {car.id === 11 ? (
                    <Button asChild className="w-full bg-button-teal hover:bg-button-teal/90 text-button-teal-foreground">
                      <Link to={`/superia-markets/biler-til-salgs/${car.id}`}>Se detaljer</Link>
                    </Button>
                  ) : (
                    <Button className="w-full bg-button-teal hover:bg-button-teal/90 text-button-teal-foreground">
                      Se detaljer
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
