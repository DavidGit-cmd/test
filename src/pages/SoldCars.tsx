import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, DollarSign, User } from "lucide-react";

interface SoldCar {
  id: number;
  brand: string;
  model: string;
  year: number;
  soldDate: string;
  soldPrice: number;
  buyer: string;
  regNum: string;
}

const soldCars: SoldCar[] = [
  {
    id: 1,
    brand: "BMW",
    model: "3-serie 320i",
    year: 2016,
    soldDate: "2024-11-15",
    soldPrice: 159000,
    buyer: "Ola Nordmann",
    regNum: "AB12345"
  },
  {
    id: 2,
    brand: "Audi",
    model: "A4 Avant 2.0 TDI",
    year: 2017,
    soldDate: "2024-11-20",
    soldPrice: 219000,
    buyer: "Kari Hansen",
    regNum: "BC23456"
  },
  {
    id: 3,
    brand: "Volkswagen",
    model: "Golf 1.5 TSI",
    year: 2020,
    soldDate: "2024-11-22",
    soldPrice: 279000,
    buyer: "Per Jensen",
    regNum: "CD34567"
  }
];

export default function SoldCars() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground mb-2">Solgte biler</h1>
              <p className="text-foreground/60">{soldCars.length} solgte biler totalt</p>
            </div>
            <Badge variant="secondary" className="text-lg px-4 py-2">
              Internt bruk
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {soldCars.map((car) => (
            <Card key={car.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="md:col-span-2">
                    <h3 className="font-bold text-xl mb-2 text-foreground">
                      {car.brand} {car.model}
                    </h3>
                    <p className="text-foreground/70">
                      Årsmodell: {car.year}
                    </p>
                    <p className="text-foreground/70">
                      Reg.nr: {car.regNum}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-foreground/70">
                      <Calendar className="h-4 w-4" />
                      <span className="text-sm">Solgt: {new Date(car.soldDate).toLocaleDateString('no-NO')}</span>
                    </div>
                    <div className="flex items-center gap-2 text-foreground/70">
                      <User className="h-4 w-4" />
                      <span className="text-sm">{car.buyer}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-end">
                    <div className="text-right">
                      <div className="flex items-center gap-2 text-button-teal">
                        <DollarSign className="h-5 w-5" />
                        <span className="text-2xl font-bold">
                          {car.soldPrice.toLocaleString('no-NO')} kr
                        </span>
                      </div>
                      <p className="text-sm text-foreground/60 mt-1">Salgspris</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
