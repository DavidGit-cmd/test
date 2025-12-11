import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, ShoppingCart } from "lucide-react";
import { toast } from "sonner";
import jsPDF from "jspdf";

interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
}

const services: Service[] = [
  {
    id: "financing",
    name: "Lånefinansiering",
    description: "Få en skreddersydd finansieringsløsning tilpasset dine behov. Vi samarbeider med ledende banker for å sikre deg de beste rentene og betingelsene.",
    price: 0,
  },
  {
    id: "warranty-12",
    name: "Garanti 12 måneder",
    description: "Omfattende garanti som dekker motor, girkasse, og andre kritiske komponenter i 12 måneder. Inkluderer assistanse ved veikanten 24/7.",
    price: 12900,
  },
  {
    id: "warranty-24",
    name: "Garanti 24 måneder",
    description: "Utvidet garanti med full dekning i 24 måneder. Gir deg ekstra trygghet og beskyttelse mot uventede reparasjonskostnader.",
    price: 22900,
  },
  {
    id: "warranty-36",
    name: "Garanti 36 måneder",
    description: "Maksimal beskyttelse med vår 36 måneders garanti. Omfattende dekning som sikrer verdien på investeringen din.",
    price: 32900,
  },
  {
    id: "polishing",
    name: "Profesjonell Polering",
    description: "Komplett ytre behandling med maskinpolering som fjerner riper og skader. Gir bilen en speilblank finish.",
    price: 4900,
  },
  {
    id: "paint-sealing",
    name: "Lakkforsegling",
    description: "Keramisk lakkforsegling som beskytter lakken mot værets påkjenninger. Gir langvarig glans og letter fremtidig vedlikehold.",
    price: 6900,
  },
  {
    id: "interior-cleaning",
    name: "Interiørbehandling",
    description: "Grundig innvendig rengjøring og behandling. Inkluderer dampvask, såpebehandling av seter, og impregnering.",
    price: 3900,
  },
  {
    id: "new-tires",
    name: "Nye Dekk",
    description: "Sett med fire nye kvalitetsdekk fra anerkjente merker. Monteringen er inkludert i prisen.",
    price: 8900,
  },
  {
    id: "new-rims",
    name: "Nye Felger",
    description: "Oppgrader til nye aluminiumsfelger. Vi har et bredt utvalg av design og størrelser som passer din bil.",
    price: 15900,
  },
  {
    id: "delivery",
    name: "Levering av Bil",
    description: "Vi leverer bilen trygt til din adresse hvor som helst i Norge. Profesjonell transport med full forsikring.",
    price: 4900,
  },
];

