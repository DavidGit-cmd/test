import { useState } from "react";
import { 
  Play, 
  FileText, 
  Presentation, 
  HelpCircle, 
  CheckCircle,
  ShoppingCart,
  TrendingUp,
  Target,
  DollarSign
} from "lucide-react";
import ContentSection from "@/components/training/ContentSection";
import ExamDialog from "@/components/training/ExamDialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/training-hero.jpg";

const purchaserWelcomeVideos = [
  {
    id: "pw-1",
    title: "Innkjøpsstrategi for Innkjøpere",
    url: "https://superiacars.com/wp-content/uploads/2025/09/INNKJPER-SUPERIA-CARS.mp4",
    description: "Grunnleggende innkjøpsstrategi og beste praksis"
  },
  {
    id: "pw-2",
    title: "Superia Cars Innkjøpsløsninger",
    url: "/videos/KORTVERSJON_SUPERIA_CARS_Innkjpslsninger.mp4",
    description: "Oversikt over våre innkjøpsløsninger"
  }
];

const purchaserVideos = [
  {
    id: "pv1",
    title: "Før du starter å jobbe som Innkjøper",
    description: "Grunnleggende informasjon for å komme i gang som innkjøper",
    duration: "30 min",
    completed: true
  },
  {
    id: "pv2", 
    title: "Slik bruker du Billink/Autonet",
    description: "Hvordan bruke Billink og Autonet for bilsøk og kjøp",
    duration: "25 min",
    completed: false
  },
  {
    id: "pv3",
    title: "Slik finner du aktuelle biler på finn.no",
    description: "Effektive søkemetoder og filtrering på finn.no",
    duration: "35 min",
    completed: true
  },
  {
    id: "pv4",
    title: "Slik går du frem for å kontake bileier",
    description: "Beste praksis for å ta kontakt med bilselgere",
    duration: "20 min",
    completed: false
  },
  {
    id: "pv5",
    title: "Slik closer du kontrakten",
    description: "Forhandlingsteknikker og avslutning av kjøp",
    duration: "28 min",
    completed: false
  },
  {
    id: "pv6",
    title: "Slik lager du en god og selgende annonse",
    description: "Tips for å lage attraktive bilannoner som selger",
    duration: "22 min",
    completed: false
  },
  {
    id: "pv7",
    title: "Slik jobber du med kunder over tid",
    description: "Bygge langsiktige relasjoner og kundenettverk",
    duration: "26 min",
    completed: false
  },
  {
    id: "pv8",
    title: "Slik bygger du deg en pengemaskin som står og går",
    description: "Strategier for å skape stabile inntektsstrømmer",
    duration: "32 min",
    completed: false
  }
];

const purchaserDocuments = [
  {
    id: "pd1",
    title: "Våre innkjøpsløsninger forklart i detalj",
    description: "Oversikt over alle Superia Cars sine tjenester og produkter",
    completed: false,
    downloadUrl: "/documents/Innkjopslosninger.pdf",
    videoUrl: "/videos/KORTVERSJON_SUPERIA_CARS_Innkjpslsninger.mp4"
  },
  {
    id: "pd-goal",
    title: "Vårt felles mål for deg som Innkjøper",
    description: "Strategiske mål og forventninger for innkjøpere",
    completed: false,
    downloadUrl: "/documents/Felles_maal_for_deg_som_innkjoper.pdf"
  },
  {
    id: "pd0",
    title: "Vår interne verdikjede og din plass i den",
    description: "Forstå din rolle i Superia Cars sin verdikjede",
    completed: false,
    downloadUrl: "/documents/Verdikjede_Superia_Cars-forhandler.pdf"
  },
  {
    id: "pd0a",
    title: "Sjekkliste for mine arbeidsoppgaver som Innkjøper",
    description: "Detaljert sjekkliste over alle dine daglige arbeidsoppgaver og ansvar som innkjøper",
    completed: false,
    downloadUrl: "/documents/Sjekkliste_mine_oppgaver_som_Innkjoper.pdf"
  },
  {
    id: "pd0b",
    title: "Fordeler ved å bruke oss som forhandler",
    description: "Konkurransefortrinn og fordeler for kunder",
    completed: false,
    downloadUrl: "/documents/Fordeler_ved_å_selge_bilen_din_til_GANGÅS_AUTO_AS.pdf"
  },
  {
    id: "pd2",
    title: "Formdilingsavtale",
    description: "Standard avtale for formidling av kjøretøy",
    completed: false
  },
  {
    id: "pd3",
    title: "Innkjøpsavtale (opsjonsavtale)",
    description: "Opsjonsavtale for innkjøp av kjøretøy",
    completed: false
  },
  {
    id: "pd4",
    title: "Innkjøpskontrakt",
    description: "Standard kontrakt for innkjøp av kjøretøy",
    completed: false
  },
  {
    id: "pd5",
    title: "Oversikt biler inn",
    description: "Oversikt over innkommende kjøretøy til lager",
    completed: false
  }
];

