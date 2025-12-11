import { 
  Play, 
  FileText, 
  Presentation, 
  HelpCircle, 
  CheckCircle,
  Wrench,
  TrendingUp,
  Shield,
  Clock
} from "lucide-react";
import ContentSection from "@/components/training/ContentSection";
import VideoSection from "@/components/training/VideoSection";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import heroImage from "@/assets/training-hero.jpg";

const preparerVideos = [
  {
    id: "prv1",
    title: "Bilklargjøring og detaljering",
    description: "Grunnleggende teknikker for bilklargjøring",
    duration: "35 min",
    completed: true
  },
  {
    id: "prv2", 
    title: "Sikkerhet og HMS i verkstedet",
    description: "Viktige sikkerhetsrutiner og arbeidsmetoder",
    duration: "25 min",
    completed: true
  },
  {
    id: "prv3",
    title: "Kvalitetskontroll og inspeksjon",
    description: "Hvordan utføre grundig kvalitetskontroll",
    duration: "30 min",
    completed: false
  },
  {
    id: "prv4",
    title: "Verktøy og utstyr vedlikehold",
    description: "Riktig bruk og vedlikehold av arbeidsverktøy",
    duration: "22 min",
    completed: false
  },
  {
    id: "prv5",
    title: "Miljø og bærekraft i klargjøring",
    description: "Miljøvennlige metoder og avfallshåndtering",
    duration: "18 min",
    completed: true
  }
];

const preparerDocuments = [
  {
    id: "prd1",
    title: "Klargjøringsmanual",
    description: "Komplett guide til bilklargjøring og prosedyrer",
    completed: true
  },
  {
    id: "prd2",
    title: "HMS-håndbok for verksted",
    description: "Sikkerhetsregler og arbeidsrutiner",
    completed: true
  },
  {
    id: "prd3",
    title: "Kvalitetsstandarder og sjekklister",
    description: "Krav til ferdiggjorte biler og kontrollpunkter",
    completed: false
  },
  {
    id: "prd4",
    title: "Verktøy og utstyrslister",
    description: "Oversikt over verktøy og vedlikeholdsrutiner",
    completed: false
  }
];

const preparerPresentations = [
  {
    id: "prp1",
    title: "Nye klargjøringsteknikker 2024",
    description: "Oppdaterte metoder og beste praksis",
    duration: "30 slides",
    completed: false
  },
  {
    id: "prp2",
    title: "Miljøkrav og bærekraft",
    description: "Nye miljøkrav og grønne løsninger",
    duration: "20 slides", 
    completed: true
  },
  {
    id: "prp3",
    title: "Effektivitet og tidsoptimalisering",
    description: "Hvordan arbeide mer effektivt og raskt",
    duration: "25 slides", 
    completed: false
  }
];

const preparerFAQ = [
  {
    id: "prf1",
    title: "Klargjøringsmiddel og kjemikalier",
    description: "Sikker bruk av rengjøringsmidler og kjemikalier",
    completed: true
  },
  {
    id: "prf2",
    title: "Feilretting og problemløsning",
    description: "Vanlige problemer og hvordan løse dem",
    completed: false
  },
  {
    id: "prf3",
    title: "Tidsfrister og prioritering",
    description: "Håndtere tidspress og prioritere oppgaver",
    completed: true
  }
];

const preparerExams = [
  {
    id: "pre1",
    title: "Grunnleggende klargjøringskompetanse",
    description: "Test av klargjøringsferdigheteer og prosedyrer",
    duration: "25 min",
    completed: true
  },
  {
    id: "pre2",
    title: "HMS og sikkerhet sertifisering",
    description: "Obligatorisk sikkerhetstest for verkstedansatte",
    duration: "20 min", 
    completed: true
  },
  {
    id: "pre3",
    title: "Kvalitetskontroll evaluering",
    description: "Test av kvalitetsbevissthet og kontrollrutiner",
    duration: "15 min", 
    completed: false
  }
];