const Cart = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const carData = location.state?.car;

  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    phone: "",
    email: "",
  });

  if (!carData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle>Ingen bil valgt</CardTitle>
            <CardDescription>Vennligst gå tilbake og velg en bil først.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate("/biler-til-salgs")} className="w-full">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Tilbake til biler
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const toggleService = (serviceId: string) => {
    setSelectedServices((prev) =>
      prev.includes(serviceId) ? prev.filter((id) => id !== serviceId) : [...prev, serviceId]
    );
  };

  const calculateTotal = () => {
    const servicesTotal = selectedServices.reduce((sum, serviceId) => {
      const service = services.find((s) => s.id === serviceId);
      return sum + (service?.price || 0);
    }, 0);
    return carData.price + servicesTotal;
  };

  const handlePurchase = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerInfo.name || !customerInfo.phone || !customerInfo.email) {
      toast.error("Vennligst fyll ut all kontaktinformasjon");
      return;
    }

    // Generate PDF
    const pdf = new jsPDF();
    let yPos = 20;

    // Header
    pdf.setFontSize(20);
    pdf.text("Kjøpekontrakt", 105, yPos, { align: "center" });
    yPos += 15;

    // Customer Information
    pdf.setFontSize(14);
    pdf.text("Kundeinformasjon", 20, yPos);
    yPos += 8;
    pdf.setFontSize(11);
    pdf.text(`Navn: ${customerInfo.name}`, 20, yPos);
    yPos += 6;
    pdf.text(`Telefon: ${customerInfo.phone}`, 20, yPos);
    yPos += 6;
    pdf.text(`E-post: ${customerInfo.email}`, 20, yPos);
    yPos += 12;

    // Car Details
    pdf.setFontSize(14);
    pdf.text("Bildetaljer", 20, yPos);
    yPos += 8;
    pdf.setFontSize(11);
    pdf.text(`Bil: ${carData.name}`, 20, yPos);
    yPos += 6;
    pdf.text(`Merke: ${carData.brand}`, 20, yPos);
    yPos += 6;
    pdf.text(`Modell: ${carData.model}`, 20, yPos);
    yPos += 6;
    pdf.text(`Farge: ${carData.color}`, 20, yPos);
    yPos += 6;
    pdf.text(`Førstegangsregistrert: ${carData.firstRegistration}`, 20, yPos);
    yPos += 6;
    pdf.text(`Chassisnummer: ${carData.chassisNumber}`, 20, yPos);
    yPos += 6;
    pdf.text(`Registreringsnummer: ${carData.registrationNumber}`, 20, yPos);
    yPos += 6;
    pdf.text(`Årsmodell: ${carData.yearModel}`, 20, yPos);
    yPos += 6;
    pdf.text(`Km-stand: ${carData.mileage}`, 20, yPos);
    yPos += 6;
    pdf.text(`Drivstoff: ${carData.fuel}`, 20, yPos);
    yPos += 6;
    pdf.text(`Girkasse: ${carData.transmission}`, 20, yPos);
    yPos += 6;
    pdf.text(`Pris: ${carData.price.toLocaleString("nb-NO")} kr`, 20, yPos);
    yPos += 12;

    // Selected Services
    if (selectedServices.length > 0) {
      pdf.setFontSize(14);
      pdf.text("Tilleggstjenester", 20, yPos);
      yPos += 8;
      pdf.setFontSize(11);

      selectedServices.forEach((serviceId) => {
        const service = services.find((s) => s.id === serviceId);
        if (service) {
          const priceText = service.price === 0 ? "Gratis" : `${service.price.toLocaleString("nb-NO")} kr`;
          pdf.text(`${service.name}: ${priceText}`, 20, yPos);
          yPos += 6;
          
          // Add description with text wrapping
          const descLines = pdf.splitTextToSize(service.description, 170);
          pdf.setFontSize(9);
          pdf.setTextColor(100);
          descLines.forEach((line: string) => {
            pdf.text(line, 25, yPos);
            yPos += 4;
          });
          pdf.setFontSize(11);
          pdf.setTextColor(0);
          yPos += 4;
        }
      });
    }

    yPos += 6;

    // Total
    pdf.setFontSize(14);
    pdf.text(`Totalt: ${calculateTotal().toLocaleString("nb-NO")} kr`, 20, yPos);

    // Save PDF
    pdf.save(`Kjøpekontrakt_${carData.name.replace(/\s+/g, "_")}_${new Date().toISOString().split("T")[0]}.pdf`);

    toast.success("Takk for din bestilling! Kjøpekontrakten er lastet ned.");
    console.log("Purchase:", { car: carData, services: selectedServices, customer: customerInfo });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Tilbake
        </Button>

        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
            <ShoppingCart className="h-8 w-8" />
            Handlekurv
          </h1>
          <p className="text-foreground/80">Tilpass ditt kjøp med tilleggstjenester</p>
        </div>

        {/* Car Summary Card */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="aspect-video rounded-lg overflow-hidden">
                <img
                  src={carData.image}
                  alt={carData.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex flex-col justify-between">
                <div>
                  <h2 className="text-2xl font-bold mb-2">{carData.name}</h2>
                  <div className="space-y-1 text-sm text-foreground/80 mb-4">
                    <p>{carData.year} • {carData.mileage}</p>
                    <p>{carData.fuel} • {carData.transmission}</p>
                  </div>
                  
                  <Separator className="my-4" />
                  
                  <div className="space-y-2">
                    <h3 className="text-sm font-semibold text-foreground/90 mb-2">Kjøretøybeskrivelse</h3>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs">
                      <div className="flex justify-between">
                        <span className="text-foreground/60">Merke:</span>
                        <span className="font-medium">{carData.brand || carData.name.split(' ')[0]}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-foreground/60">Modell:</span>
                        <span className="font-medium">{carData.model || carData.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-foreground/60">Farge:</span>
                        <span className="font-medium">{carData.color || "N/A"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-foreground/60">Førstegangsreg.:</span>
                        <span className="font-medium">{carData.firstRegistration || "N/A"}</span>
                      </div>
                      <div className="flex justify-between col-span-2">
                        <span className="text-foreground/60">Chassisnummer:</span>
                        <span className="font-medium">{carData.chassisNumber || "N/A"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-foreground/60">Reg.nummer:</span>
                        <span className="font-medium">{carData.registrationNumber || "N/A"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-foreground/60">Årsmodell:</span>
                        <span className="font-medium">{carData.yearModel || carData.year}</span>
                      </div>
                      <div className="flex justify-between col-span-2">
                        <span className="text-foreground/60">Km-stand:</span>
                        <span className="font-medium">{carData.mileage}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-right mt-4">
                  <p className="text-sm text-foreground/60 mb-1">Bilpris</p>
                  <p className="text-3xl font-bold">{carData.price.toLocaleString("nb-NO")} kr</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Services */}
        <div className="space-y-4 mb-8">
          <h2 className="text-2xl font-bold">Tilleggstjenester</h2>
          {services.map((service) => (
            <Card
              key={service.id}
              className={`cursor-pointer transition-all ${
                selectedServices.includes(service.id)
                  ? "border-purchase-green bg-purchase-green/5"
                  : "hover:border-border/60"
              }`}
              onClick={() => toggleService(service.id)}
            >
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 flex-1">
                    <Checkbox
                      checked={selectedServices.includes(service.id)}
                      onCheckedChange={() => toggleService(service.id)}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <CardTitle className="text-lg mb-1">{service.name}</CardTitle>
                      <CardDescription className="text-foreground/70">
                        {service.description}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="text-right whitespace-nowrap">
                    <p className="text-lg font-semibold">
                      {service.price === 0 ? "Gratis" : `${service.price.toLocaleString("nb-NO")} kr`}
                    </p>
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>

        {/* Customer Information */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Kontaktinformasjon</CardTitle>
            <CardDescription>
              Vi sender deg digital kjøpekontrakt for signering
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePurchase} className="space-y-4">
              <div>
                <Label htmlFor="name">Fullt navn *</Label>
                <Input
                  id="name"
                  value={customerInfo.name}
                  onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                  placeholder="Ola Nordmann"
                  required
                />
              </div>
              <div>
                <Label htmlFor="phone">Telefonnummer *</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={customerInfo.phone}
                  onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                  placeholder="+47 123 45 678"
                  required
                />
              </div>
              <div>
                <Label htmlFor="email">E-postadresse *</Label>
                <Input
                  id="email"
                  type="email"
                  value={customerInfo.email}
                  onChange={(e) => setCustomerInfo({ ...customerInfo, email: e.target.value })}
                  placeholder="ola@example.com"
                  required
                />
              </div>

              <Separator className="my-6" />

              {/* Total */}
              <div className="space-y-2">
                <div className="flex justify-between text-foreground/80">
                  <span>Bilpris</span>
                  <span>{carData.price.toLocaleString("nb-NO")} kr</span>
                </div>
                {selectedServices.length > 0 && (
                  <div className="flex justify-between text-foreground/80">
                    <span>Tilleggstjenester</span>
                    <span>
                      {selectedServices
                        .reduce((sum, id) => {
                          const service = services.find((s) => s.id === id);
                          return sum + (service?.price || 0);
                        }, 0)
                        .toLocaleString("nb-NO")}{" "}
                      kr
                    </span>
                  </div>
                )}
                <Separator />
                <div className="flex justify-between text-2xl font-bold">
                  <span>Totalt</span>
                  <span>{calculateTotal().toLocaleString("nb-NO")} kr</span>
                </div>
              </div>

              <Button type="submit" className="w-full bg-purchase-green hover:bg-purchase-green/90 text-purchase-green-foreground" size="lg">
                <ShoppingCart className="mr-2 h-5 w-5" />
                Kjøp nå
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Cart;