const purchaserFAQ = [
  {
    id: "pf1",
    title: "Innkjøpsprosess og godkjenninger",
    description: "Vanlige spørsmål om innkjøpsprosedyrer",
    completed: true
  },
  {
    id: "pf2",
    title: "Leverandørrelasjoner",
    description: "Håndtering av leverandørspørsmål og utfordringer",
    completed: false
  },
  {
    id: "pf3",
    title: "Prisforhandlinger og avtaler",
    description: "Tips og teknikker for bedre forhandlingsresultater",
    completed: false
  }
];

const purchaserExams = [
  {
    id: "pe0",
    title: "Våre innkjøpsløsninger",
    description: "Test din kunnskap om Superia Cars sine innkjøpsløsninger",
    duration: "15 min",
    completed: false
  },
  {
    id: "pe1",
    title: "Innkjøpskompetanse test",
    description: "Grunnleggende test av innkjøpskunnskap",
    duration: "25 min",
    completed: true
  },
  {
    id: "pe2",
    title: "Markedsanalyse og trending",
    description: "Evaluering av markedsforståelse",
    duration: "30 min", 
    completed: false
  },
  {
    id: "pe3",
    title: "Forhandlingsscenarier",
    description: "Praktiske forhandlingssituasjoner",
    duration: "20 min", 
    completed: false
  }
];

