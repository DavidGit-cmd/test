import { 
  Play, 
  FileText, 
  Presentation, 
  HelpCircle, 
  CheckCircle,
  TrendingUp,
  Users,
  Target
} from "lucide-react";
import ContentSection from "@/components/training/ContentSection";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import heroImage from "@/assets/hero-superia.jpg";

const welcomeVideos = [
  {
    id: "welcome-1",
    title: "Velkommen med på i Superia Cars",
    url: "/videos/VELKOMMEN_MED_P_I_SUPERIA_CARS.mp4",
    description: "Introduksjonsvideo for alle ansatte"
  }
];

const sampleVideos = [
  {
    id: "v0",
    title: "Velkommen med på i Superia Cars",
    description: "Introduksjonsvideo for nye ansatte",
    duration: "10 min",
    completed: false,
    videoUrl: "/videos/VELKOMMEN_MED_P_I_SUPERIA_CARS.mp4"
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

export default function AllEmployeesTraining() {
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
                      INFORMASJONS- OG RESSURSSIDE
                    </h3>
                    <h2 className="text-3xl font-bold text-foreground mb-4">
                      FOR ALLE ANSATTE I SUPERIA CARS
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

      {/* Progress Overview */}
      <section className="p-6 bg-secondary/30">
        <div className="max-w-7xl mx-auto">
          <Card className="shadow-lg bg-gradient-card">
            <CardHeader>
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                  <CardTitle className="flex items-center space-x-2">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    <span>Din fremgang</span>
                  </CardTitle>
                  <CardDescription>
                    Du har fullført {completedItems} av {totalItems} tilgjengelige elementer
                  </CardDescription>
                </div>
                <Badge variant="secondary" className="text-lg font-semibold px-4 py-2">
                  {Math.round(progressPercentage)}% fullført
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <Progress value={progressPercentage} className="h-3" />
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Main Content */}
      <section className="p-6">
        <div className="max-w-7xl mx-auto">
          {/* Content Sections */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ContentSection
              title="Video tutorials"
              description="Lær gjennom engasjerende videoinnhold"
              icon={<Play className="h-5 w-5" />}
              items={sampleVideos}
              type="video"
            />

            <ContentSection
              title="Dokumenter"
              description="Viktige retningslinjer og håndbøker"
              icon={<FileText className="h-5 w-5" />}
              items={sampleDocuments}
              type="document"
            />

            <ContentSection
              title="Presentasjoner"
              description="Informative slides og materiell"
              icon={<Presentation className="h-5 w-5" />}
              items={samplePresentations}
              type="presentation"
            />

            <ContentSection
              title="FAQ"
              description="Ofte stilte spørsmål og svar"
              icon={<HelpCircle className="h-5 w-5" />}
              items={sampleFAQ}
              type="faq"
            />
          </div>

          {/* Exams Section - Full Width */}
          <div className="mt-6">
            <ContentSection
              title="Eksamen og tester"
              description="Test din kunnskap og få sertifikater"
              icon={<CheckCircle className="h-5 w-5" />}
              items={sampleExams}
              type="exam"
            />
          </div>
        </div>
      </section>
    </div>
  );
}