export default function PreparerTraining() {
  const completedItems = [
    ...preparerVideos.filter(v => v.completed),
    ...preparerDocuments.filter(d => d.completed),
    ...preparerPresentations.filter(p => p.completed),
    ...preparerFAQ.filter(f => f.completed),
    ...preparerExams.filter(e => e.completed)
  ].length;

  const totalItems = preparerVideos.length + preparerDocuments.length + preparerPresentations.length + preparerFAQ.length + preparerExams.length;
  const progressPercentage = (completedItems / totalItems) * 100;

  return (
    <div className="min-h-screen">
      {/* Featured Video */}
      <VideoSection
        title="Bilklargjøring for Klargjørere"
        description="Start din reise med denne introduksjonspresentasjonen"
        videoUrl="https://rabbauto.no/wp-content/uploads/2025/02/RABB-AUTO-Employee-PRESENTATION.mp4"
        duration="22 min"
        completed={true}
        roleTitle="SUPERIA CARS KLARGJØRINGSAVDELING"
        roleDescription="På denne siden vil du finne all relevant informasjon som du trenger for å gjøre jobben din som klargjører i en av Superia Cars mange forhandlere på en god og produktiv måte."
        badgeText="Klargjører"
      />

      {/* Progress Overview */}
      <section className="p-6 bg-secondary/30">
        <div className="max-w-7xl mx-auto">
          <Card className="shadow-lg bg-gradient-card">
            <CardHeader>
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                  <CardTitle className="flex items-center space-x-2">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    <span>Klargjøringskompetanse fremgang</span>
                  </CardTitle>
                  <CardDescription>
                    Du har fullført {completedItems} av {totalItems} klargjøringsmoduler
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
          {/* Preparer Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="text-center shadow-md bg-gradient-card">
              <CardContent className="pt-6">
                <Wrench className="h-8 w-8 text-primary mx-auto mb-2" />
                <div className="text-2xl font-bold text-foreground">45</div>
                <div className="text-sm text-muted-foreground">Biler klargjort daglig</div>
              </CardContent>
            </Card>
            <Card className="text-center shadow-md bg-gradient-card">
              <CardContent className="pt-6">
                <Shield className="h-8 w-8 text-success mx-auto mb-2" />
                <div className="text-2xl font-bold text-foreground">99.5%</div>
                <div className="text-sm text-muted-foreground">Kvalitetsrate</div>
              </CardContent>
            </Card>
            <Card className="text-center shadow-md bg-gradient-card">
              <CardContent className="pt-6">
                <Clock className="h-8 w-8 text-accent mx-auto mb-2" />
                <div className="text-2xl font-bold text-foreground">3.2t</div>
                <div className="text-sm text-muted-foreground">Gjennomsnittlig tid per bil</div>
              </CardContent>
            </Card>
          </div>

          {/* Content Sections */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ContentSection
              title="Klargjøring video tutorials"
              description="Lær profesjonelle klargjøringsteknikker"
              icon={<Play className="h-5 w-5" />}
              items={preparerVideos}
              type="video"
            />

            <ContentSection
              title="Klargjøring dokumenter"
              description="Manualer og sikkerhetsrutiner"
              icon={<FileText className="h-5 w-5" />}
              items={preparerDocuments}
              type="document"
            />

            <ContentSection
              title="Klargjøring presentasjoner"
              description="Nye teknikker og prosedyrer"
              icon={<Presentation className="h-5 w-5" />}
              items={preparerPresentations}
              type="presentation"
            />

            <ContentSection
              title="Klargjøring FAQ"
              description="Vanlige spørsmål og praktiske tips"
              icon={<HelpCircle className="h-5 w-5" />}
              items={preparerFAQ}
              type="faq"
            />
          </div>

          {/* Exams Section - Full Width */}
          <div className="mt-6">
            <ContentSection
              title="Klargjøringskompetanse tester"
              description="Evaluer og sertifiser dine klargjøringsferdigheteer"
              icon={<CheckCircle className="h-5 w-5" />}
              items={preparerExams}
              type="exam"
            />
          </div>
        </div>
      </section>
    </div>
  );
}