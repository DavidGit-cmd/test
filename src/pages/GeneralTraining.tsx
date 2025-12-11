import { 
  Play, 
  FileText, 
  Presentation, 
  HelpCircle, 
  CheckCircle,
  TrendingUp,
  Users,
  Target,
  ArrowRight
} from "lucide-react";
import { Link } from "react-router-dom";
import ContentSection from "@/components/training/ContentSection";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import heroImage from "@/assets/hero-superia.jpg";

const welcomeVideos = [
  {
    id: "welcome-1",
    title: "Velkommen med på i Superia Cars",
    url: "/videos/VELKOMMEN_MED_P_I_SUPERIA_CARS.mp4",
    description: "Introduksjonsvideo for nye ansatte"
  }
];

const sampleVideos = [
  {
    id: "v1",
    title: "Superia Cars - Vår visjon og verdier",
    description: "Lær om selskapets historie, visjon og kjernverdier",
    duration: "12 min",
    completed: true
  },
  {
    id: "v2", 
    title: "Kundeservice excellence",
    description: "Hvordan levere enestående kundeopplevelser",
    duration: "18 min",
    completed: false
  },
  {
    id: "v3",
    title: "Bærekraft i bilindustrien",
    description: "Superia Cars sitt arbeid med miljø og bærekraft",
    duration: "15 min",
    completed: false
  },
  {
    id: "v4",
    title: "Sikkerhet og HMS-rutiner",
    description: "Viktige sikkerhetsrutiner for alle ansatte",
    duration: "22 min",
    completed: true
  }
];

const sampleDocuments = [
  {
    id: "d1",
    title: "Medarbeiderhandbok 2024",
    description: "Komplett guide til arbeidsplassregler og rutiner",
    completed: true
  },
  {
    id: "d2",
    title: "Kvalitetshåndbok",
    description: "Standarder og prosedyrer for kvalitetssikring",
    completed: false
  },
  {
    id: "d3",
    title: "Etiske retningslinjer",
    description: "Etikk og atferdskodeks for Superia Cars ansatte",
    completed: true
  }
];

const samplePresentations = [
  {
    id: "p1",
    title: "Superia Cars Markedsposisjon",
    description: "Vår posisjon i det skandinaviske bilmarkedet",
    duration: "25 slides",
    completed: false
  },
  {
    id: "p2",
    title: "Digitalisering og fremtiden",
    description: "Hvordan teknologi former bilhandelen",
    duration: "30 slides", 
    completed: false
  }
];

const sampleFAQ = [
  {
    id: "f1",
    title: "Ferie og permisjon",
    description: "Ofte stilte spørsmål om ferierettigheter og permisjoner",
    completed: false
  },
  {
    id: "f2",
    title: "IT-support og systemer",
    description: "Vanlige tekniske spørsmål og løsninger",
    completed: true
  },
  {
    id: "f3",
    title: "Karriereutvikling",
    description: "Muligheter for vekst og utvikling i Superia Cars",
    completed: false
  }
];

const sampleExams = [
  {
    id: "e1",
    title: "Grunnleggende Superia Cars kunnskap",
    description: "Test av grunnleggende kunnskap om selskapet",
    duration: "20 min",
    completed: true
  },
  {
    id: "e2",
    title: "Kundeservice kompetanse",
    description: "Evaluering av kundeserviceferdigheter",
    duration: "15 min", 
    completed: false
  }
];

