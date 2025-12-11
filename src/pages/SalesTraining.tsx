import { 
  Play, 
  FileText, 
  Presentation, 
  HelpCircle, 
  CheckCircle,
  Car,
  TrendingUp,
  Users,
  Award
} from "lucide-react";
import ContentSection from "@/components/training/ContentSection";
import VideoSection from "@/components/training/VideoSection";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import heroImage from "@/assets/training-hero.jpg";

const salesVideos = [
  {
    id: "sv1",
    title: "Salgsteknikker og kundetilnærming",
    description: "Effektive metoder for å møte og engasjere kunder",
    duration: "28 min",
    completed: true
  },
  {
    id: "sv2", 
    title: "Produktkunnskap: Bilmodeller og spesifikasjoner",
    description: "Dyptgående kunnskap om vårt bilutvalg",
    duration: "45 min",
    completed: false
  },
  {
    id: "sv3",
    title: "Behovsanalyse og kundesamtaler",
    description: "Hvordan identifisere og forstå kundens behov",
    duration: "22 min",
    completed: true
  },
  {
    id: "sv4",
    title: "Finansiering og forsikringsalternativer",
    description: "Presentere finansieringsløsninger for kunder",
    duration: "35 min",
    completed: false
  },
  {
    id: "sv5",
    title: "Innbytte og prisforhandlinger",
    description: "Håndtere innbytte og forhandle priser profesjonelt",
    duration: "30 min",
    completed: true
  }
];

const salesDocuments = [
  {
    id: "sd1",
    title: "Salgsmanual og prosedyrer",
    description: "Komplett guide til salgsprosessen",
    completed: true
  },
  {
    id: "sd2",
    title: "Produktkataloger og prislister",
    description: "Oppdatert informasjon om alle bilmodeller",
    completed: false
  },
  {
    id: "sd3",
    title: "Konkurranseanalyse",
    description: "Sammenligning med konkurrenter og USPer",
    completed: true
  },
  {
    id: "sd4",
    title: "CRM system brukermanual",
    description: "Hvordan bruke kundesystemet effektivt",
    completed: false
  }
];

const salesPresentations = [
  {
    id: "sp1",
    title: "Salgsmål og incentivordninger",
    description: "Mål for 2024 og belønningssystemer",
    duration: "20 slides",
    completed: false
  },
  {
    id: "sp2",
    title: "Nye modeller og kampanjer",
    description: "Lansering av nye bilmodeller og markedsføring",
    duration: "35 slides", 
    completed: true
  },
  {
    id: "sp3",
    title: "Kundeservice excellence",
    description: "Levere enestående kundeopplevelser",
    duration: "25 slides", 
    completed: false
  }
];

const salesFAQ = [
  {
    id: "sf1",
    title: "Finansiering og lånespørsmål",
    description: "Vanlige spørsmål om bilfinansiering",
    completed: true
  },
  {
    id: "sf2",
    title: "Tekniske spørsmål om bilmodeller",
    description: "Detaljerte spørsmål om bilspesifikasjoner",
    completed: false
  },
  {
    id: "sf3",
    title: "Garantier og service",
    description: "Informasjon om garantier og serviceavtaler",
    completed: false
  },
  {
    id: "sf4",
    title: "Vanskelige kundesituasjoner",
    description: "Håndtere klager og misfornøyde kunder",
    completed: true
  }
];

const salesExams = [
  {
    id: "se1",
    title: "Grunnleggende salgskompetanse",
    description: "Test av salgsferdigheteer og prosedyrer",
    duration: "30 min",
    completed: true
  },
  {
    id: "se2",
    title: "Produktkunnskap test",
    description: "Detaljert test av bilkunnskap",
    duration: "40 min", 
    completed: false
  },
  {
    id: "se3",
    title: "Kundeservice sertifisering",
    description: "Sertifisering i kundeservice excellence",
    duration: "25 min", 
    completed: false
  }
];

export default function SalesTraining() {
  const completedItems = [
    ...salesVideos.filter(v => v.completed),
    ...salesDocuments.filter(d => d.completed),
    ...salesPresentations.filter(p => p.completed),
    ...salesFAQ.filter(f => f.completed),
    ...salesExams.filter(e => e.completed)
  ].length;

  const totalItems = salesVideos.length + salesDocuments.length + salesPresentations.length + salesFAQ.length + salesExams.length;
  const progressPercentage = (completedItems / totalItems) * 100;

  return (
    <div className="min-h-screen">
      {/* Featured Video */}
      <VideoSection
        title="Salgsteknikker for Selgere"
        description="Start din reise med denne introduksjonspresentasjonen"
        videoUrl="https://rabbauto.no/wp-content/uploads/2025/02/RABB-AUTO-Employee-PRESENTATION.mp4"
        duration="18 min"
        completed={true}
        roleTitle="SUPERIA CARS SALGSAVDELING"
        roleDescription="På denne siden vil du finne all relevant informasjon som du trenger for å gjøre jobben din som selger i en av Superia Cars mange forhandlere på en god og produktiv måte."
        badgeText="Selger"
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
                    <span>Salgskompetanse fremgang</span>
                  </CardTitle>
                  <CardDescription>
                    Du har fullført {completedItems} av {totalItems} salgsmoduler
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
          {/* Sales Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="text-center shadow-md bg-gradient-card">
              <CardContent className="pt-6">
                <Car className="h-8 w-8 text-primary mx-auto mb-2" />
                <div className="text-2xl font-bold text-foreground">850</div>
                <div className="text-sm text-muted-foreground">Biler solgt månedlig</div>
              </CardContent>
            </Card>
            <Card className="text-center shadow-md bg-gradient-card">
              <CardContent className="pt-6">
                <Users className="h-8 w-8 text-accent mx-auto mb-2" />
                <div className="text-2xl font-bold text-foreground">4.8/5</div>
                <div className="text-sm text-muted-foreground">Kundetilfredshet</div>
              </CardContent>
            </Card>
            <Card className="text-center shadow-md bg-gradient-card">
              <CardContent className="pt-6">
                <Award className="h-8 w-8 text-success mx-auto mb-2" />
                <div className="text-2xl font-bold text-foreground">75%</div>
                <div className="text-sm text-muted-foreground">Gjenkjøpsrate</div>
              </CardContent>
            </Card>
          </div>

          {/* Content Sections */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ContentSection
              title="Salgs video tutorials"
              description="Lær profesjonelle salgsteknikker"
              icon={<Play className="h-5 w-5" />}
              items={salesVideos}
              type="video"
            />

            <ContentSection
              title="Salgs dokumenter"
              description="Produktinformasjon og prosedyrer"
              icon={<FileText className="h-5 w-5" />}
              items={salesDocuments}
              type="document"
            />

            <ContentSection
              title="Salgs presentasjoner"
              description="Produktlansering og salgsmaterial"
              icon={<Presentation className="h-5 w-5" />}
              items={salesPresentations}
              type="presentation"
            />

            <ContentSection
              title="Salgs FAQ"
              description="Vanlige kundespørsmål og svar"
              icon={<HelpCircle className="h-5 w-5" />}
              items={salesFAQ}
              type="faq"
            />
          </div>

          {/* Exams Section - Full Width */}
          <div className="mt-6">
            <ContentSection
              title="Salgskompetanse tester"
              description="Evaluer og sertifiser dine salgsferdigheteer"
              icon={<CheckCircle className="h-5 w-5" />}
              items={salesExams}
              type="exam"
            />
          </div>
        </div>
      </section>
    </div>
  );
}