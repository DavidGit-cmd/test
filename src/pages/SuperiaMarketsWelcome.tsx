import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingCart, Car, Package, ArchiveX } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function SuperiaMarketsWelcome() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Velkommen til Superia Markets
          </h1>
          <p className="text-xl text-foreground/70 max-w-3xl mx-auto">
            Din komplette plattform for å administrere bilkjøp, salg og lager. 
            Alt du trenger for effektiv bilhandel på ett sted.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-3 bg-button-teal/10 rounded-lg">
                  <ShoppingCart className="h-6 w-6 text-button-teal" />
                </div>
                <CardTitle>Innkjøp av bil</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-foreground/70 mb-4">
                Registrer og administrer innkjøp av biler. Hold oversikt over alle kjøpstransaksjoner og bildetaljer.
              </p>
              <Button asChild variant="default" className="w-full">
                <Link to="/superia-markets/innkjop-av-bil">
                  Gå til Innkjøp
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-3 bg-button-teal/10 rounded-lg">
                  <Car className="h-6 w-6 text-button-teal" />
                </div>
                <CardTitle>Biler til salgs</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-foreground/70 mb-4">
                Se alle biler som er tilgjengelige for salg. Administrer priser, bilder og detaljert informasjon.
              </p>
              <Button asChild variant="default" className="w-full">
                <Link to="/superia-markets/biler-til-salgs">
                  Se biler til salgs
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-3 bg-button-teal/10 rounded-lg">
                  <Package className="h-6 w-6 text-button-teal" />
                </div>
                <CardTitle>Solgte biler</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-foreground/70 mb-4">
                Oversikt over alle solgte biler. Følg med på salgshistorikk og transaksjoner.
              </p>
              <Button asChild variant="default" className="w-full">
                <Link to="/superia-markets/solgte-biler">
                  Se solgte biler
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-3 bg-button-teal/10 rounded-lg">
                  <ArchiveX className="h-6 w-6 text-button-teal" />
                </div>
                <CardTitle>Tilbakeleverte biler</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-foreground/70 mb-4">
                Administrer biler som er levert tilbake til eier. Hold oversikt over returprosesser.
              </p>
              <Button asChild variant="default" className="w-full">
                <Link to="/superia-markets/tilbakeleverte-biler">
                  Se tilbakeleverte biler
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          <h2 className="text-2xl font-bold text-foreground mb-4">
            Kom i gang
          </h2>
          <p className="text-foreground/70 mb-4">
            Superia Markets gir deg full kontroll over bilhandelen. Velg en av seksjonene ovenfor for å begynne.
          </p>
        </div>
      </div>
    </div>
  );
}