export default function GeneralTraining() {
  const completedItems = [
    ...sampleVideos.filter(v => v.completed),
    ...sampleDocuments.filter(d => d.completed),
    ...samplePresentations.filter(p => p.completed),
    ...sampleFAQ.filter(f => f.completed),
    ...sampleExams.filter(e => e.completed)
  ].length;

  const totalItems = sampleVideos.length + sampleDocuments.length + samplePresentations.length + sampleFAQ.length + sampleExams.length;
  const progressPercentage = (completedItems / totalItems) * 100;

  return (
    <div className="min-h-screen">
      {/* Welcome Video Section */}
      <section className="p-6 bg-background">
        <div className="max-w-7xl mx-auto">
          <Card className="shadow-lg bg-gradient-card border border-primary/20">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-primary/10 text-primary border-primary/20">
                  <Play className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle className="flex items-center space-x-2">
                    <span>Velkommen til Superia Cars!</span>
                    <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                      Ny ansatt
                    </Badge>
                  </CardTitle>
                  <CardDescription>
                    Start din reise med denne introduksjonspresentasjonen
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                {/* Video Carousel Column */}
                <div className="relative">
                  <Carousel className="w-full">
                    <CarouselContent>
                      {welcomeVideos.map((video, index) => (
                        <CarouselItem key={video.id}>
                          <div className="relative bg-black rounded-lg overflow-hidden shadow-inner">
                            <video 
                              controls 
                              className="w-full h-auto"
                              preload="metadata"
                              key={video.id}
                            >
                              <source 
                                src={video.url} 
                                type="video/mp4" 
                              />
                              Din nettleser støtter ikke video-avspilling.
                            </video>
                          </div>
                          <div className="mt-4 space-y-2">
                            <h4 className="font-semibold text-foreground">{video.title}</h4>
                            <div className="flex justify-between items-center">
                              <p className="text-sm text-muted-foreground">{video.description}</p>
                              <Badge variant="default" className="text-xs bg-button-teal text-white ml-2 flex-shrink-0">
                                Video {index + 1} av {welcomeVideos.length}
                              </Badge>
                            </div>
                          </div>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    <CarouselPrevious className="left-4 top-1/2 -translate-y-1/2 bg-button-teal text-white hover:bg-button-teal/90 border-0 shadow-lg z-10" />
                    <CarouselNext className="right-4 top-1/2 -translate-y-1/2 bg-button-teal text-white hover:bg-button-teal/90 border-0 shadow-lg z-10" />
                  </Carousel>
                </div>
                
                {/* Introduction Text Column */}
                <div className="space-y-4">
                  <div>
                    <h3 className="text-2xl font-bold text-primary mb-2">
                      VELKOMMEN TIL
                    </h3>
                    <h2 className="text-3xl font-bold text-foreground mb-4">
                      SUPERIA CARS KUNNSKAPSSENTER
                    </h2>
                  </div>
                  
                  <div className="space-y-4 text-muted-foreground">
                    <p>
                      På denne siden vil du finne all relevant informasjon som du trenger for å gjøre jobben din i en av Superia Cars mange forhandlere på en god og produktiv måte.
                    </p>
                    
                    <p>
                      Dette kunnskapssenteret skal være din one-stop-shop for informasjon og opplæring. Så er det noe du lurer på anbefaler vi deg å starte med å gå igjennom informasjonen vi har delt her, før du eventuelt beslaglegger andre ressurser i selskapet. Kom gjerne med tilbakemeldinger dersom det er informasjon du savner på disse sidene, så skal vi jobbe for at dette legges til fortløpende!
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Program Overview */}
      <section className="p-6 bg-background">
        <div className="max-w-7xl mx-auto">
          <Card className="shadow-lg bg-gradient-card border border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-2xl">
                <CheckCircle className="h-6 w-6 text-primary" />
                <span>Programoversikt og kompetansemål</span>
              </CardTitle>
              <CardDescription className="text-base">
                Dette er det du skal kunne etter fullført opplæring. Programmet er bygget opp rundt tre hovedområder som sammen gir deg den kompetansen du trenger for å lykkes i din rolle hos Superia Cars.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="space-y-4">
                  <h4 className="font-semibold text-lg text-foreground mb-3">Overordnet forståelse av vårt business case</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    Forstå hvordan Superia Cars skaper verdi og hvilken rolle du spiller i vår suksess.
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-5 h-5 rounded-full bg-button-teal flex items-center justify-center">
                        <CheckCircle className="w-3 h-3 text-white" />
                      </div>
                      <span className="text-sm">Superia Cars' forretningside og -strategi</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-5 h-5 rounded-full bg-button-teal flex items-center justify-center">
                        <CheckCircle className="w-3 h-3 text-white" />
                      </div>
                      <span className="text-sm">Våre målsetninger og ambisjoner</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-5 h-5 rounded-full bg-button-teal flex items-center justify-center">
                        <CheckCircle className="w-3 h-3 text-white" />
                      </div>
                      <span className="text-sm">Forretningsmodell og inntektsstrømmer</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-5 h-5 rounded-full bg-button-teal flex items-center justify-center">
                        <CheckCircle className="w-3 h-3 text-white" />
                      </div>
                      <span className="text-sm">Konkurransefortrinn og differensiering</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h4 className="font-semibold text-lg text-foreground mb-3">Min arbeidsrolle og selskapets organisering</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    Lær de fundamentale prinsippene og prosedyrene som styrer vårt daglige arbeid.
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-5 h-5 rounded-full bg-button-teal flex items-center justify-center">
                        <CheckCircle className="w-3 h-3 text-white" />
                      </div>
                      <span className="text-sm">Bilforhandlerens organisering og verdikjede</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-5 h-5 rounded-full bg-button-teal flex items-center justify-center">
                        <CheckCircle className="w-3 h-3 text-white" />
                      </div>
                      <span className="text-sm">Min spesifikke rolle i selskapet(s verdikjede)</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-5 h-5 rounded-full bg-button-teal flex items-center justify-center">
                        <CheckCircle className="w-3 h-3 text-white" />
                      </div>
                      <span className="text-sm">Kunnskap og forståelse for våre løsninger</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-5 h-5 rounded-full bg-button-teal flex items-center justify-center">
                        <CheckCircle className="w-3 h-3 text-white" />
                      </div>
                      <span className="text-sm">Forståelse for hvordan vi og du tjener penger</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-5 h-5 rounded-full bg-button-teal flex items-center justify-center">
                        <CheckCircle className="w-3 h-3 text-white" />
                      </div>
                      <span className="text-sm">(HMS-prosedyrer og sikkerhetspraksis - kommer)</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-5 h-5 rounded-full bg-button-teal flex items-center justify-center">
                        <CheckCircle className="w-3 h-3 text-white" />
                      </div>
                      <span className="text-sm">(IT-systemer, verktøy og digitale arbeidsflyter -kommer)</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-5 h-5 rounded-full bg-button-teal flex items-center justify-center">
                        <CheckCircle className="w-3 h-3 text-white" />
                      </div>
                      <span className="text-sm">(Etiske retningslinjer og compliance-krav - kommer)</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h4 className="font-semibold text-lg text-foreground mb-3">Praktiske ferdigheter og leveranse</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    Utvikle de praktiske ferdighetene som trengs for å utføre ditt arbeid med høy kvalitet.
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-5 h-5 rounded-full bg-button-teal flex items-center justify-center">
                        <CheckCircle className="w-3 h-3 text-white" />
                      </div>
                      <span className="text-sm">Produktkunnskap om bilmodeller og utstyr</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-5 h-5 rounded-full bg-button-teal flex items-center justify-center">
                        <CheckCircle className="w-3 h-3 text-white" />
                      </div>
                      <span className="text-sm">Kundeinteraksjon og kommunikasjonsteknikker</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-5 h-5 rounded-full bg-button-teal flex items-center justify-center">
                        <CheckCircle className="w-3 h-3 text-white" />
                      </div>
                      <span className="text-sm">Kvalitetssikring og kontinuerlig forbedring</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-5 h-5 rounded-full bg-button-teal flex items-center justify-center">
                        <CheckCircle className="w-3 h-3 text-white" />
                      </div>
                      <span className="text-sm">Tverrfaglig samarbeid og teamdynamikk</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-5 h-5 rounded-full bg-button-teal flex items-center justify-center">
                        <CheckCircle className="w-3 h-3 text-white" />
                      </div>
                      <span className="text-sm">Problemsløsning og optlmalisering</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 p-6 bg-secondary/10 rounded-lg border border-primary/10">
                <h5 className="font-semibold text-foreground mb-3">Læringsutbytte</h5>
                <p className="text-sm text-muted-foreground mb-4">
                  Etter gjennomført opplæringsprogram vil du ha oppnådd følgende kompetanse:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="h-4 w-4 text-button-teal mt-0.5 flex-shrink-0" />
                      <span><strong>Strategisk forståelse:</strong> Evne til å se din rolle i den større sammenhengen</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="h-4 w-4 text-button-teal mt-0.5 flex-shrink-0" />
                      <span><strong>Operasjonell kompetanse:</strong> Mestring av daglige arbeidsoppgaver og prosedyrer</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="h-4 w-4 text-button-teal mt-0.5 flex-shrink-0" />
                      <span><strong>Kundefokus:</strong> Ferdigheter i å levere enestående kundeopplevelser</span>
                    </li>
                  </ul>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="h-4 w-4 text-button-teal mt-0.5 flex-shrink-0" />
                      <span><strong>Kvalitetsbevissthet:</strong> Forståelse for standarder og kontinuerlig forbedring</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="h-4 w-4 text-button-teal mt-0.5 flex-shrink-0" />
                      <span><strong>Samarbeidsevne:</strong> Kompetanse i tverrfaglig arbeid og teamdynamikk</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="h-4 w-4 text-button-teal mt-0.5 flex-shrink-0" />
                      <span><strong>Tilpasningsevne:</strong> Evne til å håndtere endringer og nye utfordringer</span>
                    </li>
                  </ul>
                </div>
              </div>
              
              <div className="mt-8 flex justify-end">
                <Button asChild size="lg" className="bg-button-teal text-white hover:bg-button-teal/90">
                  <Link to="/alle-ansatte" className="flex items-center space-x-2">
                    <span>Jeg er klar og ønsker å starte min opplæring nå</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}