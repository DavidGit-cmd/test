import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, User, AlertCircle } from "lucide-react";

interface ReturnedCar {
  id: number;
  brand: string;
  model: string;
  year: number;
  returnDate: string;
  returnReason: string;
  owner: string;
  regNum: string;
  status: "pending" | "processed";
}

const returnedCars: ReturnedCar[] = [
  {
    id: 1,
    brand: "Tesla",
    model: "Model 3 Long Range",
    year: 2021,
    returnDate: "2024-11-25",
    returnReason: "Kunde ønsket å levere tilbake etter prøveperiode",
    owner: "Lars Olsen",
    regNum: "EF45678",
    status: "pending"
  },
  {
    id: 2,
    brand: "Ford",
    model: "Focus 1.0 EcoBoost",
    year: 2019,
    returnDate: "2024-11-18",
    returnReason: "Tekniske problemer - garantisak",
    owner: "Anne Bergesen",
    regNum: "FG56789",
    status: "processed"
  }
];

export default function ReturnedCars() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground mb-2">Tilbakeleverte biler</h1>
              <p className="text-foreground/60">{returnedCars.length} tilbakeleverte biler</p>
            </div>
            <Badge variant="secondary" className="text-lg px-4 py-2">
              Internt bruk
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {returnedCars.map((car) => (
            <Card key={car.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
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
                      <span className="text-sm">
                        Tilbakelevert: {new Date(car.returnDate).toLocaleDateString('no-NO')}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-foreground/70">
                      <User className="h-4 w-4" />
                      <span className="text-sm">{car.owner}</span>
                    </div>
                    <div className="flex items-start gap-2 text-foreground/70">
                      <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{car.returnReason}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-end">
                    <Badge 
                      variant={car.status === "processed" ? "secondary" : "default"}
                      className="text-sm px-4 py-2"
                    >
                      {car.status === "processed" ? "Behandlet" : "Venter på behandling"}
                    </Badge>
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
