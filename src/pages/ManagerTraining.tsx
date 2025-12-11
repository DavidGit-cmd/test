import { 
  Play, 
  FileText, 
  Presentation, 
  HelpCircle, 
  CheckCircle,
  Shield,
  Users,
  TrendingUp,
  Award
} from "lucide-react";
import ContentSection from "@/components/training/ContentSection";
import VideoSection from "@/components/training/VideoSection";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import heroImage from "@/assets/training-hero.jpg";

const managerVideos = [
  {
    id: "mv1",
    title: "Lederskap i Superia Cars",
    description: "Prinsipper for effektiv ledelse i vår organisasjon",
    duration: "25 min",
    completed: false,
    restricted: true
  },
  {
    id: "mv2", 
    title: "Personalledelse og motivasjon",
    description: "Hvordan lede og motivere ditt team",
    duration: "32 min",
    completed: true,
    restricted: true
  },
  {
    id: "mv3",
    title: "Økonomisk styring og budsjett",
    description: "Finansiell planlegging og kontroll for avdelingsledere",
    duration: "28 min",
    completed: false,
    restricted: true
  },
  {
    id: "mv4",
    title: "Konfliktløsning og kommunikasjon",
    description: "Håndtere utfordringer og vanskelige samtaler",
    duration: "22 min",
    completed: true,
    restricted: true
  }
];

const managerDocuments = [
  {
    id: "md1",
    title: "Lederverktøy og maler",
    description: "Praktiske verktøy for daglige lederoppgaver",
    completed: false,
    restricted: true
  },
  {
    id: "md2",
    title: "HR-retningslinjer for ledere",
    description: "Personalrelaterte prosedyrer og regler",
    completed: true,
    restricted: true
  },
  {
    id: "md3",
    title: "Rapportering og KPIer",
    description: "Sentrale nøkkeltall og rapporteringsrutiner",
    completed: false,
    restricted: true
  }
];

const managerPresentations = [
  {
    id: "mp1",
    title: "Strategisk planlegging 2024",
    description: "Overordnede mål og strategier for kommende år",
    duration: "45 slides",
    completed: false,
    restricted: true
  },
  {
    id: "mp2",
    title: "Organisasjonsutvikling",
    description: "Hvordan utvikle organisasjonen og teamene",
    duration: "35 slides", 
    completed: false,
    restricted: true
  }
];

const managerFAQ = [
  {
    id: "mf1",
    title: "Personalrelaterte spørsmål",
    description: "Vanlige HR-situasjoner og hvordan håndtere dem",
    completed: false,
    restricted: true
  },
  {
    id: "mf2",
    title: "Økonomi og budsjett FAQ",
    description: "Spørsmål om finansiell styring og rapportering",
    completed: true,
    restricted: true
  }
];

const managerExams = [
  {
    id: "me1",
    title: "Lederskap kompetansetest",
    description: "Evaluering av ledelseskompetanse",
    duration: "30 min",
    completed: false,
    restricted: true
  },
  {
    id: "me2",
    title: "Økonomi for ledere",
    description: "Test av finansiell forståelse",
    duration: "25 min", 
    completed: false,
    restricted: true
  }
];

export default function ManagerTraining() {
  const completedItems = [
    ...managerVideos.filter(v => v.completed),
    ...managerDocuments.filter(d => d.completed),
    ...managerPresentations.filter(p => p.completed),
    ...managerFAQ.filter(f => f.completed),
    ...managerExams.filter(e => e.completed)
  ].length;

  const totalItems = managerVideos.length + managerDocuments.length + managerPresentations.length + managerFAQ.length + managerExams.length;
  const progressPercentage = (completedItems / totalItems) * 100;

  return (
    <div className="min-h-screen">
      {/* Featured Video */}
      <VideoSection
        title="Lederskap for Daglig Ledere"
        description="Start din reise med denne introduksjonspresentasjonen"
        videoUrl="https://rabbauto.no/wp-content/uploads/2025/02/RABB-AUTO-Employee-PRESENTATION.mp4"
        duration="25 min"
        completed={false}
        roleTitle="SUPERIA CARS LEDERAVDELING"
        roleDescription="På denne siden vil du finne all relevant informasjon som du trenger for å gjøre jobben din som daglig leder i en av Superia Cars mange forhandlere på en god og produktiv måte."
        badgeText="Daglig leder"
      />

      {/* Access Notice */}
      <section className="p-6 bg-secondary/30">
        <div className="max-w-7xl mx-auto">
          <Alert className="mb-6 border-warning/50 bg-warning/10">
            <Shield className="h-4 w-4" />
            <AlertDescription>
              Dette innholdet er kun tilgjengelig for daglig ledere. All aktivitet logges for sikkerhet og compliance.
            </AlertDescription>
          </Alert>

          {/* Progress Overview */}
          <Card className="shadow-lg bg-gradient-card">
            <CardHeader>
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                  <CardTitle className="flex items-center space-x-2">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    <span>Lederutvikling fremgang</span>
                  </CardTitle>
                  <CardDescription>
                    Du har fullført {completedItems} av {totalItems} ledermoduler
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
          {/* Leadership Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="text-center shadow-md bg-gradient-card">
              <CardContent className="pt-6">
                <Users className="h-8 w-8 text-primary mx-auto mb-2" />
                <div className="text-2xl font-bold text-foreground">25</div>
                <div className="text-sm text-muted-foreground">Daglig ledere totalt</div>
              </CardContent>
            </Card>
            <Card className="text-center shadow-md bg-gradient-card">
              <CardContent className="pt-6">
                <Award className="h-8 w-8 text-accent mx-auto mb-2" />
                <div className="text-2xl font-bold text-foreground">95%</div>
                <div className="text-sm text-muted-foreground">Medarbeidertilfredshet</div>
              </CardContent>
            </Card>
            <Card className="text-center shadow-md bg-gradient-card">
              <CardContent className="pt-6">
                <TrendingUp className="h-8 w-8 text-success mx-auto mb-2" />
                <div className="text-2xl font-bold text-foreground">12%</div>
                <div className="text-sm text-muted-foreground">Årlig vekst</div>
              </CardContent>
            </Card>
          </div>

          {/* Content Sections */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ContentSection
              title="Ledervideo tutorials"
              description="Avansert lederutvikling og strategi"
              icon={<Play className="h-5 w-5" />}
              items={managerVideos}
              type="video"
            />

            <ContentSection
              title="Leder dokumenter"
              description="Konfidensielle retningslinjer og verktøy"
              icon={<FileText className="h-5 w-5" />}
              items={managerDocuments}
              type="document"
            />

            <ContentSection
              title="Strategiske presentasjoner"
              description="Høynivå strategisk informasjon"
              icon={<Presentation className="h-5 w-5" />}
              items={managerPresentations}
              type="presentation"
            />

            <ContentSection
              title="Leder FAQ"
              description="Vanlige ledelsesutfordringer og løsninger"
              icon={<HelpCircle className="h-5 w-5" />}
              items={managerFAQ}
              type="faq"
            />
          </div>

          {/* Exams Section - Full Width */}
          <div className="mt-6">
            <ContentSection
              title="Lederkompetanse tester"
              description="Evaluering av ledelsesevner og strategisk tenkning"
              icon={<CheckCircle className="h-5 w-5" />}
              items={managerExams}
              type="exam"
            />
          </div>
        </div>
      </section>
    </div>
  );
}