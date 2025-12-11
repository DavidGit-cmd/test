import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ChevronDown, Phone, MapPin, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface CarLead {
  id: string;
  image: string;
  registrationNumber: string;
  make: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  fuel: string;
  transmission: string;
  reasons: string[];
  daysOnMarket: number;
  marketComparison: string;
  features: string[];
  owner: {
    name: string;
    address: string;
    phone: string;
  };
  finnUrl?: string;
  specifications?: {
    omregistrering?: string;
    prisExclOmreg?: string;
    modellYear?: string;
    karosseri?: string;
    effekt?: string;
    slagvolum?: string;
    co2Utslipp?: string;
    maksimalTilhengervekt?: string;
    hjuldrift?: string;
    vekt?: string;
    seter?: string;
    dorer?: string;
    bagasjerom?: string;
    farge?: string;
    bilenStarI?: string;
    sistEuGodkjent?: string;
    nesteEuKontroll?: string;
    avgiftsklasse?: string;
    chassisNr?: string;
    forsteGangRegistrert?: string;
    salgsform?: string;
  };
}

interface CarLeadCardProps {
  lead: CarLead;
  onCreateAgreement: (lead: CarLead) => void;
  onDelete?: (leadId: string) => void;
  onEdit?: (lead: CarLead) => void;
}

