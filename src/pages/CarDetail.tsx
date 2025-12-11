import { useState } from "react";
import { ArrowLeft, Phone, Mail, Shield, Wrench, CheckCircle, Calendar, Gauge, Fuel, Settings, Heart, Share2, ShoppingCart } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export default function CarDetail() {
  const [currentImage, setCurrentImage] = useState(0);
  const navigate = useNavigate();

  const images = [
    "https://images.unsplash.com/photo-1617531653332-bd46c24f2068?w=1200&h=800&fit=crop",
    "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=1200&h=800&fit=crop",
    "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=1200&h=800&fit=crop",
    "https://images.unsplash.com/photo-1606152421802-db97b9c7a11b?w=1200&h=800&fit=crop",
    "https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=1200&h=800&fit=crop",
  ];

  const specifications = [
    { label: "Merke", value: "BMW" },
    { label: "Modell", value: "3-serie 320i X-Drive" },
    { label: "Modellår", value: "2014" },
    { label: "Kilometerstand", value: "229 500 km" },
    { label: "Drivstoff", value: "Bensin" },
    { label: "Girkasse", value: "Automat" },
    { label: "Effekt", value: "184 hk" },
    { label: "Drivhjul", value: "Firehjulstrekk (xDrive)" },
    { label: "Farge", value: "Svart" },
    { label: "EU-godkjent til", value: "16.10.2027" },
  ];

  const equipment = [
    "M-Sportpakke",
    "Head-Up Display (HUD)",
    "Navigasjon Pro",
    "Ryggekamera",
    "Elektrisk hengerfeste",
    "HiFi lydanlegg",
    "Bluetooth",
    "Sportsseter",
    "M-ratt",
    "Xenon-lys",
    "Parkeringssensorer",
    "Cruise control",
  ];

  const serviceHistory = [
    { date: "16.10.2025", mileage: "229 500", description: "Ny EU-kontroll" },
    { date: "16.10.2025", mileage: "229 500", description: "Helt nye vinterdekk med pigg" },
    { date: "02.05.2024", mileage: "196 735", description: "Oljeservice og generell kontroll" },
    { date: "06.03.2023", mileage: "171 238", description: "Oljeskift med filter, luftfilter, bremsevæske, pollenfilter, tennplugger" },
    { date: "04.06.2021", mileage: "147 053", description: "Bremsevæske skiftet" },
  ];

  const basePrice = 159000;

  const carData = {
    name: "BMW 3-serie 320i X-Drive",
    year: "2014",
    mileage: "229 500 km",
    fuel: "Bensin",
    transmission: "Automat",
    price: basePrice,
    image: images[0],
    brand: "BMW",
    model: "3-serie 320i X-Drive",
    color: "Rød",
    firstRegistration: "20.12.2018",
    chassisNumber: "VR3UHZKXZLT046115",
    registrationNumber: "AB12345",
    yearModel: "2014"
  };

  const handleBuyClick = () => {
    navigate("/handlekurv", { state: { car: carData } });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Back Button */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <Button variant="ghost" asChild>
            <Link to="/biler-til-salgs">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Tilbake til oversikt
            </Link>
          </Button>
        </div>
      </div>

      {/* Image Gallery */}
      <div className="bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="relative rounded-xl overflow-hidden shadow-lg">
            <img 
              src={images[currentImage]} 
              alt={`BMW 3-serie bilde ${currentImage + 1}`}
              className="w-full h-[400px] md:h-[600px] object-cover"
            />
            <div className="absolute top-4 right-4 flex gap-2">
              <Button size="icon" variant="secondary" className="bg-white/90 hover:bg-white">
                <Heart className="h-5 w-5" />
              </Button>
              <Button size="icon" variant="secondary" className="bg-white/90 hover:bg-white">
                <Share2 className="h-5 w-5" />
              </Button>
            </div>
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 backdrop-blur-sm px-3 py-1 rounded-full text-white text-sm">
              {currentImage + 1} / {images.length}
            </div>
          </div>
          
          {/* Thumbnail Gallery */}
          <div className="grid grid-cols-5 gap-3 mt-4">
            {images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentImage(idx)}
                className={`rounded-lg overflow-hidden border-2 transition-all ${
                  currentImage === idx ? 'border-button-teal scale-105' : 'border-transparent hover:border-button-teal/50'
                }`}
              >
                <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-20 object-cover" />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Main Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header */}
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                BMW 3-serie 320i X-Drive
              </h1>
              <p className="text-lg text-foreground/70">
                184hk / M-Sport / X-Drive / HUD / Ny EU/Safe
              </p>
              <div className="flex flex-wrap gap-2 mt-4">
                <Badge variant="secondary" className="bg-button-teal/10 text-button-teal">M-Sport</Badge>
                <Badge variant="secondary" className="bg-button-teal/10 text-button-teal">Head-Up Display</Badge>
                <Badge variant="secondary" className="bg-button-teal/10 text-button-teal">Firehjulstrekk</Badge>
              </div>
            </div>

            <Separator />

            {/* Description */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-button-teal" />
                  Beskrivelse
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-foreground">
                <p className="font-semibold">
                  Meget pen og velholdt BMW 320i xDrive med M-Sportpakke og automatgir.
                </p>
                <p>
                  Dette er en bil som kombinerer sportslighet, komfort og trygghet på en måte som få andre klarer.
                </p>
                <p>
                  Med BMWs xDrive-firehjulstrekk får du fremkommelighet og stabilitet året rundt, og med 184hk bensinmotor har bilen god respons og lavt støynivå.
                </p>
                <p>
                  M-Sportpakke gir bilen et mer eksklusivt og sportslig preg, med strammere understell, M-ratt, sportsseter og spesielle støtfangere og detaljer.
                </p>
                <p>
                  Head-Up Display (HUD) projiserer hastighet og navigasjon rett på frontruten, slik at du slipper å ta blikket bort fra veien.
                </p>
                <p className="text-sm italic text-foreground/70">
                  Bilen har en liten skade på frontfanger på passasjersiden.
                </p>
                <div className="bg-success/10 border border-success/20 rounded-lg p-4 mt-4">
                  <p className="font-semibold text-success flex items-center gap-2">
                    <CheckCircle className="h-4 w-4" />
                    Fikk helt nye vinterdekk 16.10.2025 med pigg
                  </p>
                  <p className="font-semibold text-success flex items-center gap-2 mt-2">
                    <CheckCircle className="h-4 w-4" />
                    Ny EU kontroll 16.10.2025
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Specifications */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5 text-button-teal" />
                  Tekniske data
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {specifications.map((spec, idx) => (
                    <div key={idx} className="flex justify-between border-b border-border pb-2">
                      <span className="text-foreground/60">{spec.label}</span>
                      <span className="font-semibold text-foreground">{spec.value}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Equipment */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-button-teal" />
                  Utstyr
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-3">
                  {equipment.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-button-teal flex-shrink-0" />
                      <span className="text-foreground">{item}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Service History */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wrench className="h-5 w-5 text-button-teal" />
                  Servicehistorikk
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {serviceHistory.map((service, idx) => (
                    <div key={idx} className="border-l-2 border-button-teal pl-4 pb-4">
                      <div className="flex items-center gap-2 mb-1">
                        <Calendar className="h-4 w-4 text-button-teal" />
                        <span className="font-semibold text-foreground">{service.date}</span>
                        <span className="text-foreground/70">• {service.mileage} km</span>
                      </div>
                      <p className="text-foreground">{service.description}</p>
                    </div>
                  ))}
                  <p className="text-sm text-foreground/80 italic">
                    Bilen leveres med ny service utført før utlevering.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Dealer Info */}
            <Card className="bg-gradient-primary text-primary-foreground">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Trygghet hos Superia Cars
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  Hos Superia Cars skal det være trygt, enkelt og forutsigbart å kjøpe bil.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                    <span>Alle biler leveres fri for heftelser</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                    <span>Verkstedkontrollert før utlevering</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                    <span>Bruktbilgaranti opptil 3 år</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                    <span>Fleksible finansieringsløsninger</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                    <span>Over 50 års erfaring i bruktbilbransjen</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Price & Contact */}
          <div className="lg:col-span-1">
            <div className="sticky top-4 space-y-4">
              {/* Price Card */}
              <Card className="border-2 border-button-teal">
                <CardContent className="pt-6">
                  <div className="text-center mb-6">
                    <p className="text-foreground/60 mb-2">Totalpris</p>
                    <p className="text-4xl font-bold text-button-teal">159 000 kr</p>
                  </div>

                  <Separator className="my-6" />

                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-foreground/60 flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        År
                      </span>
                      <span className="font-semibold">2014</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-foreground/60 flex items-center gap-1">
                        <Gauge className="h-4 w-4" />
                        Kilometerstand
                      </span>
                      <span className="font-semibold">229 500 km</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-foreground/60 flex items-center gap-1">
                        <Fuel className="h-4 w-4" />
                        Drivstoff
                      </span>
                      <span className="font-semibold">Bensin</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-foreground/60 flex items-center gap-1">
                        <Settings className="h-4 w-4" />
                        Girkasse
                      </span>
                      <span className="font-semibold">Automat</span>
                    </div>
                  </div>

                  <Separator className="my-6" />

                  <div className="space-y-3">
                    <Button 
                      className="w-full bg-purchase-green hover:bg-purchase-green/90 text-purchase-green-foreground" 
                      size="lg"
                      onClick={handleBuyClick}
                    >
                      <ShoppingCart className="mr-2 h-5 w-5" />
                      Kjøp
                    </Button>
                    <Button className="w-full bg-button-teal hover:bg-button-teal/90 text-button-teal-foreground" size="lg">
                      <Phone className="mr-2 h-5 w-5" />
                      Ring oss
                    </Button>
                    <Button className="w-full" variant="secondary" size="lg">
                      <Mail className="mr-2 h-5 w-5" />
                      Send melding
                    </Button>
                  </div>

                  <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                    <p className="text-sm text-foreground/80 mb-2">
                      <strong>Finansiering fra:</strong>
                    </p>
                    <p className="text-2xl font-bold text-button-teal mb-1">2 187 kr/mnd</p>
                    <p className="text-xs text-foreground/60">
                      Egenkapital: 55 650 kr<br />
                      Eff.rente 8,97%. 103 350 kr o/5 år
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Warranty Card */}
              <Card className="bg-success/10 border-success/20">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-3">
                    <Shield className="h-6 w-6 text-success flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-bold text-foreground mb-2">Garanti tilgjengelig</h3>
                      <p className="text-sm text-foreground">
                        På denne bilen kan du få inntil 36 måneders garanti til kampanjepris!
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