const examSections = {
  pe0: [
    {
      title: "Vårt felles mål for deg som innkjøper",
      questions: [
        {
          id: "q1",
          question: "Hva er det overordnede målet ditt som innkjøper?",
          options: [
            { value: "a", label: "A) Å hente inn flest mulig biler uten å tenke på kvalitet" },
            { value: "b", label: "B) Å bygge opp en bilpark med minst 40 biler så raskt som mulig" },
            { value: "c", label: "C) Å selge deler og tilbehør" },
            { value: "d", label: "D) Å fokusere kun på bonusutbetalinger" }
          ],
          correctAnswer: "b"
        },
        {
          id: "q2",
          question: "Hvorfor er det viktig å fokusere på det overordnede målet?",
          options: [
            { value: "a", label: "A) Fordi det gir deg et stabilt og høyt inntektsgrunnlag over tid" },
            { value: "b", label: "B) Fordi du får gratis markedsføring fra selskapet" },
            { value: "c", label: "C) Fordi du slipper å jobbe med nye biler" },
            { value: "d", label: "D) Fordi det reduserer provisjonssatsene" }
          ],
          correctAnswer: "a"
        },
        {
          id: "q3",
          question: "Hva er hovedoppgaven til en innkjøper i Superia Cars?",
          options: [
            { value: "a", label: "A) Å selge biler direkte til kunder" },
            { value: "b", label: "B) Å hente inn biler selskapet kan selge videre" },
            { value: "c", label: "C) Å markedsføre selskapet" },
            { value: "d", label: "D) Å utføre verkstedarbeid" }
          ],
          correctAnswer: "b"
        },
        {
          id: "q4",
          question: "Hvor mange måter kan en innkjøper hente inn biler på?",
          options: [
            { value: "a", label: "A) 2" },
            { value: "b", label: "B) 3" },
            { value: "c", label: "C) 4" },
            { value: "d", label: "D) 5" }
          ],
          correctAnswer: "b"
        },
        {
          id: "q5",
          question: "Av de ulike måtene en innkjøper kan hente inn en bil på, hvilken modell er det man skal forsøke å hente inn biler på 10 av 10 ganger?",
          options: [
            { value: "a", label: "A) Formidlingsavtale" },
            { value: "b", label: "B) Direktekjøp langt under markedspris" },
            { value: "c", label: "C) Innkjøpsavtale / Opsjonsavtale" },
            { value: "d", label: "D) Leasingmodell" }
          ],
          correctAnswer: "c"
        },
        {
          id: "q6",
          question: "Hva er minimum bruttofortjeneste Superia Cars skal ha per bil som kjøpes for videresalg?",
          options: [
            { value: "a", label: "A) 10.000 kr" },
            { value: "b", label: "B) 16.000 kr" },
            { value: "c", label: "C) 26.000 kr" },
            { value: "d", label: "D) 35.000 kr" }
          ],
          correctAnswer: "c"
        },
        {
          id: "q7",
          question: "Hva er målet for antall biler en innkjøper skal hente inn per måned etter oppstartsperioden på 3 måneder?",
          options: [
            { value: "a", label: "A) 5 biler" },
            { value: "b", label: "B) 10 biler" },
            { value: "c", label: "C) 13 biler" },
            { value: "d", label: "D) 20 biler" }
          ],
          correctAnswer: "c"
        },
        {
          id: "q8",
          question: "Hvor stor bilpark skal en innkjøper bygge seg opp innen 3 til senest 6 måneder?",
          options: [
            { value: "a", label: "A) 20 biler" },
            { value: "b", label: "B) 30 biler" },
            { value: "c", label: "C) 40 biler" },
            { value: "d", label: "D) 50 biler" }
          ],
          correctAnswer: "c"
        },
        {
          id: "q9",
          question: "Hvor stor andel av bilparken skal selges hver måned ifølge målsetningen?",
          options: [
            { value: "a", label: "A) 10 %" },
            { value: "b", label: "B) 25 %" },
            { value: "c", label: "C) 40 %" },
            { value: "d", label: "D) 50 %" }
          ],
          correctAnswer: "b"
        },
        {
          id: "q10",
          question: "Hva er fastlønnen for en innkjøper i Superia Cars?",
          options: [
            { value: "a", label: "A) 5.000 kr" },
            { value: "b", label: "B) 10.000 kr" },
            { value: "c", label: "C) 15.000 kr" },
            { value: "d", label: "D) 20.000 kr" }
          ],
          correctAnswer: "b"
        },
        {
          id: "q11",
          question: "Hvor mye provisjon får innkjøperen per solgte bil hentet inn via Innkjøpsavtaler?",
          options: [
            { value: "a", label: "A) 1.000 kr" },
            { value: "b", label: "B) 2.000 kr" },
            { value: "c", label: "C) 3.000 kr" },
            { value: "d", label: "D) 5.000 kr" }
          ],
          correctAnswer: "c"
        },
        {
          id: "q12",
          question: "Hvor mye provisjon får innkjøperen per solgte bil hentet inn og solgt via Formidlingsavaler?",
          options: [
            { value: "a", label: "A) 1.000 kr" },
            { value: "b", label: "B) 2.000 kr" },
            { value: "c", label: "C) 3.000 kr" },
            { value: "d", label: "D) 5.000 kr" }
          ],
          correctAnswer: "b"
        },
        {
          id: "q13",
          question: "Hva er den totale månedslønnen i eksempelet der innkjøperen får solgt 10 av sine biler hentet inn via innkjøpsavtaler med en snittfortjeneste på 30.000 kr pr bil og samtidig når budsjettet som innkjøper på 13 biler inn?",
          options: [
            { value: "a", label: "A) 52.000 kr" },
            { value: "b", label: "B) 72.000 kr" },
            { value: "c", label: "C) 82.000 kr" },
            { value: "d", label: "D) 92.000 kr" }
          ],
          correctAnswer: "c"
        }
      ]
    },
    {
      title: "Våre Innkjøpsløsninger",
      questions: [
        {
          id: "q14",
          question: "Hva er hovedutfordringen med å drive bilforretning som Superia Cars ønsker å løse?",
          options: [
            { value: "a", label: "A) Manglende kunder" },
            { value: "b", label: "B) For høye reklamekostnader" },
            { value: "c", label: "C) Kapitalbinding ved innkjøp av biler" },
            { value: "d", label: "D) Manglende ansatte" }
          ],
          correctAnswer: "c"
        },
        {
          id: "q15",
          question: "Hvor mye kapital ville det kreve å ha 150 biler til salgs med en snittpris på 150.000 kr?",
          options: [
            { value: "a", label: "A) 1,5 millioner kroner" },
            { value: "b", label: "B) 15 millioner kroner" },
            { value: "c", label: "C) 22,5 millioner kroner" },
            { value: "d", label: "D) 30 millioner kroner" }
          ],
          correctAnswer: "c"
        },
        {
          id: "q16",
          question: "Hva er hovedformålet med Innkjøpsavtalen (Opsjonsavtalen)?",
          options: [
            { value: "a", label: "A) Å selge forsikringer til bileiere" },
            { value: "b", label: "B) Å gi Superia Cars rett, men ikke plikt, til å kjøpe bilen" },
            { value: "c", label: "C) Å forplikte Superia Cars til å kjøpe bilen umiddelbart" },
            { value: "d", label: "D) Å gi bileieren rett til å kjøpe bilen tilbake" }
          ],
          correctAnswer: "b"
        },
        {
          id: "q17",
          question: "Hvem betaler for tilstandskontrollen ved Innkjøpsavtale?",
          options: [
            { value: "a", label: "A) Superia Cars" },
            { value: "b", label: "B) Bileieren" },
            { value: "c", label: "C) Den nye kjøperen" },
            { value: "d", label: "D) Mekanikeren" }
          ],
          correctAnswer: "b"
        },
        {
          id: "q18",
          question: "Hva er minimumsfortjenesten Superia Cars skal ha per solgt bil ved Innkjøpsavtale?",
          options: [
            { value: "a", label: "A) 10.000 kr" },
            { value: "b", label: "B) 16.000 kr" },
            { value: "c", label: "C) 20.000 kr" },
            { value: "d", label: "D) 26.000 kr" }
          ],
          correctAnswer: "d"
        },
        {
          id: "q19",
          question: "Hva skjer dersom bileieren ønsker å hente ut bilen før den er solgt under en Innkjøpsavtale?",
          options: [
            { value: "a", label: "A) Han får bilen gratis tilbake" },
            { value: "b", label: "B) Han må betale et bruddgebyr" },
            { value: "c", label: "C) Superia Cars beholder bilen" },
            { value: "d", label: "D) Han må kjøpe en ny bil" }
          ],
          correctAnswer: "b"
        },
        {
          id: "q20",
          question: "Hva kjennetegner Formidlingsavtalen?",
          options: [
            { value: "a", label: "A) Superia Cars kjøper bilen direkte" },
            { value: "b", label: "B) Superia Cars selger bilen på vegne av eieren" },
            { value: "c", label: "C) Superia Cars leier ut bilen" },
            { value: "d", label: "D) Superia Cars tar over garantien automatisk" }
          ],
          correctAnswer: "b"
        },
        {
          id: "q21",
          question: "Hvor mye tjener Superia Cars normalt på en ren formidlingsjobb?",
          options: [
            { value: "a", label: "A) 10.000 kr eks. mva" },
            { value: "b", label: "B) 16.000 kr eks. mva" },
            { value: "c", label: "C) 20.000 kr inkl. mva" },
            { value: "d", label: "D) 26.000 kr eks. mva" }
          ],
          correctAnswer: "c"
        },
        {
          id: "q22",
          question: "Hva er en av de viktigste fordelene for Superia Cars med formidlingsavtaler?",
          options: [
            { value: "a", label: "A) Ingen reklamasjonsansvar" },
            { value: "b", label: "B) Gratis annonsering" },
            { value: "c", label: "C) Bedre fortjeneste enn Innkjøpsavtale" },
            { value: "d", label: "D) Staten dekker kostnadene" }
          ],
          correctAnswer: "a"
        },
        {
          id: "q23",
          question: "Hvordan kan Superia Cars øke fortjenesten fra 16.000 kr til 30.000 kr på en bil i formidling?",
          options: [
            { value: "a", label: "A) Ved å øke prisen på bilen" },
            { value: "b", label: "B) Ved å overta risikoen mot redusert pris til bileier" },
            { value: "c", label: "C) Ved å kutte reklamekostnader" },
            { value: "d", label: "D) Ved å selge bilen til utlandet" }
          ],
          correctAnswer: "b"
        }
      ]
    }
  ]
};