export const CarLeadCard = ({ lead, onCreateAgreement, onDelete, onEdit }: CarLeadCardProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <div className="p-4">
          <div className="flex gap-4">
            <img
              src={lead.image}
              alt={`${lead.make} ${lead.model}`}
              className="w-32 h-24 object-cover rounded-md"
            />
            <div className="flex-1">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="font-semibold text-lg">
                    {lead.make} {lead.model}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {lead.registrationNumber} • {lead.year}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-primary">
                    {lead.price.toLocaleString("no-NO")} kr
                  </p>
                  <p className="text-xs text-muted-foreground">finn.no pris</p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex flex-wrap gap-2">
                  {lead.reasons.slice(0, 2).map((reason, idx) => (
                    <Badge key={idx} variant="secondary" className="text-xs">
                      {reason}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <CollapsibleTrigger className="w-full mt-4 pt-4 border-t flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <span>{isOpen ? "Vis mindre" : "Vis mer informasjon"}</span>
            <ChevronDown
              className={`h-4 w-4 transition-transform ${
                isOpen ? "rotate-180" : ""
              }`}
            />
          </CollapsibleTrigger>
        </div>

        <CollapsibleContent>
          <CardContent className="pt-0 space-y-4">
            {lead.finnUrl && (
              <div className="mb-4">
                <h4 className="font-semibold mb-2">Finn.no annonse:</h4>
                <a 
                  href={lead.finnUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:underline break-all"
                >
                  {lead.finnUrl}
                </a>
              </div>
            )}

            <div className="mb-4 p-4 bg-muted/50 rounded-md">
              <h4 className="font-semibold mb-3 text-sm">Kjøretøyopplysninger</h4>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground">Registreringsnummer</p>
                  <p className="font-medium">{lead.registrationNumber}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Merke</p>
                  <p className="font-medium">{lead.make}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Modell</p>
                  <p className="font-medium">{lead.model}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Årsmodell</p>
                  <p className="font-medium">{lead.year}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Kilometerstand</p>
                  <p className="font-medium">{lead.mileage.toLocaleString("no-NO")} km</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Drivstoff</p>
                  <p className="font-medium">{lead.fuel}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Girkasse</p>
                  <p className="font-medium">{lead.transmission}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Pris (finn.no)</p>
                  <p className="font-medium">{lead.price.toLocaleString("no-NO")} kr</p>
                </div>
              </div>
            </div>

            {lead.specifications && Object.values(lead.specifications).some(v => v) && (
              <div className="mb-4 p-4 bg-muted/50 rounded-md">
                <h4 className="font-semibold mb-3 text-sm">Spesifikasjoner</h4>
                <div className="grid grid-cols-3 gap-4">
                  {lead.specifications.omregistrering && (
                    <div>
                      <p className="text-xs text-muted-foreground">Omregistrering</p>
                      <p className="font-medium">{lead.specifications.omregistrering}</p>
                    </div>
                  )}
                  {lead.specifications.prisExclOmreg && (
                    <div>
                      <p className="text-xs text-muted-foreground">Pris eksl. omreg.</p>
                      <p className="font-medium">{lead.specifications.prisExclOmreg}</p>
                    </div>
                  )}
                  {lead.specifications.modellYear && (
                    <div>
                      <p className="text-xs text-muted-foreground">Modellår</p>
                      <p className="font-medium">{lead.specifications.modellYear}</p>
                    </div>
                  )}
                  {lead.specifications.karosseri && (
                    <div>
                      <p className="text-xs text-muted-foreground">Karosseri</p>
                      <p className="font-medium">{lead.specifications.karosseri}</p>
                    </div>
                  )}
                  {lead.specifications.effekt && (
                    <div>
                      <p className="text-xs text-muted-foreground">Effekt</p>
                      <p className="font-medium">{lead.specifications.effekt}</p>
                    </div>
                  )}
                  {lead.specifications.slagvolum && (
                    <div>
                      <p className="text-xs text-muted-foreground">Slagvolum</p>
                      <p className="font-medium">{lead.specifications.slagvolum}</p>
                    </div>
                  )}
                  {lead.specifications.co2Utslipp && (
                    <div>
                      <p className="text-xs text-muted-foreground">CO₂-utslipp</p>
                      <p className="font-medium">{lead.specifications.co2Utslipp}</p>
                    </div>
                  )}
                  {lead.specifications.maksimalTilhengervekt && (
                    <div>
                      <p className="text-xs text-muted-foreground">Maksimal tilhengervekt</p>
                      <p className="font-medium">{lead.specifications.maksimalTilhengervekt}</p>
                    </div>
                  )}
                  {lead.specifications.hjuldrift && (
                    <div>
                      <p className="text-xs text-muted-foreground">Hjuldrift</p>
                      <p className="font-medium">{lead.specifications.hjuldrift}</p>
                    </div>
                  )}
                  {lead.specifications.vekt && (
                    <div>
                      <p className="text-xs text-muted-foreground">Vekt</p>
                      <p className="font-medium">{lead.specifications.vekt}</p>
                    </div>
                  )}
                  {lead.specifications.seter && (
                    <div>
                      <p className="text-xs text-muted-foreground">Seter</p>
                      <p className="font-medium">{lead.specifications.seter}</p>
                    </div>
                  )}
                  {lead.specifications.dorer && (
                    <div>
                      <p className="text-xs text-muted-foreground">Dører</p>
                      <p className="font-medium">{lead.specifications.dorer}</p>
                    </div>
                  )}
                  {lead.specifications.bagasjerom && (
                    <div>
                      <p className="text-xs text-muted-foreground">Størrelse på bagasjerom</p>
                      <p className="font-medium">{lead.specifications.bagasjerom}</p>
                    </div>
                  )}
                  {lead.specifications.farge && (
                    <div>
                      <p className="text-xs text-muted-foreground">Farge</p>
                      <p className="font-medium">{lead.specifications.farge}</p>
                    </div>
                  )}
                  {lead.specifications.bilenStarI && (
                    <div>
                      <p className="text-xs text-muted-foreground">Bilen står i</p>
                      <p className="font-medium">{lead.specifications.bilenStarI}</p>
                    </div>
                  )}
                  {lead.specifications.sistEuGodkjent && (
                    <div>
                      <p className="text-xs text-muted-foreground">Sist EU-godkjent</p>
                      <p className="font-medium">{lead.specifications.sistEuGodkjent}</p>
                    </div>
                  )}
                  {lead.specifications.nesteEuKontroll && (
                    <div>
                      <p className="text-xs text-muted-foreground">Neste frist for EU-kontroll</p>
                      <p className="font-medium">{lead.specifications.nesteEuKontroll}</p>
                    </div>
                  )}
                  {lead.specifications.avgiftsklasse && (
                    <div>
                      <p className="text-xs text-muted-foreground">Avgiftsklasse</p>
                      <p className="font-medium">{lead.specifications.avgiftsklasse}</p>
                    </div>
                  )}
                  {lead.specifications.chassisNr && (
                    <div>
                      <p className="text-xs text-muted-foreground">Chassis nr. (VIN)</p>
                      <p className="font-medium">{lead.specifications.chassisNr}</p>
                    </div>
                  )}
                  {lead.specifications.forsteGangRegistrert && (
                    <div>
                      <p className="text-xs text-muted-foreground">1. gang registrert</p>
                      <p className="font-medium">{lead.specifications.forsteGangRegistrert}</p>
                    </div>
                  )}
                  {lead.specifications.salgsform && (
                    <div>
                      <p className="text-xs text-muted-foreground">Salgsform</p>
                      <p className="font-medium">{lead.specifications.salgsform}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {lead.features.length > 0 && (
              <div className="mb-4 p-4 bg-muted/50 rounded-md">
                <h4 className="font-semibold mb-3 text-sm">Utstyr og features</h4>
                <div className="flex flex-wrap gap-2">
                  {lead.features.map((feature, idx) => (
                    <Badge key={idx} variant="outline" className="text-xs">
                      {feature}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <div>
              <h4 className="font-semibold mb-2">Hvorfor dette er et godt lead:</h4>
              <ul className="space-y-1">
                {lead.reasons.map((reason, idx) => (
                  <li key={idx} className="text-sm flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>{reason}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Markedssammenligning:</h4>
              <p className="text-sm text-muted-foreground">{lead.marketComparison}</p>
            </div>


            <div className="border-t pt-4">
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <User className="h-4 w-4" />
                Eierinformasjon
              </h4>
              <div className="space-y-2 text-sm">
                <p className="font-medium">{lead.owner.name}</p>
                <p className="flex items-start gap-2 text-muted-foreground">
                  <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <span>{lead.owner.address}</span>
                </p>
                <p className="flex items-center gap-2 text-muted-foreground">
                  <Phone className="h-4 w-4 flex-shrink-0" />
                  <span>{lead.owner.phone}</span>
                </p>
              </div>
            </div>

            <div className="flex justify-between gap-2 pt-4 border-t">
              <div className="flex gap-2">
                {onEdit && (
                  <Button 
                    variant="default" 
                    size="sm"
                    onClick={() => onEdit(lead)}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white"
                  >
                    Rediger
                  </Button>
                )}
                {onDelete && (
                  <Button 
                    variant="destructive" 
                    size="sm"
                    onClick={() => onDelete(lead.id)}
                  >
                    Slett lead
                  </Button>
                )}
              </div>
              <div className="flex gap-2 ml-auto">
                <Button 
                  variant="default" 
                  size="sm"
                  onClick={() => onCreateAgreement(lead)}
                >
                  Lag Innkjøpsavtale
                </Button>
                <Button variant="outline" size="sm">
                  Lag formidlingsavtale
                </Button>
                <Button variant="outline" size="sm">
                  Lag Innkjøpskontrakt
                </Button>
              </div>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};