export default function PurchaserTraining() {
  const [checkboxes, setCheckboxes] = useState({
    introVideos: false,
    generalInfo: false,
    videoInstructions: false,
    documents: false,
    faqs: false,
    exams: false
  });

  const [openExamId, setOpenExamId] = useState<string | null>(null);

  const completedCheckboxes = Object.values(checkboxes).filter(Boolean).length;
  const totalCheckboxes = 6;
  const progressPercentage = (completedCheckboxes / totalCheckboxes) * 100;

  const handleCheckboxChange = (key: string) => {
    setCheckboxes(prev => ({
      ...prev,
      [key]: !prev[key as keyof typeof prev]
    }));
  };

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
                    <span>Velkommen til Innkjøpsavdelingen</span>
                    <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                      Innkjøper
                    </Badge>
                  </CardTitle>
                  <CardDescription>
                    Start din reise med disse introduksjonspresentasjonene
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
                      {purchaserWelcomeVideos.map((video, index) => (
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
                                Video {index + 1} av {purchaserWelcomeVideos.length}
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
                      SUPERIA CARS INNKJØPSAVDELING
                    </h2>
                  </div>
                  
                  <div className="space-y-4 text-muted-foreground">
                    <p>
                      På denne siden vil du finne all relevant informasjon som du trenger for å gjøre jobben din som innkjøper i en av Superia Cars mange forhandlere på en god og produktiv måte.
                    </p>
                    
                    <p>
                      Dette kunnskapssenteret skal være din one-stop-shop for informasjon og opplæring. Så er det noe du lurer på anbefaler vi deg å starte med å gå igjennom informasjonen vi har delt her, før du eventuelt beslaglegger andre ressurser i selskapet.
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
                    <span>Innkjøpskompetanse fremgang</span>
                  </CardTitle>
                  <CardDescription>
                    Du har fullført {completedCheckboxes} av {totalCheckboxes} krav
                  </CardDescription>
                </div>
                <Badge variant="secondary" className="text-lg font-semibold px-4 py-2">
                  {Math.round(progressPercentage)}% fullført
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <Progress value={progressPercentage} className="h-3" />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h4 className="font-semibold text-foreground mb-4">Som ansatt har jeg</h4>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <Checkbox 
                        id="introVideos"
                        checked={checkboxes.introVideos}
                        onCheckedChange={() => handleCheckboxChange('introVideos')}
                      />
                      <label htmlFor="introVideos" className="text-sm leading-relaxed cursor-pointer">
                        Sett på alle introduksjonsvideoene på siden Superia Cars Kunnskapssenter
                      </label>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Checkbox 
                        id="generalInfo"
                        checked={checkboxes.generalInfo}
                        onCheckedChange={() => handleCheckboxChange('generalInfo')}
                      />
                      <label htmlFor="generalInfo" className="text-sm leading-relaxed cursor-pointer">
                        Gjennomgått og forstått all informasjonen på siden For alle ansatte – uavhengig av stilling
                      </label>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-foreground mb-4">Som innkjøper har jeg</h4>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <Checkbox 
                        id="videoInstructions"
                        checked={checkboxes.videoInstructions}
                        onCheckedChange={() => handleCheckboxChange('videoInstructions')}
                      />
                      <label htmlFor="videoInstructions" className="text-sm leading-relaxed cursor-pointer">
                        Sett og forstått alle videoinstruksjoner
                      </label>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Checkbox 
                        id="documents"
                        checked={checkboxes.documents}
                        onCheckedChange={() => handleCheckboxChange('documents')}
                      />
                      <label htmlFor="documents" className="text-sm leading-relaxed cursor-pointer">
                        Lastet ned, lest og forstått alle dokumenter jeg er nødt til å bruke i mitt daglige arbeid
                      </label>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Checkbox 
                        id="faqs"
                        checked={checkboxes.faqs}
                        onCheckedChange={() => handleCheckboxChange('faqs')}
                      />
                      <label htmlFor="faqs" className="text-sm leading-relaxed cursor-pointer">
                        Lest igjennom og forstått samtlige Ofte stilte spørsmål og svar
                      </label>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Checkbox 
                        id="exams"
                        checked={checkboxes.exams}
                        onCheckedChange={() => handleCheckboxChange('exams')}
                      />
                      <label htmlFor="exams" className="text-sm leading-relaxed cursor-pointer">
                        Avlagt og bestått alle kompetanseprøver
                      </label>
                    </div>
                  </div>
                </div>
              </div>
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
              title="Videoinstruksjoner"
              description="Lær beste praksis for bilinnkjøp"
              icon={<Play className="h-5 w-5" />}
              items={purchaserVideos}
              type="video"
            />

            <ContentSection
              title="Dokumenter jeg må ha lest og forstått"
              description="Retningslinjer og prosedyrer"
              icon={<FileText className="h-5 w-5" />}
              items={purchaserDocuments}
              type="document"
            />

            <Card className="shadow-md hover:shadow-lg transition-all duration-200 bg-gradient-card border-border/50">
              <CardHeader className="pb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-lg bg-success/10 text-success border-success/20">
                    <CheckCircle className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="flex items-center space-x-2">
                      <span>Kompetanseprøver</span>
                      <Badge variant="secondary" className="text-xs">
                        {purchaserExams.length} elementer
                      </Badge>
                    </CardTitle>
                    <CardDescription className="mt-1">Evaluer og sertifiser dine innkjøpsferdigheter</CardDescription>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-3">
                {purchaserExams.map((exam) => (
                  <div 
                    key={exam.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-background/50 border border-border/30 hover:bg-secondary/30 transition-colors duration-200"
                  >
                    <div className="flex items-center space-x-3 flex-1 min-w-0">
                      <CheckCircle className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          <h4 className="text-sm font-medium truncate">{exam.title}</h4>
                          {exam.completed && (
                            <CheckCircle className="h-3 w-3 text-success" />
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1 truncate">
                          {exam.description}
                        </p>
                        {exam.duration && (
                          <div className="flex items-center space-x-1 mt-1">
                            <span className="text-xs text-muted-foreground">{exam.duration}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <Button 
                      size="sm" 
                      variant={exam.completed ? "secondary" : "default"}
                      className="ml-3 flex-shrink-0"
                      onClick={() => setOpenExamId(exam.id)}
                      disabled={!examSections[exam.id as keyof typeof examSections]}
                    >
                      {exam.completed ? 'Se resultat' : 'Start eksamen'}
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>

            <ContentSection
              title="Ofte stilte spørsmål"
              description="Vanlige utfordringer og løsninger"
              icon={<HelpCircle className="h-5 w-5" />}
              items={purchaserFAQ}
              type="faq"
            />
          </div>
        </div>
      </section>

      {/* Exam Dialogs */}
      {openExamId && examSections[openExamId as keyof typeof examSections] && (
        <ExamDialog
          open={!!openExamId}
          onOpenChange={() => setOpenExamId(null)}
          examTitle={purchaserExams.find(e => e.id === openExamId)?.title || ""}
          sections={examSections[openExamId as keyof typeof examSections]}
        />
      )}
    </div>
  );
}