import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Upload, Check, ChevronDown, FileText, Camera, Video, Trash2, Image, X } from "lucide-react";
import * as pdfjsLib from 'pdfjs-dist';
import jsPDF from 'jspdf';
import { PDFDocument } from 'pdf-lib';
import { CarLeadCard } from "@/components/CarLeadCard";
import SuperiaMarketsLayout from "@/components/layout/SuperiaMarketsLayout";
import { ScannedInput } from "@/components/ScannedInput";
import { SignatureCanvas } from "@/components/SignatureCanvas";
import { TilstandskontrollForm, TilstandskontrollData } from "@/components/TilstandskontrollForm";

const dummyCarLeads = [
  {
    id: "1",
    image: "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=400",
    registrationNumber: "AB12345",
    make: "BMW",
    model: "320d",
    year: 2018,
    price: 245000,
    mileage: 125000,
    fuel: "Diesel",
    transmission: "Automat",
    daysOnMarket: 87,
    marketComparison: "15% under markedspris for tilsvarende modell med samme kilometerstand",
    reasons: [
      "Markedsført i 87 dager uten salg",
      "15% under gjennomsnittspris",
      "Fullservicehistorikk fra autorisert forhandler",
      "Etterspurt utstyrspakke (M-Sport)"
    ],
    features: ["M-Sport", "Skinninteriør", "Navigasjon", "Panoramatak", "LED-lys"],
    owner: {
      name: "Tom Anders Melheim",
      address: "Vellets vei 5b, 1415 Oppegård",
      phone: "456 21 000"
    }
  },
  {
    id: "2",
    image: "https://images.unsplash.com/photo-1580414057403-c3c6d481e2e3?w=400",
    registrationNumber: "CD67890",
    make: "Audi",
    model: "A4 Avant",
    year: 2019,
    price: 289000,
    mileage: 98000,
    fuel: "Bensin",
    transmission: "Automat",
    daysOnMarket: 62,
    marketComparison: "Markedspris tilsier 320 000 kr for denne kombinasjonen av utstyr og kilometerstand",
    reasons: [
      "På markedet i over 2 måneder",
      "Ca. 30 000 kr under forventet pris",
      "Lav kilometerstand for årsmodell",
      "Premium utstyrsnivå inkludert"
    ],
    features: ["S-Line", "Matrix LED", "Virtual Cockpit", "Parkeringssensorer", "Adaptiv cruise"],
    owner: {
      name: "Tom Anders Melheim",
      address: "Vellets vei 5b, 1415 Oppegård",
      phone: "456 21 000"
    }
  },
  {
    id: "3",
    image: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=400",
    registrationNumber: "EF13579",
    make: "Volkswagen",
    model: "Passat GTE",
    year: 2020,
    price: 315000,
    mileage: 75000,
    fuel: "Hybrid",
    transmission: "Automat",
    daysOnMarket: 45,
    marketComparison: "Sammenlignet med andre GTE-modeller er denne 12% billigere",
    reasons: [
      "Hybrid-modell med god rekkevidde",
      "Lave driftskostnader pga. ladbar hybrid",
      "12% under markedspris",
      "Få kilometer for årsmodell 2020"
    ],
    features: ["Active Info Display", "ACC", "Webasto", "Skinn/alcantara", "LED Plus"],
    owner: {
      name: "Tom Anders Melheim",
      address: "Vellets vei 5b, 1415 Oppegård",
      phone: "456 21 000"
    }
  },
  {
    id: "4",
    image: "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=400",
    registrationNumber: "GH24680",
    make: "Mercedes-Benz",
    model: "C220d",
    year: 2017,
    price: 235000,
    mileage: 142000,
    fuel: "Diesel",
    transmission: "Automat",
    daysOnMarket: 93,
    marketComparison: "Prisen reflekterer ikke at dette er en AMG-Line med høy utstyrspakke",
    reasons: [
      "AMG-Line utstyr verdt betydelig mer",
      "Over 3 måneder på markedet",
      "Prisforhandlingsrom pga. lang salgsperiode",
      "Serviceavtale inkludert neste 30 000 km"
    ],
    features: ["AMG-Line", "Panoramatak", "Burmester", "Distronic", "Memory-pakke"],
    owner: {
      name: "Tom Anders Melheim",
      address: "Vellets vei 5b, 1415 Oppegård",
      phone: "456 21 000"
    }
  },
  {
    id: "5",
    image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400",
    registrationNumber: "IJ97531",
    make: "Volvo",
    model: "V60 D4",
    year: 2019,
    price: 295000,
    mileage: 88000,
    fuel: "Diesel",
    transmission: "Automat",
    daysOnMarket: 71,
    marketComparison: "Momentum-pakke med dette utstyret ligger normalt 35 000 kr høyere",
    reasons: [
      "Momentum-pakke betydelig under markedspris",
      "Full utstyrsgrad inkludert sikkerhetspakker",
      "Populær stasjonsvogn med høy etterspørsel",
      "Lav kilometerstand"
    ],
    features: ["Momentum", "Pilot Assist", "360-kamera", "Harman Kardon", "Panoramatak"],
    owner: {
      name: "Tom Anders Melheim",
      address: "Vellets vei 5b, 1415 Oppegård",
      phone: "456 21 000"
    }
  },
  {
    id: "6",
    image: "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=400",
    registrationNumber: "KL86420",
    make: "Tesla",
    model: "Model 3 Long Range",
    year: 2021,
    price: 349000,
    mileage: 45000,
    fuel: "Elektrisk",
    transmission: "Automat",
    daysOnMarket: 38,
    marketComparison: "Normalpris for Long Range med denne kilometerstanden er 380 000 kr",
    reasons: [
      "31 000 kr under forventet markedspris",
      "Svært lav kilometerstand",
      "Full servicepakke inkludert",
      "Autopilot og Premium interiør"
    ],
    features: ["Autopilot", "Premium interiør", "Glass-tak", "19\" hjul", "Hvit lakk"],
    owner: {
      name: "Tom Anders Melheim",
      address: "Vellets vei 5b, 1415 Oppegård",
      phone: "456 21 000"
    }
  },
  {
    id: "7",
    image: "https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=400",
    registrationNumber: "MN15935",
    make: "Skoda",
    model: "Octavia Combi RS",
    year: 2020,
    price: 279000,
    mileage: 65000,
    fuel: "Bensin",
    transmission: "Automat",
    daysOnMarket: 56,
    marketComparison: "RS-modeller med denne kilometerstanden ligger på 310 000 kr i snitt",
    reasons: [
      "Kraftig RS-versjon 31 000 kr under marked",
      "Sportslig familiebil med stort bagasjerom",
      "Lav kilometerstand",
      "Komplett utstyr inkludert Canton-anlegg"
    ],
    features: ["RS-pakke", "Canton", "Virtual Cockpit", "LED Matrix", "Sportsseter"],
    owner: {
      name: "Tom Anders Melheim",
      address: "Vellets vei 5b, 1415 Oppegård",
      phone: "456 21 000"
    }
  },
  {
    id: "8",
    image: "https://images.unsplash.com/photo-1600812238953-edb0b9fbbe4d?w=400",
    registrationNumber: "OP75319",
    make: "Mazda",
    model: "CX-5 Optimum",
    year: 2021,
    price: 359000,
    mileage: 38000,
    fuel: "Bensin",
    transmission: "Automat",
    daysOnMarket: 49,
    marketComparison: "Topputstyrt Optimum med så lav km-stand handler vanligvis for 385 000 kr",
    reasons: [
      "Topputstyrt Optimum 26 000 kr under marked",
      "Nesten som ny med kun 38 000 km",
      "Komplett sikkerhetspakke",
      "Bose-anlegg og skinninteriør"
    ],
    features: ["Optimum-pakke", "Bose", "360° kamera", "HUD", "Skinninteriør"],
    owner: {
      name: "Tom Anders Melheim",
      address: "Vellets vei 5b, 1415 Oppegård",
      phone: "456 21 000"
    }
  },
  {
    id: "9",
    image: "https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=400",
    registrationNumber: "QR95175",
    make: "Peugeot",
    model: "3008 GT",
    year: 2019,
    price: 269000,
    mileage: 72000,
    fuel: "Diesel",
    transmission: "Automat",
    daysOnMarket: 79,
    marketComparison: "GT-versjon med full pakke ligger normalt på 295 000 kr",
    reasons: [
      "GT-versjon 26 000 kr under marked",
      "Nesten 3 måneder på markedet",
      "Premium interiør med massasjeseter",
      "Full sikkerhetspakke"
    ],
    features: ["GT-Line", "Massasjeseter", "Focal Hi-Fi", "Night Vision", "Full LED"],
    owner: {
      name: "Tom Anders Melheim",
      address: "Vellets vei 5b, 1415 Oppegård",
      phone: "456 21 000"
    }
  },
  {
    id: "10",
    image: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=400",
    registrationNumber: "ST35791",
    make: "Kia",
    model: "Sportage PHEV",
    year: 2022,
    price: 419000,
    mileage: 28000,
    fuel: "Hybrid",
    transmission: "Automat",
    daysOnMarket: 41,
    marketComparison: "PHEV-modeller med topputstyr ligger på 450 000 kr",
    reasons: [
      "Plug-in hybrid 31 000 kr under marked",
      "Nesten ny med kun 28 000 km",
      "7 års garanti gjenstår",
      "Topputstyrt med alt utstyr"
    ],
    features: ["GT-Line", "Panoramatak", "JBL Premium", "Adaptiv cruise", "360° kamera"],
    owner: {
      name: "Tom Anders Melheim",
      address: "Vellets vei 5b, 1415 Oppegård",
      phone: "456 21 000"
    }
  }
];

export default function PurchaseCarForm() {
  const [showForm, setShowForm] = useState(false);
  const [agreementType, setAgreementType] = useState<"innkjopsavtale" | "formidlingsavtale">("innkjopsavtale");
  const [finnUrl, setFinnUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [uploadMethod, setUploadMethod] = useState<"url" | "pdf">("pdf");
  const [showPreview, setShowPreview] = useState(false);
  const [pdfPreviewUrl, setPdfPreviewUrl] = useState<string | null>(null);
  const [showActions, setShowActions] = useState(false);
  const [activeTab, setActiveTab] = useState("dagens-leads");
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [isImportingFromFinn, setIsImportingFromFinn] = useState(false);
  const [finnImportUrl, setFinnImportUrl] = useState("");
  const [isScanningImage, setIsScanningImage] = useState(false);
  const [scannedFields, setScannedFields] = useState<Set<string>>(new Set());
  const [createdLeads, setCreatedLeads] = useState<any[]>([]);
  const [mottakskontrollCars, setMottakskontrollCars] = useState<any[]>([]);
  const [showManualUploadDialog, setShowManualUploadDialog] = useState(false);
  const [manualUploadData, setManualUploadData] = useState({
    registrationNumber: "",
    make: "",
    model: "",
    year: "",
    sellerName: "",
  });
  const [manualUploadFile, setManualUploadFile] = useState<File | null>(null);
  const [selectedMottakskontrollCar, setSelectedMottakskontrollCar] = useState<any>(null);
  const [mottakskontrollChecklist, setMottakskontrollChecklist] = useState({
    erBilenVasket: '' as '' | 'ja' | 'nei',
    harHund: '' as '' | 'ja' | 'nei',
    vognkortDel1: '' as '' | 'ja' | 'nei',
    antallNokler: '',
    sommerdekkKomplett: '' as '' | 'ja' | 'nei',
    monsterdybdeSommer: '',
    vinterdekkKomplett: '' as '' | 'ja' | 'nei',
    monsterdybdeVinter: '',
    gyldigForsikring: '' as '' | 'ja' | 'nei',
    erEuGodkjent: '' as '' | 'ja' | 'nei',
    drivstoffniva: '' as '' | '1/4' | '1/2' | '3/4' | 'Full',
    merknader: '',
    ekstraVask: '',
    ekstraHundehar: '',
    forholdSignature: '',
    forholdSignatureDate: '',
    betalingBekreftet: false,
  });
  const [expandedMottakskontrollId, setExpandedMottakskontrollId] = useState<string | null>(null);
  const [editingLeadId, setEditingLeadId] = useState<string | null>(null);
  const [carImageUrl, setCarImageUrl] = useState<string>("");
  const [isLoadingLeads, setIsLoadingLeads] = useState(false);
  const [showMottakskontrollPreview, setShowMottakskontrollPreview] = useState(false);
  const [mottakskontrollPdfUrl, setMottakskontrollPdfUrl] = useState<string | null>(null);
  const [previewMottakskontrollCar, setPreviewMottakskontrollCar] = useState<any>(null);
  const [selectedTilstandskontrollCar, setSelectedTilstandskontrollCar] = useState<any>(null);
  const [showAgreementPreview, setShowAgreementPreview] = useState(false);
  const [agreementPreviewPdfUrl, setAgreementPreviewPdfUrl] = useState<string | null>(null);
  const [agreementPreviewCar, setAgreementPreviewCar] = useState<any>(null);
  const [expandedVaskFotoId, setExpandedVaskFotoId] = useState<string | null>(null);
  const [uploadingMedia, setUploadingMedia] = useState<string | null>(null);
  const { toast } = useToast();

  // Fetch leads from database on mount
  useEffect(() => {
    fetchLeads();
    fetchMottakskontroll();
  }, []);

  const fetchLeads = async () => {
    setIsLoadingLeads(true);
    try {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Transform database leads to the format expected by the UI
      const transformedLeads = (data || []).map((lead: any) => ({
        id: lead.id,
        image: lead.image_url || "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=400",
        registrationNumber: lead.registration_number,
        make: lead.make,
        model: lead.model,
        year: lead.year,
        price: lead.price,
        mileage: lead.mileage,
        fuel: lead.fuel || "Ukjent",
        transmission: lead.transmission || "Ukjent",
        daysOnMarket: 0,
        marketComparison: "Fra database",
        reasons: Array.isArray(lead.reasons) ? lead.reasons : [],
        features: Array.isArray(lead.features) ? lead.features : [],
        finnUrl: lead.finn_url,
        owner: {
          name: lead.owner_name || "Ikke oppgitt",
          address: lead.owner_address || "Ikke oppgitt",
          phone: lead.owner_phone || "Ikke oppgitt"
        },
        specifications: {
          omregistrering: lead.omregistrering,
          prisExclOmreg: lead.pris_excl_omreg,
          modellYear: lead.modell_year,
          karosseri: lead.karosseri,
          effekt: lead.effekt,
          slagvolum: lead.slagvolum,
          co2Utslipp: lead.co2_utslipp,
          maksimalTilhengervekt: lead.maksimal_tilhengervekt,
          hjuldrift: lead.hjuldrift,
          vekt: lead.vekt,
          seter: lead.seter,
          dorer: lead.dorer,
          bagasjerom: lead.bagasjerom,
          farge: lead.farge,
          bilenStarI: lead.bilen_star_i,
          sistEuGodkjent: lead.sist_eu_godkjent,
          nesteEuKontroll: lead.neste_eu_kontroll,
          avgiftsklasse: lead.avgiftsklasse,
          chassisNr: lead.chassis_nr,
          forsteGangRegistrert: lead.forste_gang_registrert,
          salgsform: lead.salgsform,
        }
      }));

      setCreatedLeads(transformedLeads);
    } catch (error: any) {
      console.error('Error fetching leads:', error);
      toast({
        title: "Feil",
        description: "Kunne ikke hente leads fra databasen",
        variant: "destructive",
      });
    } finally {
      setIsLoadingLeads(false);
    }
  };

  const fetchMottakskontroll = async () => {
    try {
      const { data, error } = await supabase
        .from('mottakskontroll')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const transformedCars = (data || []).map((car: any) => ({
        id: car.id,
        regNumber: car.registration_number,
        make: car.make,
        model: car.model,
        year: car.year,
        seller: car.seller_name,
        sentDate: car.sent_date,
        status: car.status,
        mottakskontrollData: car.mottakskontroll_data,
        leadId: car.lead_id,
        agreementPdfPath: car.agreement_pdf_path,
        vaskFotoData: car.vask_foto_data,
        vaskFotoCompleted: car.vask_foto_completed,
      }));

      setMottakskontrollCars(transformedCars);
    } catch (error: any) {
      console.error('Error fetching mottakskontroll:', error);
    }
  };

  // Configure PDF.js worker
  pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
  
  // Form state
  const [vehicleData, setVehicleData] = useState({
    brand: "",
    model: "",
    regNumber: "",
    mileage: "",
    equipment: "",
    reregistrationFee: "",
    priceExclReregistration: "",
    yearlyTax: "",
    modelYear: "",
    bodyType: "",
    fuelType: "",
    power: "",
    batteryCapacity: "",
    range: "",
    transmission: "",
    maxTrailerWeight: "",
    driveType: "",
    weight: "",
    seats: "",
    color: "",
    interiorColor: "",
    location: "",
    nextEuControl: "",
    taxClass: "",
    chassisNumber: "",
    firstRegistration: "",
    owners: "",
    saleType: "",
    trunkSize: "",
    price: "",
    slagvolum: "",
    co2Utslipp: "",
    dorer: "",
    sistEuGodkjent: "",
  });

  // Seller state
  const [sellerData, setSellerData] = useState({
    name: "",
    personNr: "",
    phone: "",
    address: "",
    postalCode: "",
    city: "",
    email: "",
    account: "",
  });

  // New lead form state
  const [newLeadData, setNewLeadData] = useState({
    registrationNumber: "",
    make: "",
    model: "",
    year: "",
    price: "",
    mileage: "",
    fuel: "",
    transmission: "",
    ownerName: "",
    ownerAddress: "",
    ownerPhone: "",
    finnUrl: "",
    features: "",
    reasons: "",
    // Specifications
    omregistrering: "",
    prisExclOmreg: "",
    modellYear: "",
    karosseri: "",
    effekt: "",
    slagvolum: "",
    co2Utslipp: "",
    maksimalTilhengervekt: "",
    hjuldrift: "",
    vekt: "",
    seter: "",
    dorer: "",
    bagasjerom: "",
    farge: "",
    bilenStarI: "",
    sistEuGodkjent: "",
    nesteEuKontroll: "",
    avgiftsklasse: "",
    chassisNr: "",
    forsteGangRegistrert: "",
    salgsform: "",
  });

  // Selgers egenerklæring state
  const [selgersErklaering, setSelgersErklaering] = useState({
    condition: "brukt",
    usage: "privat",
    maintenance: "merkeverksted",
    fees: "ja",
    allServicesFollowed: "ja",
    lastServiceDate: "",
    usedImport: "nei",
    airbagDisconnected: "nei",
    antiRustWarranty: "nei",
    serviceManual: "ja",
    chipTuned: "nei",
    componentsChanged: "nei",
    mileageCorrect: "ja",
    acWorks: "ja",
    oilConsumption: "ja",
    numberOfKeys: "",
  });

  // Buyer state
  const [buyerData, setBuyerData] = useState({
    name: "",
    orgNumber: "",
    phone: "",
    address: "",
    postalCode: "",
    city: "",
    email: "",
  });

  // Equipment state
  const [equipment, setEquipment] = useState<Record<string, boolean>>({});
  const [isAnalyzingEquipment, setIsAnalyzingEquipment] = useState(false);

  // Equipment mapping for auto-population
  const equipmentMapping: Record<string, string> = {
    "adaptiv-cruise": "adaptiv cruisekontroll",
    "adaptive-matrix": "adaptive matrix led frontlykter",
    "air-condition": "air condition",
    "airbag-foran": "airbag foran",
    "akustiske-frontruter": "akustiske frontruter",
    "alarm": "alarm",
    "antiskrens": "antiskrens",
    "antispinn": "antispinn",
    "app-integrasjon": "app integrasjon",
    "aut-avblendbart": "aut avblendbart innvendig speil",
    "aux-inngang": "aux inngang",
    "blindsone": "blindsoneassistent",
    "bluetooth": "bluetooth",
    "cruisekontroll": "cruisekontroll",
    "dekktrykk": "dekktrykksovervåkning",
    "delt-baksete": "delt baksete",
    "digital-nokkel": "digital nøkkel",
    "el-sidespeil": "el sidespeil m varme",
    "el-vinduer": "el vinduer",
    "elektrisk-bakluke": "elektrisk bakluke",
    "elektrisk-sete": "elektrisk sete m memory",
    "elektriske-speil": "elektriske speil",
    "forvarming-batteri": "forvarming av batteri",
    "frunk": "frunk",
    "gjenfinning": "gjenfinningssystem",
    "isofix": "isofix",
    "justerbar-korsrygg": "justerbar korsryggstøtte",
    "kjorecomputer": "kjørecomputer",
    "klimaanlegg": "klimaanlegg",
    "led-lys": "led lys",
    "lettmet-sommer": "lettmet felg sommer",
    "lettmet-vinter": "lettmet felg vinter",
    "midtarmlene": "midtarmlene",
    "multifunksjonsratt": "multifunksjonsratt",
    "musikkstreaming": "musikkstreaming",
    "morke-ruter": "mørke ruter",
    "navigasjon": "navigasjonssystem",
    "nettleser": "nettleser",
    "nokkelloS-start": "nøkkelløs start",
    "oppvarmede-seter-bak": "oppvarmede seter bak",
    "oppvarmede-seter-foran": "oppvarmede seter foran",
    "oppvarmet-ratt": "oppvarmet ratt",
    "radio-dab": "radio dab",
    "regnsensor": "regnsensor",
    "ryggekamera": "ryggekamera",
    "sentrallas": "sentrallås",
    "servostyring": "servostyring",
    "sideairbager": "sideairbager",
    "skinnratt": "skinnratt",
    "soltak": "soltak glasstak",
    "sommerhjul": "sommerhjul",
    "tretthetsvarsling": "tretthetsvarsling",
    "tradlos-mobil": "trådløs mobillading",
    "tv-skjerm": "tv skjerm i baksetet",
    "underholdning-bak": "underholdningssystem bak",
    "usb-c": "usb c",
    "varmepumpe": "varmepumpe",
    "ventilerte-seter": "ventilerte seter foran",
    "videoovervaking": "videoovervåkning",
    "videostreaming": "videostreaming",
    "vinterhjul": "vinterhjul"
  };

  const handleEquipmentListChange = (text: string) => {
    const lines = text.split('\n')
      .map(line => line.trim().toLowerCase())
      .filter(line => line.length > 0);
    
    const newEquipment: Record<string, boolean> = {};
    
    // Check each equipment item against the pasted text
    Object.entries(equipmentMapping).forEach(([id, label]) => {
      const isMatched = lines.some(line => {
        const lineLower = line.toLowerCase();
        const labelLower = label.toLowerCase();
        // Match if line contains label or label contains line (for partial matches)
        return lineLower.includes(labelLower) || 
               labelLower.includes(lineLower) ||
               lineLower === labelLower;
      });
      
      if (isMatched) {
        newEquipment[id] = true;
      }
    });
    
    setEquipment(newEquipment);
    
    // Show toast with count
    const matchCount = Object.keys(newEquipment).length;
    if (matchCount > 0) {
      toast({
        title: "Utstyr oppdatert",
        description: `${matchCount} utstyrselement(er) ble merket`,
      });
    }
  };

  const handleEquipmentImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Ugyldig filtype",
        description: "Vennligst last opp et bilde",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "Fil for stor",
        description: "Bildet må være mindre enn 10MB",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzingEquipment(true);

    try {
      // Convert image to base64
      const reader = new FileReader();
      reader.readAsDataURL(file);
      
      await new Promise((resolve, reject) => {
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
      });

      const imageBase64 = reader.result as string;

      // Call the edge function to analyze the image
      const { data, error } = await supabase.functions.invoke('extract-equipment-from-image', {
        body: { imageBase64 }
      });

      if (error) {
        throw error;
      }

      if (data?.equipmentItems && Array.isArray(data.equipmentItems)) {
        // Update the features field in the lead form with comma-separated values
        const featuresString = data.equipmentItems.join(', ');
        setNewLeadData({...newLeadData, features: featuresString});
        
        toast({
          title: "Utstyr ekstrahert",
          description: `${data.equipmentItems.length} utstyrselement(er) funnet i bildet`,
        });
      } else {
        toast({
          title: "Ingen utstyr funnet",
          description: "Kunne ikke finne utstyr i bildet",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error analyzing equipment image:', error);
      toast({
        title: "Feil ved analyse",
        description: "Kunne ikke analysere bildet. Prøv igjen.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzingEquipment(false);
      // Reset the input
      event.target.value = '';
    }
  };

  const handleSpecificationsListChange = (text: string) => {
    const lines = text.split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0);
    
    const newVehicleData = { ...vehicleData };
    let matchCount = 0;
    
    // Mapping of keywords to field IDs - includes both Kjøretøybeskrivelse and Øvrige spesifikasjoner
    const fieldMapping: Record<string, { key: keyof typeof vehicleData; keywords: string[] }> = {
      // Kjøretøybeskrivelse fields
      brand: { key: 'brand', keywords: ['merke', 'brand'] },
      model: { key: 'model', keywords: ['modell', 'type', 'model'] },
      fuelType: { key: 'fuelType', keywords: ['drivstoff', 'fuel'] },
      regNumber: { key: 'regNumber', keywords: ['reg.nr', 'reg nr', 'regnr', 'registreringsnummer'] },
      chassisNumber: { key: 'chassisNumber', keywords: ['chassis', 'vin', 'chassis nr'] },
      mileage: { key: 'mileage', keywords: ['kilometerstand', 'km stand', 'mileage', 'kilometer'] },
      firstRegistration: { key: 'firstRegistration', keywords: ['1. gang registrert', '1 gang registrert', 'første gang registrert', 'first registration'] },
      modelYear: { key: 'modelYear', keywords: ['modellår', 'årsmodell', 'model year'] },
      nextEuControl: { key: 'nextEuControl', keywords: ['neste frist for eu-kontroll', 'eu kontroll', 'eu-kontroll', 'neste eu'] },
      
      // Øvrige spesifikasjoner fields
      bodyType: { key: 'bodyType', keywords: ['karosseri', 'body type'] },
      power: { key: 'power', keywords: ['effekt', 'power'] },
      batteryCapacity: { key: 'batteryCapacity', keywords: ['batterikapasitet', 'battery'] },
      range: { key: 'range', keywords: ['rekkevidde', 'wltp', 'range'] },
      transmission: { key: 'transmission', keywords: ['girkasse', 'transmission'] },
      maxTrailerWeight: { key: 'maxTrailerWeight', keywords: ['tilhengervekt', 'trailer', 'hengervekt', 'maks tilhengervekt', 'maksimal tilhengervekt'] },
      driveType: { key: 'driveType', keywords: ['hjuldrift', 'drive'] },
      weight: { key: 'weight', keywords: ['vekt', 'weight'] },
      seats: { key: 'seats', keywords: ['seter', 'seats', 'sitteplasser'] },
      color: { key: 'color', keywords: ['farge', 'color', 'lakk'] },
      interiorColor: { key: 'interiorColor', keywords: ['interiørfarge', 'interior'] },
      location: { key: 'location', keywords: ['bilen står i', 'location', 'sted'] },
      taxClass: { key: 'taxClass', keywords: ['avgiftsklasse', 'tax'] },
      owners: { key: 'owners', keywords: ['eiere', 'owners', 'eier'] },
      saleType: { key: 'saleType', keywords: ['salgsform', 'sale type'] },
      trunkSize: { key: 'trunkSize', keywords: ['bagasjerom', 'trunk', 'størrelse på bagasjerom'] }
    };
    
    // Process lines in pairs: field name followed by value
    for (let i = 0; i < lines.length - 1; i += 2) {
      const fieldName = lines[i].toLowerCase();
      const value = lines[i + 1];
      
      if (fieldName && value) {
        // Try to match the field name to a field
        Object.entries(fieldMapping).forEach(([fieldId, { key: fieldKey, keywords }]) => {
          if (keywords.some(keyword => fieldName.includes(keyword.toLowerCase()))) {
            newVehicleData[fieldKey] = value;
            matchCount++;
          }
        });
      }
    }
    
    setVehicleData(newVehicleData);
    
    // Show toast with count
    if (matchCount > 0) {
      toast({
        title: "Kjøretøydata oppdatert",
        description: `${matchCount} felt ble fylt ut`,
      });
    }
  };



  const parsePdfFile = async (file: File) => {
    setIsLoading(true);
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      
      let fullText = "";
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map((item: any) => item.str).join(" ");
        fullText += pageText + "\n";
      }

      // Extract vehicle information from PDF text
      const brandMatch = fullText.match(/Merke[:\s]+([A-Za-zæøåÆØÅ\s]+?)(?=\n|Modell)/i);
      const modelMatch = fullText.match(/Modell[:\s]+([A-Za-z0-9\s\-]+?)(?=\n|Modellar|Årsmodell)/i);
      const yearMatch = fullText.match(/(?:Modellar|Årsmodell)[:\s]+(\d{4})/i);
      const mileageMatch = fullText.match(/Kilometerstand[:\s]+([\d\s]+)\s*km/i);
      const colorMatch = fullText.match(/Farge[:\s]+([A-Za-zæøåÆØÅ]+)/i);
      const fuelMatch = fullText.match(/Drivstoff[:\s]+([A-Za-z0-9]+)/i);
      const transmissionMatch = fullText.match(/Girkasse[:\s]+([A-Za-zæøåÆØÅ]+)/i);
      const regNumberMatch = fullText.match(/Registreringsnummer[:\s]+([A-Z0-9]+)/i);
      const chassisMatch = fullText.match(/(?:Chassis nr\.|VIN)[:\s]+([A-Z0-9]+)/i);
      const firstRegMatch = fullText.match(/(?:1 gang registrert|Salgsform)[:\s]+(\d{2}\.\d{2}\.\d{4})/i);
      
      // Extract equipment list
      const equipmentSection = fullText.match(/Utstyr(.+?)(?=\n\n|Beskrivelse|$)/is);
      let equipment = "";
      if (equipmentSection) {
        const equipmentItems = equipmentSection[1].match(/- [^\n]+/g);
        if (equipmentItems) {
          equipment = equipmentItems.map(item => item.replace(/^- /, '')).join(", ");
        }
      }

      setVehicleData({
        brand: brandMatch ? brandMatch[1].trim() : "",
        model: modelMatch ? modelMatch[1].trim() : "",
        regNumber: regNumberMatch ? regNumberMatch[1].trim() : "",
        mileage: mileageMatch ? mileageMatch[1].replace(/\s/g, '') : "",
        equipment: equipment || "",
        reregistrationFee: "",
        priceExclReregistration: "",
        yearlyTax: "",
        modelYear: yearMatch ? yearMatch[1].trim() : "",
        bodyType: "",
        fuelType: fuelMatch ? fuelMatch[1].trim() : "",
        power: "",
        batteryCapacity: "",
        range: "",
        transmission: transmissionMatch ? transmissionMatch[1].trim() : "",
        maxTrailerWeight: "",
        driveType: "",
        weight: "",
        seats: "",
        color: colorMatch ? colorMatch[1].trim() : "",
        interiorColor: "",
        location: "",
        nextEuControl: "",
        taxClass: "",
        chassisNumber: chassisMatch ? chassisMatch[1].trim() : "",
        firstRegistration: firstRegMatch ? firstRegMatch[1].trim() : "",
        owners: "",
        saleType: "",
        trunkSize: "",
        price: "",
        slagvolum: "",
        co2Utslipp: "",
        dorer: "",
        sistEuGodkjent: "",
      });

      // Populate additional fields
      if (colorMatch && document.getElementById('color')) {
        (document.getElementById('color') as HTMLInputElement).value = colorMatch[1].trim();
      }
      if (fuelMatch && document.getElementById('fuel')) {
        (document.getElementById('fuel') as HTMLInputElement).value = fuelMatch[1].trim();
      }
      if (transmissionMatch && document.getElementById('transmission')) {
        (document.getElementById('transmission') as HTMLInputElement).value = transmissionMatch[1].trim();
      }
      if (chassisMatch && document.getElementById('chassis')) {
        (document.getElementById('chassis') as HTMLInputElement).value = chassisMatch[1].trim();
      }
      if (firstRegMatch && document.getElementById('firstReg')) {
        (document.getElementById('firstReg') as HTMLInputElement).value = firstRegMatch[1].trim();
      }
      if (yearMatch && document.getElementById('year')) {
        (document.getElementById('year') as HTMLInputElement).value = yearMatch[1].trim();
      }

      toast({
        title: "Data hentet!",
        description: "Kjøretøyinformasjon er fylt ut fra PDF",
      });
    } catch (error) {
      console.error('Error parsing PDF:', error);
      toast({
        title: "Feil",
        description: "Kunne ikke lese PDF-filen",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchFinnData = async () => {
    if (!finnUrl.includes('finn.no')) {
      toast({
        title: "Ugyldig URL",
        description: "Vennligst oppgi en gyldig finn.no URL",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('fetch-finn-listing', {
        body: { url: finnUrl }
      });

      if (error) throw error;

      if (data.success && data.data) {
        const finnData = data.data;
        setVehicleData({
          brand: finnData.brand || "",
          model: finnData.model || "",
          regNumber: finnData.regNumber || "",
          mileage: finnData.mileage?.toString() || "",
          equipment: finnData.equipment || "",
          reregistrationFee: "",
          priceExclReregistration: "",
          yearlyTax: "",
          modelYear: finnData.year?.toString() || "",
          bodyType: "",
          fuelType: finnData.fuel || "",
          power: "",
          batteryCapacity: "",
          range: "",
          transmission: finnData.transmission || "",
          maxTrailerWeight: "",
          driveType: "",
          weight: "",
          seats: "",
          color: finnData.color || "",
          interiorColor: "",
          location: "",
          nextEuControl: "",
          taxClass: "",
          chassisNumber: finnData.chassisNumber || "",
          firstRegistration: finnData.firstRegistered || "",
          owners: "",
          saleType: "",
          trunkSize: "",
          price: finnData.price?.toString() || "",
          slagvolum: "",
          co2Utslipp: "",
          dorer: "",
          sistEuGodkjent: "",
        });

        // Populate additional fields
        if (finnData.color) {
          (document.getElementById('color') as HTMLInputElement).value = finnData.color;
        }
        if (finnData.fuel) {
          (document.getElementById('fuel') as HTMLInputElement).value = finnData.fuel;
        }
        if (finnData.transmission) {
          (document.getElementById('transmission') as HTMLInputElement).value = finnData.transmission;
        }
        if (finnData.chassisNumber) {
          (document.getElementById('chassis') as HTMLInputElement).value = finnData.chassisNumber;
        }
        if (finnData.firstRegistered) {
          (document.getElementById('firstReg') as HTMLInputElement).value = finnData.firstRegistered;
        }
        if (finnData.year) {
          (document.getElementById('year') as HTMLInputElement).value = finnData.year.toString();
        }

        toast({
          title: "Data hentet!",
          description: "Kjøretøyinformasjon er fylt ut fra finn.no",
        });
      }
    } catch (error) {
      console.error('Error fetching finn data:', error);
      toast({
        title: "Feil",
        description: "Kunne ikke hente data fra finn.no",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      parsePdfFile(file);
    } else {
      toast({
        title: "Ugyldig fil",
        description: "Vennligst last opp en PDF-fil",
        variant: "destructive",
      });
    }
  };

  const generatePdfPreview = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 15;
    const cardMargin = margin + 2;
    const cardWidth = pageWidth - (2 * margin);
    let yPos = 20;
    
    // Helper function to add header with logo and company info
    const addHeader = () => {
      // Company name and contact info
      doc.setFontSize(10);
      doc.setFont(undefined, 'bold');
      doc.text("GANGÅS AUTO AS", margin, 10);
      doc.setFont(undefined, 'normal');
      doc.setFontSize(8);
      doc.text("Org.nr: 925 581 130", margin, 14);
      doc.text("Tlf: 402 82 502", margin + 40, 14);
      doc.text("E-post: post@gangasauto.no", margin + 70, 14);
      
      // Draw line under header
      doc.setDrawColor(200, 200, 200);
      doc.setLineWidth(0.5);
      doc.line(margin, 16, pageWidth - margin, 16);
    };
    
    // Helper function to add footer
    const addFooter = (pageNum: number, totalPages: number) => {
      doc.setFontSize(8);
      doc.setTextColor(100, 100, 100);
      doc.text(`Side ${pageNum} av ${totalPages}`, pageWidth / 2, pageHeight - 10, { align: "center" });
      doc.text("www.gangasauto.no", pageWidth - margin, pageHeight - 10, { align: "right" });
      doc.setTextColor(0, 0, 0);
    };
    
    // Add header to first page
    addHeader();
    yPos = 25;
    
    // Helper function to draw card
    const drawCard = (title: string, startY: number) => {
      doc.setDrawColor(220, 220, 220);
      doc.setLineWidth(0.5);
      return startY;
    };
    
    // Helper function to add card title
    const addCardTitle = (title: string, y: number) => {
      doc.setFillColor(249, 250, 251);
      doc.rect(margin, y, cardWidth, 10, 'F');
      doc.setFontSize(12);
      doc.setFont(undefined, 'bold');
      doc.text(title, cardMargin, y + 7);
      doc.setFont(undefined, 'normal');
      return y + 12;
    };
    
    // Helper function to check if we need a new page
    const checkNewPage = (currentY: number, spaceNeeded: number = 30) => {
      if (currentY + spaceNeeded > 270) {
        doc.addPage();
        addHeader();
        return 25;
      }
      return currentY;
    };
    
    // Title
    doc.setFontSize(20);
    doc.setFont(undefined, 'bold');
    doc.text("INNKJØPSAVTALE", pageWidth / 2, yPos, { align: "center" });
    doc.setFont(undefined, 'normal');
    yPos += 15;
    
    // Get all form values
    const sellerName = (document.getElementById('sellerName') as HTMLInputElement)?.value || "";
    const sellerPersonNr = (document.getElementById('sellerPersonNr') as HTMLInputElement)?.value || "";
    const sellerPhone = (document.getElementById('sellerPhone') as HTMLInputElement)?.value || "";
    const sellerAddress = (document.getElementById('sellerAddress') as HTMLInputElement)?.value || "";
    const sellerPostNr = (document.getElementById('sellerPostNr') as HTMLInputElement)?.value || "";
    const sellerPoststed = (document.getElementById('sellerPoststed') as HTMLInputElement)?.value || "";
    const sellerEmail = (document.getElementById('sellerEmail') as HTMLInputElement)?.value || "";
    const sellerAccount = (document.getElementById('sellerAccount') as HTMLInputElement)?.value || "";
    const purchasePrice = (document.getElementById('purchasePrice') as HTMLInputElement)?.value || "";
    const grossProfit = (document.getElementById('grossProfit') as HTMLInputElement)?.value || "";
    const signatureDate = (document.getElementById('signatureDate') as HTMLInputElement)?.value || "";
    const signaturePlace = (document.getElementById('signaturePlace') as HTMLInputElement)?.value || "";
    const damageDescription = (document.getElementById('damageDescription') as HTMLTextAreaElement)?.value || "";
    const finnInfo = (document.getElementById('finnInfo') as HTMLInputElement)?.value || "";
    
    // Get Økonomi values
    const arsavgiftBetalt = (document.querySelector('input[name="arsavgift"]:checked') as HTMLInputElement)?.value || "ja";
    const pantGjeld = (document.querySelector('input[name="pant"]:checked') as HTMLInputElement)?.value || "nei";
    
    // Get Egendefinerte opplysninger
    const bilenKjopt = (document.querySelector('input[name="condition"]:checked') as HTMLInputElement)?.value || "brukt";
    const bilenBrukt = (document.querySelector('input[name="usage"]:checked') as HTMLInputElement)?.value || "privat";
    const vedlikehold = (document.querySelector('input[name="maintenance"]:checked') as HTMLInputElement)?.value || "merkeverksted";
    const avgifterBetalt = (document.querySelector('input[name="fees"]:checked') as HTMLInputElement)?.value || "ja";
    
    // Get Intervallstyrte arbeider
    const registerreimSiste = (document.getElementById('registerreim-siste') as HTMLInputElement)?.value || "";
    const registerreimNeste = (document.getElementById('registerreim-neste') as HTMLInputElement)?.value || "";
    const serviceSiste = (document.getElementById('service-siste') as HTMLInputElement)?.value || "";
    const serviceNeste = (document.getElementById('service-neste') as HTMLInputElement)?.value || "";
    const pkkSiste = (document.getElementById('pkk-siste') as HTMLInputElement)?.value || "";
    const pkkNeste = (document.getElementById('pkk-neste') as HTMLInputElement)?.value || "";
    
    // Get Karrosseriskader
    const harSkader = (document.querySelector('input[name="damage"]:checked') as HTMLInputElement)?.value || "nei";

    // SELGER Card
    const selgerStart = yPos;
    yPos = addCardTitle("Selger", yPos);
    doc.setFontSize(10);
    doc.text(`Navn: ${sellerName}`, cardMargin, yPos); yPos += 5;
    doc.text(`Person/org.nr: ${sellerPersonNr}`, cardMargin, yPos); yPos += 5;
    doc.text(`Telefon: ${sellerPhone}`, cardMargin, yPos); yPos += 5;
    doc.text(`Adresse: ${sellerAddress}`, cardMargin, yPos); yPos += 5;
    doc.text(`Postnr: ${sellerPostNr}  Poststed: ${sellerPoststed}`, cardMargin, yPos); yPos += 5;
    doc.text(`E-post: ${sellerEmail}`, cardMargin, yPos); yPos += 5;
    doc.text(`Kontonummer: ${sellerAccount}`, cardMargin, yPos); yPos += 5;
    const selgerHeight = yPos - selgerStart + 5;
    doc.rect(margin, selgerStart, cardWidth, selgerHeight, 'S');
    yPos += 7;
    
    // KJØPER Card
    yPos = checkNewPage(yPos, 40);
    const kjoperStart = yPos;
    yPos = addCardTitle("Kjøper", yPos);
    
    doc.setFontSize(10);
    doc.text(`Navn: ${buyerData.name || '-'}`, cardMargin, yPos); yPos += 5;
    doc.text(`Org.nummer: ${buyerData.orgNumber || '-'}`, cardMargin, yPos); yPos += 5;
    doc.text(`Telefon: ${buyerData.phone || '-'}`, cardMargin, yPos); yPos += 5;
    doc.text(`Adresse: ${buyerData.address || '-'}`, cardMargin, yPos); yPos += 5;
    doc.text(`Postnr: ${buyerData.postalCode || '-'}  Poststed: ${buyerData.city || '-'}`, cardMargin, yPos); yPos += 5;
    doc.text(`Epost-adresse: ${buyerData.email || '-'}`, cardMargin, yPos); yPos += 5;
    
    const kjoperHeight = yPos - kjoperStart + 5;
    doc.rect(margin, kjoperStart, cardWidth, kjoperHeight, 'S');
    yPos += 7;
    
    // ØKONOMI Card
    yPos = checkNewPage(yPos, 35);
    const ekonomiStart = yPos;
    yPos = addCardTitle("Økonomi", yPos);
    doc.setFontSize(10);
    doc.text(`Avtalt oppgjørspris: ${purchasePrice} NOK`, cardMargin, yPos); yPos += 5;
    doc.text(`Avtalt bruttofortjeneste: ${grossProfit} NOK`, cardMargin, yPos); yPos += 5;
    doc.text(`Årsavgift betalt: ${arsavgiftBetalt === 'ja' ? 'Ja' : 'Nei'}`, cardMargin, yPos); yPos += 5;
    doc.text(`Pant / gjeld: ${pantGjeld === 'ja' ? 'Ja' : 'Nei'}`, cardMargin, yPos); yPos += 5;
    const ekonomiHeight = yPos - ekonomiStart + 5;
    doc.rect(margin, ekonomiStart, cardWidth, ekonomiHeight, 'S');
    yPos += 7;
    
    // KJØRETØY Card with 3-column layout
    yPos = checkNewPage(yPos, 40);
    const vehicleCardStart = yPos;
    yPos = addCardTitle("Kjøretøy", yPos);
    
    doc.setFontSize(10);
    doc.setFont(undefined, 'bold');
    doc.text("Kjøretøybeskrivelse", cardMargin, yPos); 
    doc.setFont(undefined, 'normal');
    yPos += 5;
    
    // Add finn.no link
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text("Informasjon hentet fra Selgers egen bilannonse på finn.no:", cardMargin, yPos); yPos += 4;
    if (finnInfo) {
      doc.setTextColor(0, 102, 204); // Blue color for link
      doc.textWithLink(finnInfo, cardMargin, yPos, { url: finnInfo });
    } else {
      doc.text("-", cardMargin, yPos);
    }
    doc.setTextColor(0, 0, 0); // Reset to black
    yPos += 6;
    
    
    // Three-column layout for Kjøretøybeskrivelse
    doc.setFontSize(10);
    const col1X = cardMargin;
    const col2X = cardMargin + 60;
    const col3X = cardMargin + 120;
    let col1Y = yPos;
    let col2Y = yPos;
    let col3Y = yPos;
    
    const vehicleFields = [
      { label: "Merke", value: vehicleData.brand },
      { label: "Modell", value: vehicleData.model },
      { label: "Drivstoff", value: vehicleData.fuelType },
      { label: "Reg.nr", value: vehicleData.regNumber },
      { label: "Chassis nr. (VIN)", value: vehicleData.chassisNumber },
      { label: "Kilometerstand", value: vehicleData.mileage },
      { label: "1. gang registrert", value: vehicleData.firstRegistration },
      { label: "Modellår", value: vehicleData.modelYear },
      { label: "Neste EU-kontroll", value: vehicleData.nextEuControl }
    ];
    
    vehicleFields.forEach((field, index) => {
      const column = index % 3;
      const displayValue = field.value || "-";
      if (column === 0) {
        doc.text(`${field.label}: ${displayValue}`, col1X, col1Y);
        col1Y += 4.5;
      } else if (column === 1) {
        doc.text(`${field.label}: ${displayValue}`, col2X, col2Y);
        col2Y += 4.5;
      } else {
        doc.text(`${field.label}: ${displayValue}`, col3X, col3Y);
        col3Y += 4.5;
      }
    });
    
    yPos = Math.max(col1Y, col2Y, col3Y) + 3;
    
    doc.setFontSize(10);
    doc.setFont(undefined, 'bold');
    doc.text("Øvrige spesifikasjoner", cardMargin, yPos); 
    doc.setFont(undefined, 'normal');
    yPos += 5;
    
    // Three-column layout for Øvrige spesifikasjoner
    col1Y = yPos;
    col2Y = yPos;
    col3Y = yPos;
    
    const otherFields = [
      { label: "Karosseri", value: vehicleData.bodyType },
      { label: "Effekt", value: vehicleData.power },
      { label: "Batterikapasitet", value: vehicleData.batteryCapacity },
      { label: "Rekkevidde (WLTP)", value: vehicleData.range },
      { label: "Girkasse", value: vehicleData.transmission },
      { label: "Maks tilhengervekt", value: vehicleData.maxTrailerWeight },
      { label: "Hjuldrift", value: vehicleData.driveType },
      { label: "Vekt", value: vehicleData.weight },
      { label: "Seter", value: vehicleData.seats },
      { label: "Farge", value: vehicleData.color },
      { label: "Interiørfarge", value: vehicleData.interiorColor },
      { label: "Bilen står i", value: vehicleData.location },
      { label: "Avgiftsklasse", value: vehicleData.taxClass },
      { label: "Eiere", value: vehicleData.owners },
      { label: "Salgsform", value: vehicleData.saleType },
      { label: "Bagasjerom", value: vehicleData.trunkSize }
    ];
    
    otherFields.forEach((field, index) => {
      const column = index % 3;
      const displayValue = field.value || "-";
      if (column === 0) {
        doc.text(`${field.label}: ${displayValue}`, col1X, col1Y);
        col1Y += 4.5;
      } else if (column === 1) {
        doc.text(`${field.label}: ${displayValue}`, col2X, col2Y);
        col2Y += 4.5;
      } else {
        doc.text(`${field.label}: ${displayValue}`, col3X, col3Y);
        col3Y += 4.5;
      }
    });
    
    yPos = Math.max(col1Y, col2Y, col3Y) + 5;
    
    const vehicleCardHeight = yPos - vehicleCardStart;
    doc.rect(margin, vehicleCardStart, cardWidth, vehicleCardHeight, 'S');
    yPos += 7;
    
    // Equipment section with 3-column layout
    const selectedEquipment = Object.entries(equipment)
      .filter(([_, checked]) => checked)
      .map(([key, _]) => {
        const label = document.querySelector(`label[for="${key}"]`)?.textContent || key;
        return label;
      });
    
    yPos = checkNewPage(yPos, 30);
    const equipmentStart = yPos;
    yPos = addCardTitle("Utstyr - Selgers egenerklæring", yPos);
    
    doc.setFontSize(10);
    if (selectedEquipment.length > 0) {
      // Draw table with 3 columns
      const tableStartY = yPos;
      const colWidth = (cardWidth - 4) / 3;
      const rowHeight = 6;
      
      // Split equipment into rows of 3
      const rows: string[][] = [];
      for (let i = 0; i < selectedEquipment.length; i += 3) {
        rows.push([
          selectedEquipment[i] || '',
          selectedEquipment[i + 1] || '',
          selectedEquipment[i + 2] || ''
        ]);
      }
      
      // Draw table header
      doc.setFontSize(9);
      doc.setFont(undefined, 'bold');
      doc.setDrawColor(0, 0, 0);
      doc.setLineWidth(0.3);
      
      // Draw rows
      doc.setFont(undefined, 'normal');
      rows.forEach((row, rowIndex) => {
        const rowY = tableStartY + (rowIndex * rowHeight);
        
        // Check if we need a new page
        if (rowY + rowHeight > 270) {
          yPos = tableStartY + (rowIndex * rowHeight);
          const tempHeight = yPos - equipmentStart;
          doc.rect(margin, equipmentStart, cardWidth, tempHeight, 'S');
          
          doc.addPage();
          addHeader();
          yPos = 25;
          // Continue on next page - would need more complex logic
        }
        
        // Draw cells for each column
        row.forEach((item, colIndex) => {
          const cellX = margin + 2 + (colIndex * colWidth);
          const cellY = rowY;
          
          // Draw cell border
          doc.rect(cellX, cellY, colWidth, rowHeight);
          
          // Draw text in cell
          doc.text(item, cellX + 2, cellY + 4);
        });
      });
      
      yPos = tableStartY + (rows.length * rowHeight) + 5;
    } else {
      doc.text("Ingen utstyr valgt", cardMargin, yPos);
      yPos += 8;
    }
    
    const equipmentHeight = yPos - equipmentStart;
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.5);
    doc.rect(margin, equipmentStart, cardWidth, equipmentHeight, 'S');
    yPos += 7;
    
    // SELGERS ERKLÆRING
    yPos = checkNewPage(yPos, 30);
    const selgersStart = yPos;
    yPos = addCardTitle("Selgers egenerklæring", yPos);
    
    doc.setFontSize(10);
    doc.text(`Bilen er kjøpt: ${bilenKjopt === 'ny' ? 'Ny' : 'Brukt'}`, cardMargin, yPos); yPos += 5;
    doc.text(`Bilen har vært brukt som: ${bilenBrukt.charAt(0).toUpperCase() + bilenBrukt.slice(1)}`, cardMargin, yPos); yPos += 5;
    doc.text(`Vedlikehold er utført av: ${vedlikehold.charAt(0).toUpperCase() + vedlikehold.slice(1)}`, cardMargin, yPos); yPos += 5;
    doc.text(`Er offentlige avgifter betalt: ${avgifterBetalt === 'ja' ? 'Ja' : 'Nei'}`, cardMargin, yPos); yPos += 5;
    
    const alleServicer = (document.querySelector('input[name="allServicesFollowed"]:checked') as HTMLInputElement)?.value || 'ja';
    doc.text(`Er alle servicer fulgt: ${alleServicer === 'ja' ? 'Ja' : 'Nei'}`, cardMargin, yPos); yPos += 5;
    
    const sisteServiceDato = (document.getElementById('lastServiceDate') as HTMLInputElement)?.value || '-';
    doc.text(`Når ble siste service gjennomført: ${sisteServiceDato}`, cardMargin, yPos); yPos += 5;
    
    const bruktimportRadio = (document.querySelector('input[name="usedImport"]:checked') as HTMLInputElement)?.value || 'nei';
    doc.text(`Er bilen bruktimportert: ${bruktimportRadio === 'ja' ? 'Ja' : 'Nei'}`, cardMargin, yPos); yPos += 5;
    
    const kollisjonsputeRadio = (document.querySelector('input[name="airbagDisconnected"]:checked') as HTMLInputElement)?.value || 'nei';
    doc.text(`Har kollisjonspute vært utkoblet: ${kollisjonsputeRadio === 'ja' ? 'Ja' : 'Nei'}`, cardMargin, yPos); yPos += 5;
    
    const antirustgarantiRadio = (document.querySelector('input[name="antiRustWarranty"]:checked') as HTMLInputElement)?.value || 'nei';
    doc.text(`Følger Antirustgaranti fra produsent: ${antirustgarantiRadio === 'ja' ? 'Ja' : 'Nei'}`, cardMargin, yPos); yPos += 5;
    
    const serviceManual = (document.querySelector('input[name="serviceManual"]:checked') as HTMLInputElement)?.value || 'ja';
    doc.text(`Følger servicehefte med bilen: ${serviceManual === 'ja' ? 'Ja' : 'Nei'}`, cardMargin, yPos); yPos += 5;
    
    const chipTuned = (document.querySelector('input[name="chipTuned"]:checked') as HTMLInputElement)?.value || 'nei';
    doc.text(`Er bilen chiptunet: ${chipTuned === 'ja' ? 'Ja' : 'Nei'}`, cardMargin, yPos); yPos += 5;
    
    const componentsChanged = (document.querySelector('input[name="componentsChanged"]:checked') as HTMLInputElement)?.value || 'nei';
    doc.text(`Har noen av bilens komponenter blitt endret: ${componentsChanged === 'ja' ? 'Ja' : 'Nei'}`, cardMargin, yPos); yPos += 5;
    
    const mileageCorrect = (document.querySelector('input[name="mileageCorrect"]:checked') as HTMLInputElement)?.value || 'ja';
    doc.text(`Er bilens kilometerstand riktig: ${mileageCorrect === 'ja' ? 'Ja' : 'Nei'}`, cardMargin, yPos); yPos += 5;
    
    const acWorks = (document.querySelector('input[name="acWorks"]:checked') as HTMLInputElement)?.value || 'ja';
    doc.text(`Virker aircondition / kjøling som det skal: ${acWorks === 'ja' ? 'Ja' : 'Nei'}`, cardMargin, yPos); yPos += 5;
    
    const oilConsumption = (document.querySelector('input[name="oilConsumption"]:checked') as HTMLInputElement)?.value || 'ja';
    doc.text(`Er bilens oljeforbruk normalt: ${oilConsumption === 'ja' ? 'Ja' : 'Nei'}`, cardMargin, yPos); yPos += 5;
    
    const numberOfKeys = (document.getElementById('numberOfKeys') as HTMLInputElement)?.value || '-';
    doc.text(`Hvor mange nøkler følger med bilen: ${numberOfKeys} stk`, cardMargin, yPos); yPos += 5;
    
    const selgersHeight = yPos - selgersStart + 5;
    doc.rect(margin, selgersStart, cardWidth, selgersHeight, 'S');
    yPos += 7;
    
    // INTERVALLSTYRTE ARBEIDER
    yPos = checkNewPage(yPos, 35);
    const intervallStart = yPos;
    yPos = addCardTitle("Intervallstyrte arbeider", yPos);
    
    doc.setFontSize(10);
    doc.setFont(undefined, 'bold');
    doc.text("Arbeider", cardMargin, yPos);
    doc.text("Siste foretatt", cardMargin + 60, yPos);
    doc.text("Neste intervall/bytte", cardMargin + 120, yPos);
    doc.setFont(undefined, 'normal');
    yPos += 5;
    
    const arbeider = [
      { name: "Registerreim skifte", siste: registerreimSiste, neste: registerreimNeste },
      { name: "Service", siste: serviceSiste, neste: serviceNeste },
      { name: "Periodisk kjøretøykontroll (PKK / EU)", siste: pkkSiste, neste: pkkNeste }
    ];
    
    arbeider.forEach(arbeid => {
      doc.text(arbeid.name, cardMargin, yPos);
      doc.text(arbeid.siste || "-", cardMargin + 60, yPos);
      doc.text(arbeid.neste || "-", cardMargin + 120, yPos);
      yPos += 5;
    });
    
    const intervallHeight = yPos - intervallStart + 5;
    doc.rect(margin, intervallStart, cardWidth, intervallHeight, 'S');
    yPos += 7;
    
    // KARROSSERISKADER
    yPos = checkNewPage(yPos, 30);
    const damageStart = yPos;
    yPos = addCardTitle("Karrosseriskader", yPos);
    
    doc.setFontSize(10);
    doc.text(`Har bilen vært skadet / lakkert: ${harSkader === 'ja' ? 'Ja' : 'Nei'}`, cardMargin, yPos);
    yPos += 6;
    
    doc.setFont(undefined, 'bold');
    doc.text("Beskrivelse:", cardMargin, yPos);
    doc.setFont(undefined, 'normal');
    yPos += 5;
    if (damageDescription) {
      const lines = doc.splitTextToSize(damageDescription, cardWidth - 10);
      doc.text(lines, cardMargin, yPos);
      yPos += lines.length * 5;
    } else {
      doc.text("-", cardMargin, yPos);
      yPos += 5;
    }
    
    const damageHeight = yPos - damageStart + 5;
    doc.rect(margin, damageStart, cardWidth, damageHeight, 'S');
    yPos += 7;
    
    // Signature section
    yPos = checkNewPage(yPos, 35);
    const signatureStart = yPos;
    yPos = addCardTitle("Erklæring og signering", yPos);
    
    doc.setFontSize(10);
    const declarationText = doc.splitTextToSize(
      "Selger bekrefter med sin underskrift at Innkjøpsavtalens generelle betingelser nedenfor er lest, forstått og akseptert",
      cardWidth - 10
    );
    doc.text(declarationText, cardMargin, yPos);
    yPos += 10;
    
    doc.setFontSize(10);
    doc.text(`Dato: ${signatureDate}`, cardMargin, yPos);
    doc.text(`Sted: ${signaturePlace}`, cardMargin + 50, yPos);
    yPos += 15;
    
    doc.text("_________________________", cardMargin, yPos);
    yPos += 5;
    doc.setFontSize(10);
    doc.text("Selgers signatur", cardMargin, yPos);
    yPos += 2;
    
    const signatureHeight = yPos - signatureStart + 5;
    doc.rect(margin, signatureStart, cardWidth, signatureHeight, 'S');
    
    // Terms and Conditions - New Page
    doc.addPage();
    addHeader();
    yPos = 25;
    
    doc.setFontSize(16);
    doc.setFont(undefined, 'bold');
    doc.text("INNKJØPSAVTALE", pageWidth / 2, yPos, { align: "center" });
    yPos += 10;
    
    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    const introText = doc.splitTextToSize(
      "Selger og GANGÅS AUTO AS (\"Selskapet\") har i dag inngått følgende Innkjøpsavtale vedr kjøp og salg av overnevnte kjøretøy.",
      cardWidth
    );
    doc.text(introText, margin, yPos);
    yPos += 15;
    
    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    doc.text("GENERELLE BETINGELSER", margin, yPos);
    yPos += 8;
    
    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    
    const sections = [
      {
        title: "1. FORUTSETNINGER FOR KJØP",
        content: [
          "Selskapet kjøper kjøretøyet fra Selger under forutsetning av at:",
          "",
          "1.1 Feil og mangler",
          "Kjøretøyet er fritt for feil og mangler, med mindre annet er avtalt skriftlig og eksplisitt mellom partene.",
          "",
          "1.2 Tilstandskontroll og eventuelle reparasjoner",
          "Det utføres en tilstandskontroll av kjøretøyet (NAF Bruktbiltest, Viking Kontroll Total eller tilsvarende kontroll ved verksted godkjent av Selskapet) som ledd i å vurdere kjøretøyets tilstand i anledning denne Innkjøpsavtale. Selger kan få rabatterte priser på NAF-Bruktbiltest via Selskapet, men Selger må dekke kostnaden for selve kontrollen i forbindelse med at denne gjennomføres. Ved manglende betaling vil kostnaden uansett trekkes fra den endelige kjøpesummen som Selskapet kjøper kjøretøyet fra Selger for. Alternativt vil den legges til bruddgebyret ifm terminering av denne avtale.",
          "Eventuelle reparasjoner må utføres før utlevering til ny kunde og dekkes av Selger.",
          "",
          "1.3 Videresalg",
          "Kjøpet forutsetter videresalg med minimum 26.000 kr fortjeneste, som dekker kostnader og risiko knyttet til å overta reklamasjonsansvar for en brukt bil.",
          "",
          "1.4 Innlevering",
          "Bilen skal leveres til Selskapets utsalgssted med:",
          "• Vognkort del II, nøkler, komplette dekk/felger",
          "• Full tank og være ryddet og rengjort",
          "• Gyldig forsikring og EU-godkjenning",
          "",
          "1.4.1 Gebyrer",
          "Det påløper et standard gebyr på 500,- kr for løpende drivstoff, spylevæske osv. Det påløper et standard gebyr på 500,- kr per eventuelle dekkskift selskapet må utføre mens i påvente av videresalg. Gebyr(ene) trekkes fra den endelige kjøpesummen som Selskapet kjøper kjøretøyet for fra Selger som del av oppgjør til Selger. Alternativt legges de til bruddgebyret ifm terminering av denne avtale."
        ]
      },
      {
        title: "2. FORSIKRING, LAGRING OG KJØRING",
        content: [
          "2.1 Forsikring",
          "Selger står for forsikring frem til bilen er solgt. Må tillate prøvekjøring for alle med førerkort klasse B.",
          "",
          "2.2 Lagring",
          "Selskapet har ansvar for evt skader selskapet beviselig har påført bilen under oppbevaring. Evt rust som følge av at bilen står lagret ute i løpet av avtaleperioden dekkes ikke.",
          "",
          "2.3 Prøvekjøring",
          "Selger gir tillatelse til at kunder og ansatte kan prøve- og vedlikeholdskjøre kjøretøyet. Selger må varsle om eventuelle forsikringsbegrensninger."
        ]
      },
      {
        title: "3. SALG OG OPPGJØR",
        content: [
          "3.1 Videresalg",
          "Så snart Selskapet har solgt bilen til ny Kjøper, vil Selskapet tegne Innkjøpskontrakt med fastsatt kjøpesum med Selger.",
          "",
          "3.2 Oppgjør",
          "Oppgjør utbetales innen 5 virkedager etter mottatt betaling fra ny Kjøper, med forbehold om reklamasjoner.",
          "",
          "3.2.1 Heftelser",
          "Selskapet innløser panteheftelser. Selger må eventuelt dekke restgjeld. Mislighold gir grunnlag for å heve avtalen.",
          "",
          "3.3 Eiendomsrett",
          "Forblir hos Selger til fullt oppgjør er mottatt."
        ]
      },
      {
        title: "4. REKLAMASJONER",
        content: [
          "4.1 Videre ansvar",
          "Selskapet tar ansvar for reklamasjoner etter videresalg.",
          "",
          "4.2 Krav mot Selger",
          "To års reklamasjonsrett ved skjulte feil som var til stede ved avtaleinngåelse."
        ]
      },
      {
        title: "5. ENDRING OG OPPSIGELSE",
        content: [
          "Eventuelle endringer i denne avtale må være skriftlige. Avtalen kan for øvrig sies opp med én ukes varsel. Ved selgers oppsigelse må Selger betale et særskilt bruddgebyr på 1.900 kr for dekning av arbeid og kostnader gjort av Selskapet knyttet til vask, klargjøring, fotografering (foto & video), bildebehandling og annonsering av kjøretøyet."
        ]
      },
      {
        title: "6. MISLIGHOLD",
        content: [
          "Forsøk på å omgå avtalen medfører gebyr:",
          "• Før videresalg: 9.900 kr",
          "• Etter videresalg: Høyeste av 25.000 kr eller 15% av kjøretøyets salgsverdi"
        ]
      },
      {
        title: "7. TVISTER",
        content: [
          "Tvister løses etter kjøpsloven. Verneting er Selskapets forretningsadresse."
        ]
      }
    ];
    
    sections.forEach(section => {
      yPos = checkNewPage(yPos, 15);
      
      doc.setFont(undefined, 'bold');
      doc.text(section.title, margin, yPos);
      yPos += 6;
      
      doc.setFont(undefined, 'normal');
      section.content.forEach(line => {
        if (line === "") {
          yPos += 3;
        } else {
          yPos = checkNewPage(yPos, 10);
          const wrappedLines = doc.splitTextToSize(line, cardWidth);
          doc.text(wrappedLines, margin, yPos);
          yPos += wrappedLines.length * 5;
        }
      });
      
      yPos += 5;
    });
    
    // Add footers to all pages
    const totalPages = doc.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      addFooter(i, totalPages);
    }
    
    // Generate preview URL
    const pdfBlob = doc.output('blob');
    const url = URL.createObjectURL(pdfBlob);
    setPdfPreviewUrl(url);
    setShowPreview(true);
  };

  const generateMottakskontrollPdf = (car: any, checklist: typeof mottakskontrollChecklist): Blob => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 15;
    const cardMargin = margin + 2;
    const cardWidth = pageWidth - (2 * margin);
    let yPos = 20;
    
    // Helper function to add header
    const addHeader = () => {
      doc.setFontSize(10);
      doc.setFont(undefined, 'bold');
      doc.text("GANGÅS AUTO AS", margin, 10);
      doc.setFont(undefined, 'normal');
      doc.setFontSize(8);
      doc.text("Org.nr: 925 581 130", margin, 14);
      doc.text("Tlf: 402 82 502", margin + 40, 14);
      doc.text("E-post: post@gangasauto.no", margin + 70, 14);
      doc.setDrawColor(200, 200, 200);
      doc.setLineWidth(0.5);
      doc.line(margin, 16, pageWidth - margin, 16);
    };
    
    // Helper function to add footer
    const addFooter = (pageNum: number, totalPages: number) => {
      doc.setFontSize(8);
      doc.setTextColor(100, 100, 100);
      doc.text(`Side ${pageNum} av ${totalPages}`, pageWidth / 2, pageHeight - 10, { align: "center" });
      doc.text("www.gangasauto.no", pageWidth - margin, pageHeight - 10, { align: "right" });
      doc.setTextColor(0, 0, 0);
    };
    
    const addCardTitle = (title: string, y: number) => {
      doc.setFillColor(249, 250, 251);
      doc.rect(margin, y, cardWidth, 10, 'F');
      doc.setFontSize(12);
      doc.setFont(undefined, 'bold');
      doc.text(title, cardMargin, y + 7);
      doc.setFont(undefined, 'normal');
      return y + 12;
    };
    
    const checkNewPage = (currentY: number, spaceNeeded: number = 30) => {
      if (currentY + spaceNeeded > 270) {
        doc.addPage();
        addHeader();
        return 25;
      }
      return currentY;
    };
    
    addHeader();
    yPos = 25;
    
    // Title
    doc.setFontSize(18);
    doc.setFont(undefined, 'bold');
    doc.text("MOTTAKSKONTROLL", pageWidth / 2, yPos, { align: "center" });
    doc.setFont(undefined, 'normal');
    yPos += 5;
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`Utført: ${new Date().toLocaleDateString('nb-NO')}`, pageWidth / 2, yPos, { align: "center" });
    doc.setTextColor(0, 0, 0);
    yPos += 12;
    
    // Kjøretøy info
    const vehicleStart = yPos;
    yPos = addCardTitle("Kjøretøy", yPos);
    doc.setFontSize(10);
    doc.text(`Registreringsnummer: ${car.regNumber}`, cardMargin, yPos); yPos += 5;
    doc.text(`Merke: ${car.make}`, cardMargin, yPos); yPos += 5;
    doc.text(`Modell: ${car.model}`, cardMargin, yPos); yPos += 5;
    doc.text(`År: ${car.year || '-'}`, cardMargin, yPos); yPos += 5;
    doc.text(`Selger: ${car.seller || '-'}`, cardMargin, yPos); yPos += 5;
    const vehicleHeight = yPos - vehicleStart + 5;
    doc.rect(margin, vehicleStart, cardWidth, vehicleHeight, 'S');
    yPos += 7;
    
    // Bilens tilstand
    yPos = checkNewPage(yPos, 40);
    const tilstandStart = yPos;
    yPos = addCardTitle("Bilens tilstand", yPos);
    doc.setFontSize(10);
    doc.text(`Er bilen vasket og rengjort: ${checklist.erBilenVasket === 'ja' ? 'Ja' : 'Nei'}`, cardMargin, yPos); yPos += 5;
    doc.text(`Har bileier hatt hund: ${checklist.harHund === 'ja' ? 'Ja' : 'Nei'}`, cardMargin, yPos); yPos += 5;
    const tilstandHeight = yPos - tilstandStart + 5;
    doc.rect(margin, tilstandStart, cardWidth, tilstandHeight, 'S');
    yPos += 7;
    
    // Dokumenter og nøkler
    yPos = checkNewPage(yPos, 35);
    const dokumenterStart = yPos;
    yPos = addCardTitle("Dokumenter og nøkler", yPos);
    doc.setFontSize(10);
    doc.text(`Følger Vognkort del 1: ${checklist.vognkortDel1 === 'ja' ? 'Ja' : 'Nei'}`, cardMargin, yPos); yPos += 5;
    doc.text(`Antall nøkler: ${checklist.antallNokler || '-'} stk`, cardMargin, yPos); yPos += 5;
    const dokumenterHeight = yPos - dokumenterStart + 5;
    doc.rect(margin, dokumenterStart, cardWidth, dokumenterHeight, 'S');
    yPos += 7;
    
    // Dekk og felger
    yPos = checkNewPage(yPos, 35);
    const dekkStart = yPos;
    yPos = addCardTitle("Dekk og felger", yPos);
    doc.setFontSize(10);
    doc.text(`Følger komplette sommerdekk og felger: ${checklist.sommerdekkKomplett === 'ja' ? 'Ja' : 'Nei'}`, cardMargin, yPos); yPos += 5;
    doc.text(`Følger komplette vinterdekk og felger: ${checklist.vinterdekkKomplett === 'ja' ? 'Ja' : 'Nei'}`, cardMargin, yPos); yPos += 5;
    const dekkHeight = yPos - dekkStart + 5;
    doc.rect(margin, dekkStart, cardWidth, dekkHeight, 'S');
    yPos += 7;
    
    // Forsikring og EU
    yPos = checkNewPage(yPos, 35);
    const forsikringStart = yPos;
    yPos = addCardTitle("Forsikring og EU-godkjenning", yPos);
    doc.setFontSize(10);
    doc.text(`Har bilen gyldig forsikring: ${checklist.gyldigForsikring === 'ja' ? 'Ja' : 'Nei'}`, cardMargin, yPos); yPos += 5;
    doc.text(`Er bilen EU-godkjent: ${checklist.erEuGodkjent === 'ja' ? 'Ja' : 'Nei'}`, cardMargin, yPos); yPos += 5;
    const forsikringHeight = yPos - forsikringStart + 5;
    doc.rect(margin, forsikringStart, cardWidth, forsikringHeight, 'S');
    yPos += 7;
    
    // Drivstoff
    yPos = checkNewPage(yPos, 30);
    const drivstoffStart = yPos;
    yPos = addCardTitle("Drivstoff/Elektrisitet", yPos);
    doc.setFontSize(10);
    doc.text(`Drivstoffnivå: ${checklist.drivstoffniva || '-'}`, cardMargin, yPos); yPos += 5;
    const drivstoffHeight = yPos - drivstoffStart + 5;
    doc.rect(margin, drivstoffStart, cardWidth, drivstoffHeight, 'S');
    yPos += 7;
    
    // Økonomi
    yPos = checkNewPage(yPos, 50);
    const okStart = yPos;
    yPos = addCardTitle("Økonomi", yPos);
    doc.setFontSize(10);
    const tilstandskontrollKost = 1800;
    const fuelCost = checklist.drivstoffniva === '1/4' ? 750 : checklist.drivstoffniva === '1/2' ? 500 : checklist.drivstoffniva === '3/4' ? 250 : 0;
    const vaskCost = checklist.erBilenVasket === 'nei' ? 500 : 0;
    const hundCost = checklist.harHund === 'ja' ? 1000 : 0;
    const totalCost = tilstandskontrollKost + fuelCost + vaskCost + hundCost;
    
    doc.text(`Tilstandskontroll: 1 800 kr`, cardMargin, yPos); yPos += 5;
    if (fuelCost > 0) {
      doc.text(`Drivstoff (${checklist.drivstoffniva} tank): ${fuelCost} kr`, cardMargin, yPos); yPos += 5;
    }
    if (vaskCost > 0) {
      doc.text(`Ekstrabetaling for vask: ${vaskCost} kr`, cardMargin, yPos); yPos += 5;
    }
    if (hundCost > 0) {
      doc.text(`Fjerning av hundehår og lukt: ${hundCost} kr`, cardMargin, yPos); yPos += 5;
    }
    doc.setFont(undefined, 'bold');
    doc.text(`Totalt: ${totalCost.toLocaleString('no-NO')} kr ink mva`, cardMargin, yPos); yPos += 5;
    doc.setFont(undefined, 'normal');
    const okHeight = yPos - okStart + 5;
    doc.rect(margin, okStart, cardWidth, okHeight, 'S');
    yPos += 7;
    
    // Forhold som påvirker avtalen
    const hasForhold = parseInt(checklist.antallNokler) < 2 || checklist.sommerdekkKomplett === 'nei' || checklist.vinterdekkKomplett === 'nei';
    if (hasForhold) {
      yPos = checkNewPage(yPos, 70);
      const forholdStart = yPos;
      yPos = addCardTitle("Forhold som påvirker avtalegrunnlaget", yPos);
      doc.setFontSize(10);
      
      doc.text("Jeg aksepterer at følgende forhold må utbedres i forbindelse med salg av bilen:", cardMargin, yPos);
      yPos += 7;
      
      if (parseInt(checklist.antallNokler) < 2 && checklist.antallNokler !== '') {
        doc.text("• Nye nøkler må produseres opp på bileiers regning.", cardMargin, yPos); yPos += 5;
      }
      if (checklist.sommerdekkKomplett === 'nei') {
        doc.text("• Nye sommerdekk må kjøpes inn for bileiers regning.", cardMargin, yPos); yPos += 5;
      }
      if (checklist.vinterdekkKomplett === 'nei') {
        doc.text("• Nye vinterdekk må kjøpes inn for bileiers regning.", cardMargin, yPos); yPos += 5;
      }
      
      yPos += 3;
      const declarationText = doc.splitTextToSize(
        "Kostnaden dekkes av undertegnede i form av at det trekkes fra oppgjøret når bilen er solgt.",
        cardWidth - 10
      );
      doc.text(declarationText, cardMargin, yPos);
      yPos += declarationText.length * 5 + 5;
      
      doc.text(`Bileier: ${car.seller || '-'}`, cardMargin, yPos); yPos += 5;
      doc.text(`Dato: ${checklist.forholdSignatureDate || '-'}`, cardMargin, yPos); yPos += 10;
      
      // Add signature if exists
      if (checklist.forholdSignature) {
        try {
          doc.addImage(checklist.forholdSignature, 'PNG', cardMargin, yPos, 60, 20);
          yPos += 22;
        } catch (e) {
          doc.text("Signatur: [Se vedlagt]", cardMargin, yPos); yPos += 5;
        }
      }
      doc.text("_________________________", cardMargin, yPos); yPos += 4;
      doc.text("Bileiers signatur", cardMargin, yPos); yPos += 5;
      
      const forholdHeight = yPos - forholdStart + 5;
      doc.rect(margin, forholdStart, cardWidth, forholdHeight, 'S');
    }
    
    // Add footers
    const totalPages = doc.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      addFooter(i, totalPages);
    }
    
    return doc.output('blob');
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate Selgers egenerklæring required fields
    const missingFields: string[] = [];
    
    if (!selgersErklaering.lastServiceDate) {
      missingFields.push("Når ble siste service gjennomført");
    }
    
    if (!selgersErklaering.numberOfKeys || parseInt(selgersErklaering.numberOfKeys) < 1) {
      missingFields.push("Hvor mange nøkler følger med bilen");
    }
    
    if (missingFields.length > 0) {
      toast({
        title: "Manglende informasjon",
        description: `Vennligst fyll ut følgende felt i Selgers egenerklæring: ${missingFields.join(", ")}`,
        variant: "destructive",
      });
      return;
    }
    
    generatePdfPreview();
  };

  const handleEditAgreement = () => {
    setShowPreview(false);
    setShowActions(false);
    if (pdfPreviewUrl) {
      URL.revokeObjectURL(pdfPreviewUrl);
      setPdfPreviewUrl(null);
    }
  };

  // Generate agreement PDF for viewing from Mottakskontroll
  const generateAgreementPdfForMottakskontroll = (car: any, linkedLead: any): Blob => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 15;
    const cardMargin = margin + 2;
    const cardWidth = pageWidth - (2 * margin);
    let yPos = 20;
    
    // Helper function to add header
    const addHeader = () => {
      doc.setFontSize(10);
      doc.setFont(undefined, 'bold');
      doc.text("GANGÅS AUTO AS", margin, 10);
      doc.setFont(undefined, 'normal');
      doc.setFontSize(8);
      doc.text("Org.nr: 925 581 130", margin, 14);
      doc.text("Tlf: 402 82 502", margin + 40, 14);
      doc.text("E-post: post@gangasauto.no", margin + 70, 14);
      doc.setDrawColor(200, 200, 200);
      doc.setLineWidth(0.5);
      doc.line(margin, 16, pageWidth - margin, 16);
    };
    
    const addCardTitle = (title: string, y: number) => {
      doc.setFillColor(249, 250, 251);
      doc.rect(margin, y, cardWidth, 10, 'F');
      doc.setFontSize(12);
      doc.setFont(undefined, 'bold');
      doc.text(title, cardMargin, y + 7);
      doc.setFont(undefined, 'normal');
      return y + 12;
    };
    
    addHeader();
    yPos = 25;
    
    // Title
    doc.setFontSize(18);
    doc.setFont(undefined, 'bold');
    doc.text("INNKJØPSAVTALE", pageWidth / 2, yPos, { align: "center" });
    doc.setFont(undefined, 'normal');
    yPos += 15;
    
    // Selger Card
    const selgerStart = yPos;
    yPos = addCardTitle("Selger", yPos);
    doc.setFontSize(10);
    const sellerName = car.seller || linkedLead?.owner?.name || '-';
    const sellerAddress = linkedLead?.owner?.address || '-';
    const sellerPhone = linkedLead?.owner?.phone || '-';
    doc.text(`Navn: ${sellerName}`, cardMargin, yPos); yPos += 5;
    doc.text(`Adresse: ${sellerAddress}`, cardMargin, yPos); yPos += 5;
    doc.text(`Telefon: ${sellerPhone}`, cardMargin, yPos); yPos += 5;
    const selgerHeight = yPos - selgerStart + 5;
    doc.rect(margin, selgerStart, cardWidth, selgerHeight, 'S');
    yPos += 10;
    
    // Kjøretøy Card
    const vehicleStart = yPos;
    yPos = addCardTitle("Kjøretøy", yPos);
    doc.setFontSize(10);
    doc.text(`Registreringsnummer: ${car.regNumber}`, cardMargin, yPos); yPos += 5;
    doc.text(`Merke: ${car.make}`, cardMargin, yPos); yPos += 5;
    doc.text(`Modell: ${car.model}`, cardMargin, yPos); yPos += 5;
    if (car.year) {
      doc.text(`Årsmodell: ${car.year}`, cardMargin, yPos); yPos += 5;
    }
    if (linkedLead?.mileage) {
      doc.text(`Kilometerstand: ${linkedLead.mileage.toLocaleString('nb-NO')} km`, cardMargin, yPos); yPos += 5;
    }
    if (linkedLead?.fuel) {
      doc.text(`Drivstoff: ${linkedLead.fuel}`, cardMargin, yPos); yPos += 5;
    }
    if (linkedLead?.transmission) {
      doc.text(`Girkasse: ${linkedLead.transmission}`, cardMargin, yPos); yPos += 5;
    }
    const vehicleHeight = yPos - vehicleStart + 5;
    doc.rect(margin, vehicleStart, cardWidth, vehicleHeight, 'S');
    yPos += 10;
    
    // Avtaleinformasjon Card
    const avtaleStart = yPos;
    yPos = addCardTitle("Avtaleinformasjon", yPos);
    doc.setFontSize(10);
    doc.text(`Dato sendt til signering: ${car.sentDate}`, cardMargin, yPos); yPos += 5;
    doc.text(`Status: ${car.status}`, cardMargin, yPos); yPos += 5;
    if (linkedLead?.price) {
      doc.text(`Pris: ${linkedLead.price.toLocaleString('nb-NO')} NOK`, cardMargin, yPos); yPos += 5;
    }
    const avtaleHeight = yPos - avtaleStart + 5;
    doc.rect(margin, avtaleStart, cardWidth, avtaleHeight, 'S');
    
    // Footer
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.text("Side 1 av 1", pageWidth / 2, pageHeight - 10, { align: "center" });
    doc.text("www.gangasauto.no", pageWidth - margin, pageHeight - 10, { align: "right" });
    doc.setTextColor(0, 0, 0);
    
    return doc.output('blob');
  };

  // Vask/Foto media upload handlers
  const handleMediaUpload = async (carId: string, files: FileList, type: 'photo' | 'video') => {
    setUploadingMedia(carId);
    try {
      const car = mottakskontrollCars.find(c => c.id === carId);
      if (!car) return;

      const currentMedia = car.vaskFotoData || { photos: [], videos: [] };
      const uploadedUrls: string[] = [];

      for (const file of Array.from(files)) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${carId}/${type}s/${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('vask-foto-media')
          .upload(fileName, file);

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage
          .from('vask-foto-media')
          .getPublicUrl(fileName);

        uploadedUrls.push(urlData.publicUrl);
      }

      const updatedMedia = {
        ...currentMedia,
        [type === 'photo' ? 'photos' : 'videos']: [
          ...(type === 'photo' ? currentMedia.photos : currentMedia.videos),
          ...uploadedUrls
        ]
      };

      const { error: updateError } = await supabase
        .from('mottakskontroll')
        .update({ vask_foto_data: updatedMedia })
        .eq('id', carId);

      if (updateError) throw updateError;

      await fetchMottakskontroll();
      toast({
        title: "Lastet opp",
        description: `${uploadedUrls.length} ${type === 'photo' ? 'bilde(r)' : 'video(er)'} ble lastet opp`,
      });
    } catch (error: any) {
      console.error('Error uploading media:', error);
      toast({
        title: "Feil",
        description: "Kunne ikke laste opp filen",
        variant: "destructive",
      });
    } finally {
      setUploadingMedia(null);
    }
  };

  const handleDeleteMedia = async (carId: string, url: string, type: 'photo' | 'video') => {
    try {
      const car = mottakskontrollCars.find(c => c.id === carId);
      if (!car) return;

      // Extract file path from URL
      const urlParts = url.split('/vask-foto-media/');
      if (urlParts.length > 1) {
        const filePath = urlParts[1];
        await supabase.storage.from('vask-foto-media').remove([filePath]);
      }

      const currentMedia = car.vaskFotoData || { photos: [], videos: [] };
      const updatedMedia = {
        ...currentMedia,
        [type === 'photo' ? 'photos' : 'videos']: (type === 'photo' ? currentMedia.photos : currentMedia.videos).filter((u: string) => u !== url)
      };

      const { error } = await supabase
        .from('mottakskontroll')
        .update({ vask_foto_data: updatedMedia })
        .eq('id', carId);

      if (error) throw error;

      await fetchMottakskontroll();
      toast({
        title: "Slettet",
        description: `${type === 'photo' ? 'Bildet' : 'Videoen'} ble slettet`,
      });
    } catch (error: any) {
      console.error('Error deleting media:', error);
      toast({
        title: "Feil",
        description: "Kunne ikke slette filen",
        variant: "destructive",
      });
    }
  };

  const handleMarkVaskFotoComplete = async (carId: string) => {
    try {
      const { error } = await supabase
        .from('mottakskontroll')
        .update({ vask_foto_completed: true })
        .eq('id', carId);

      if (error) throw error;

      await fetchMottakskontroll();
      toast({
        title: "Fullført",
        description: "Vask/Foto er fullført for denne bilen",
      });
    } catch (error: any) {
      console.error('Error marking complete:', error);
      toast({
        title: "Feil",
        description: "Kunne ikke oppdatere status",
        variant: "destructive",
      });
    }
  };

  const handleSendToSeller = async () => {
    const sentDate = new Date().toLocaleDateString('nb-NO');
    
    try {
      // Generate the PDF blob from the current preview
      const pdfBlob = await fetch(pdfPreviewUrl!).then(res => res.blob());
      
      // Create a unique filename
      const fileName = `${vehicleData.regNumber}_${Date.now()}.pdf`;
      
      // Upload PDF to storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('agreement-pdfs')
        .upload(fileName, pdfBlob, {
          contentType: 'application/pdf',
          upsert: false
        });
      
      if (uploadError) {
        console.error('Error uploading PDF:', uploadError);
        throw uploadError;
      }
      
      // Get the public URL
      const { data: urlData } = supabase.storage
        .from('agreement-pdfs')
        .getPublicUrl(fileName);
      
      // Save to database with the PDF path
      const { data, error } = await supabase
        .from('mottakskontroll')
        .insert({
          registration_number: vehicleData.regNumber,
          make: vehicleData.brand,
          model: vehicleData.model,
          year: vehicleData.modelYear ? parseInt(vehicleData.modelYear) : null,
          seller_name: sellerData.name,
          sent_date: sentDate,
          status: 'Venter på mottakskontroll',
          agreement_pdf_path: fileName,
        })
        .select()
        .single();

      if (error) throw error;

      // Add to local state with the database ID
      const carForMottakskontroll = {
        id: data.id,
        regNumber: vehicleData.regNumber,
        make: vehicleData.brand,
        model: vehicleData.model,
        year: vehicleData.modelYear,
        seller: sellerData.name,
        sentDate: sentDate,
        status: 'Venter på mottakskontroll',
        agreementPdfPath: fileName,
      };
      setMottakskontrollCars(prev => [...prev, carForMottakskontroll]);
      
      toast({
        title: "Sendt!",
        description: "Avtalen er sendt til selger for signering og lagret",
      });
    } catch (error: any) {
      console.error('Error saving to mottakskontroll:', error);
      toast({
        title: "Feil",
        description: "Kunne ikke lagre avtalen til databasen",
        variant: "destructive",
      });
    }
    
    setShowPreview(false);
    setShowForm(false);
    if (pdfPreviewUrl) {
      URL.revokeObjectURL(pdfPreviewUrl);
      setPdfPreviewUrl(null);
    }
  };

  const handleDeleteAndCancel = () => {
    setShowActions(false);
    setShowForm(false);
    if (pdfPreviewUrl) {
      URL.revokeObjectURL(pdfPreviewUrl);
      setPdfPreviewUrl(null);
    }
    toast({
      title: "Avbrutt",
      description: "Innkjøpsavtalen er slettet",
    });
  };

  const handleCreateAgreementFromLead = (lead: typeof dummyCarLeads[0]) => {
    // Parse address to extract postal code and city
    const addressParts = lead.owner.address.split(", ");
    const postalParts = addressParts[1]?.split(" ") || [];
    const postalCode = postalParts[0] || "";
    const city = postalParts.slice(1).join(" ") || "";
    
    // Populate seller data
    setSellerData({
      name: lead.owner.name,
      personNr: "",
      phone: lead.owner.phone,
      address: addressParts[0] || "",
      postalCode: postalCode,
      city: city,
      email: "",
      account: "",
    });
    
    // Populate vehicle data from lead
    setVehicleData({
      brand: lead.make || "",
      model: lead.model || "",
      regNumber: lead.registrationNumber || "",
      mileage: lead.mileage?.toString() || "",
      equipment: lead.features?.join(", ") || "",
      reregistrationFee: (lead as any).specifications?.omregistrering || "",
      priceExclReregistration: (lead as any).specifications?.prisExclOmreg || "",
      yearlyTax: "",
      modelYear: (lead as any).specifications?.modellYear || lead.year?.toString() || "",
      bodyType: (lead as any).specifications?.karosseri || "",
      fuelType: lead.fuel || "",
      power: (lead as any).specifications?.effekt || "",
      batteryCapacity: "",
      range: "",
      transmission: lead.transmission || "",
      maxTrailerWeight: (lead as any).specifications?.maksimalTilhengervekt || "",
      driveType: (lead as any).specifications?.hjuldrift || "",
      weight: (lead as any).specifications?.vekt || "",
      seats: (lead as any).specifications?.seter || "",
      color: (lead as any).specifications?.farge || "",
      interiorColor: "",
      location: (lead as any).specifications?.bilenStarI || "",
      nextEuControl: (lead as any).specifications?.nesteEuKontroll || "",
      taxClass: (lead as any).specifications?.avgiftsklasse || "",
      chassisNumber: (lead as any).specifications?.chassisNr || "",
      firstRegistration: (lead as any).specifications?.forsteGangRegistrert || "",
      owners: "",
      saleType: (lead as any).specifications?.salgsform || "",
      trunkSize: (lead as any).specifications?.bagasjerom || "",
      price: lead.price?.toString() || "",
      slagvolum: (lead as any).specifications?.slagvolum || "",
      co2Utslipp: (lead as any).specifications?.co2Utslipp || "",
      dorer: (lead as any).specifications?.dorer || "",
      sistEuGodkjent: (lead as any).specifications?.sistEuGodkjent || "",
    });
    
    // Switch to Avtaleutvikling tab and show form
    setActiveTab("avtaleutvikling");
    setShowForm(true);
  };

  const handleDeleteLead = async (leadId: string) => {
    try {
      const { error } = await supabase
        .from('leads')
        .delete()
        .eq('id', leadId);

      if (error) throw error;

      setCreatedLeads(createdLeads.filter(lead => lead.id !== leadId));
      toast({
        title: "Slettet",
        description: "Lead er slettet",
      });
    } catch (error: any) {
      console.error('Error deleting lead:', error);
      toast({
        title: "Feil",
        description: "Kunne ikke slette lead",
        variant: "destructive",
      });
    }
  };

  const handleDeleteDummyLead = (leadId: string) => {
    // For dummy leads, we'd remove them from the array
    const index = dummyCarLeads.findIndex(lead => lead.id === leadId);
    if (index > -1) {
      dummyCarLeads.splice(index, 1);
      toast({
        title: "Slettet",
        description: "Lead er slettet",
      });
    }
  };

  const handleEditLead = (lead: any) => {
    // Set editing mode
    setEditingLeadId(lead.id);
    
    // Pre-fill the form with lead data
    setNewLeadData({
      registrationNumber: lead.registrationNumber || "",
      make: lead.make || "",
      model: lead.model || "",
      year: lead.year?.toString() || "",
      price: lead.price?.toString() || "",
      mileage: lead.mileage?.toString() || "",
      fuel: lead.fuel || "",
      transmission: lead.transmission || "",
      ownerName: lead.owner?.name || "",
      ownerAddress: lead.owner?.address || "",
      ownerPhone: lead.owner?.phone || "",
      finnUrl: (lead as any).finnUrl || "",
      features: lead.features?.join(', ') || "",
      reasons: lead.reasons?.join('\n') || "",
      // Specifications
      omregistrering: (lead as any).specifications?.omregistrering || "",
      prisExclOmreg: (lead as any).specifications?.prisExclOmreg || "",
      modellYear: (lead as any).specifications?.modellYear || "",
      karosseri: (lead as any).specifications?.karosseri || "",
      effekt: (lead as any).specifications?.effekt || "",
      slagvolum: (lead as any).specifications?.slagvolum || "",
      co2Utslipp: (lead as any).specifications?.co2Utslipp || "",
      maksimalTilhengervekt: (lead as any).specifications?.maksimalTilhengervekt || "",
      hjuldrift: (lead as any).specifications?.hjuldrift || "",
      vekt: (lead as any).specifications?.vekt || "",
      seter: (lead as any).specifications?.seter || "",
      dorer: (lead as any).specifications?.dorer || "",
      bagasjerom: (lead as any).specifications?.bagasjerom || "",
      farge: (lead as any).specifications?.farge || "",
      bilenStarI: (lead as any).specifications?.bilenStarI || "",
      sistEuGodkjent: (lead as any).specifications?.sistEuGodkjent || "",
      nesteEuKontroll: (lead as any).specifications?.nesteEuKontroll || "",
      avgiftsklasse: (lead as any).specifications?.avgiftsklasse || "",
      chassisNr: (lead as any).specifications?.chassisNr || "",
      forsteGangRegistrert: (lead as any).specifications?.forsteGangRegistrert || "",
      salgsform: (lead as any).specifications?.salgsform || "",
    });
    
    // Set the car image URL if it exists
    setCarImageUrl(lead.image || "");
    
    // Show the form
    setShowLeadForm(true);
    
    // Clear scanned fields indicator
    setScannedFields(new Set());
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Feil",
        description: "Vennligst last opp et bilde",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "Feil",
        description: "Bildet er for stort. Maksimal størrelse er 10MB",
        variant: "destructive",
      });
      return;
    }

    setIsScanningImage(true);
    try {
      // Convert image to base64
      const reader = new FileReader();
      reader.readAsDataURL(file);
      
      reader.onload = async () => {
        const imageBase64 = reader.result as string;
        
        const { data, error } = await supabase.functions.invoke('scan-car-image', {
          body: { imageBase64 }
        });

        if (error) throw error;

        if (data?.data) {
          const scannedData = data.data;
          
          // Handle both flat and nested data structures
          const basicInfo = scannedData.Kjøretøyopplysninger || scannedData;
          const specs = scannedData.Spesifikasjoner || scannedData;
          
          // Extract numeric values from strings like "45 000 kr" or "237 155 km"
          const extractNumber = (value: any): string => {
            if (!value) return '';
            const str = String(value);
            const numStr = str.replace(/[^\d]/g, '');
            return numStr || str;
          };
          
          // Track which fields were populated
          const populatedFields = new Set<string>();
          
          // Helper to track if field was populated
          const trackField = (fieldName: string, value: any) => {
            if (value) {
              populatedFields.add(fieldName);
            }
            return value;
          };
          
          // Update the new lead form with scanned data (both basic info and specifications)
          setNewLeadData(prev => ({
            ...prev,
            // Kjøretøyopplysninger (Basic Info)
            registrationNumber: trackField('registrationNumber', basicInfo.registrationNumber) || prev.registrationNumber,
            make: trackField('make', basicInfo.make) || prev.make,
            model: trackField('model', basicInfo.model) || prev.model,
            year: trackField('year', extractNumber(basicInfo.year)) || prev.year,
            price: trackField('price', extractNumber(basicInfo.price)) || prev.price,
            mileage: trackField('mileage', extractNumber(basicInfo.mileage)) || prev.mileage,
            fuel: trackField('fuel', basicInfo.fuel) || prev.fuel,
            transmission: trackField('transmission', basicInfo.transmission) || prev.transmission,
            // Spesifikasjoner
            omregistrering: trackField('omregistrering', specs.omregistrering) || prev.omregistrering,
            prisExclOmreg: trackField('prisExclOmreg', extractNumber(specs.prisExclOmreg)) || prev.prisExclOmreg,
            modellYear: trackField('modellYear', extractNumber(specs.modellYear)) || prev.modellYear,
            karosseri: trackField('karosseri', specs.karosseri) || prev.karosseri,
            effekt: trackField('effekt', specs.effekt) || prev.effekt,
            slagvolum: trackField('slagvolum', specs.slagvolum) || prev.slagvolum,
            co2Utslipp: trackField('co2Utslipp', specs.co2Utslipp) || prev.co2Utslipp,
            maksimalTilhengervekt: trackField('maksimalTilhengervekt', specs.maksimalTilhengervekt) || prev.maksimalTilhengervekt,
            hjuldrift: trackField('hjuldrift', specs.hjuldrift) || prev.hjuldrift,
            vekt: trackField('vekt', specs.vekt) || prev.vekt,
            seter: trackField('seter', extractNumber(specs.seter)) || prev.seter,
            dorer: trackField('dorer', extractNumber(specs.dorer)) || prev.dorer,
            bagasjerom: trackField('bagasjerom', specs.bagasjerom) || prev.bagasjerom,
            farge: trackField('farge', specs.farge) || prev.farge,
            bilenStarI: trackField('bilenStarI', specs.bilenStarI) || prev.bilenStarI,
            sistEuGodkjent: trackField('sistEuGodkjent', specs.sistEuGodkjent) || prev.sistEuGodkjent,
            nesteEuKontroll: trackField('nesteEuKontroll', specs.nesteEuKontroll) || prev.nesteEuKontroll,
            avgiftsklasse: trackField('avgiftsklasse', specs.avgiftsklasse) || prev.avgiftsklasse,
            chassisNr: trackField('chassisNr', specs.chassisNr) || prev.chassisNr,
            forsteGangRegistrert: trackField('forsteGangRegistrert', specs.forsteGangRegistrert) || prev.forsteGangRegistrert,
            salgsform: trackField('salgsform', specs.salgsform) || prev.salgsform,
          }));
          
          // Update scanned fields tracker
          setScannedFields(populatedFields);
          
          // Show the manual form with populated data
          setShowLeadForm(true);
          
          toast({
            title: "Suksess",
            description: `${populatedFields.size} felt ekstrahert fra bildet`,
          });
        }
      };
      
      reader.onerror = () => {
        throw new Error("Kunne ikke lese bildet");
      };
    } catch (error) {
      console.error("Image scan error:", error);
      toast({
        title: "Feil",
        description: "Kunne ikke skanne bildet",
        variant: "destructive",
      });
    } finally {
      setIsScanningImage(false);
    }
  };

  const handleCarImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast({
        title: "Ugyldig fil",
        description: "Vennligst last opp et bilde (JPG, PNG, etc.)",
        variant: "destructive",
      });
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    
    reader.onload = () => {
      setCarImageUrl(reader.result as string);
      toast({
        title: "Bilde lastet opp",
        description: "Bildet vil vises på lead-kortet",
      });
    };
  };

  const handleImportFromFinn = async () => {
    if (!finnImportUrl.trim()) {
      toast({
        title: "Feil",
        description: "Vennligst skriv inn en Finn.no URL",
        variant: "destructive",
      });
      return;
    }

    setIsImportingFromFinn(true);
    try {
      const { data, error } = await supabase.functions.invoke('fetch-finn-listing', {
        body: { url: finnImportUrl }
      });

      if (error) throw error;

      if (data?.data) {
        const importedData = data.data;
        
        // Create a new lead with the imported data and the Finn.no URL
        const newLead = {
          id: `finn-${Date.now()}`,
          image: "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=400", // Default image
          registrationNumber: importedData.chassisNumber || "",
          make: importedData.brand || "",
          model: importedData.model || "",
          year: parseInt(importedData.year) || new Date().getFullYear(),
          price: 0, // Would need to be extracted from page if available
          mileage: parseInt(importedData.mileage) || 0,
          fuel: importedData.fuel || "",
          transmission: importedData.transmission || "",
          daysOnMarket: 0,
          marketComparison: "",
          reasons: ["Importert fra Finn.no"],
          features: [],
          owner: {
            name: "",
            address: "",
            phone: ""
          },
          finnUrl: finnImportUrl
        };
        
        // Add the new lead to the beginning of the leads list
        dummyCarLeads.unshift(newLead);
        
        toast({
          title: "Suksess",
          description: "Lead opprettet fra Finn.no",
        });
        setFinnImportUrl("");
      }
    } catch (error) {
      console.error("Import error:", error);
      toast({
        title: "Feil",
        description: "Kunne ikke hente data fra Finn.no",
        variant: "destructive",
      });
    } finally {
      setIsImportingFromFinn(false);
    }
  };

  const handleCreateManualLead = async () => {
    if (!newLeadData.registrationNumber || !newLeadData.make || !newLeadData.model) {
      toast({
        title: "Feil",
        description: "Vennligst fyll ut alle påkrevde felt",
        variant: "destructive",
      });
      return;
    }

    const reasons = newLeadData.reasons ? newLeadData.reasons.split('\n').filter(r => r.trim()) : ["Manuelt opprettet lead"];
    const features = newLeadData.features ? newLeadData.features.split(',').map(f => f.trim()).filter(f => f) : [];

    const dbLead = {
      image_url: carImageUrl || null,
      registration_number: newLeadData.registrationNumber,
      make: newLeadData.make,
      model: newLeadData.model,
      year: parseInt(newLeadData.year) || null,
      price: parseInt(newLeadData.price) || null,
      mileage: parseInt(newLeadData.mileage) || null,
      fuel: newLeadData.fuel || null,
      transmission: newLeadData.transmission || null,
      owner_name: newLeadData.ownerName || null,
      owner_address: newLeadData.ownerAddress || null,
      owner_phone: newLeadData.ownerPhone || null,
      finn_url: newLeadData.finnUrl || null,
      features: features,
      reasons: reasons,
      omregistrering: newLeadData.omregistrering || null,
      pris_excl_omreg: newLeadData.prisExclOmreg || null,
      modell_year: newLeadData.modellYear || null,
      karosseri: newLeadData.karosseri || null,
      effekt: newLeadData.effekt || null,
      slagvolum: newLeadData.slagvolum || null,
      co2_utslipp: newLeadData.co2Utslipp || null,
      maksimal_tilhengervekt: newLeadData.maksimalTilhengervekt || null,
      hjuldrift: newLeadData.hjuldrift || null,
      vekt: newLeadData.vekt || null,
      seter: newLeadData.seter || null,
      dorer: newLeadData.dorer || null,
      bagasjerom: newLeadData.bagasjerom || null,
      farge: newLeadData.farge || null,
      bilen_star_i: newLeadData.bilenStarI || null,
      sist_eu_godkjent: newLeadData.sistEuGodkjent || null,
      neste_eu_kontroll: newLeadData.nesteEuKontroll || null,
      avgiftsklasse: newLeadData.avgiftsklasse || null,
      chassis_nr: newLeadData.chassisNr || null,
      forste_gang_registrert: newLeadData.forsteGangRegistrert || null,
      salgsform: newLeadData.salgsform || null,
    };

    try {
      if (editingLeadId) {
        // Update existing lead in database
        const { error } = await supabase
          .from('leads')
          .update(dbLead)
          .eq('id', editingLeadId);

        if (error) throw error;

        // Update local state
        const updatedLead = {
          id: editingLeadId,
          image: carImageUrl || "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=400",
          registrationNumber: newLeadData.registrationNumber,
          make: newLeadData.make,
          model: newLeadData.model,
          year: parseInt(newLeadData.year) || new Date().getFullYear(),
          price: parseInt(newLeadData.price) || 0,
          mileage: parseInt(newLeadData.mileage) || 0,
          fuel: newLeadData.fuel || "Ukjent",
          transmission: newLeadData.transmission || "Ukjent",
          daysOnMarket: 0,
          marketComparison: "Oppdatert",
          reasons: reasons,
          features: features,
          finnUrl: newLeadData.finnUrl || undefined,
          owner: {
            name: newLeadData.ownerName || "Ikke oppgitt",
            address: newLeadData.ownerAddress || "Ikke oppgitt",
            phone: newLeadData.ownerPhone || "Ikke oppgitt"
          },
          specifications: {
            omregistrering: newLeadData.omregistrering,
            prisExclOmreg: newLeadData.prisExclOmreg,
            modellYear: newLeadData.modellYear,
            karosseri: newLeadData.karosseri,
            effekt: newLeadData.effekt,
            slagvolum: newLeadData.slagvolum,
            co2Utslipp: newLeadData.co2Utslipp,
            maksimalTilhengervekt: newLeadData.maksimalTilhengervekt,
            hjuldrift: newLeadData.hjuldrift,
            vekt: newLeadData.vekt,
            seter: newLeadData.seter,
            dorer: newLeadData.dorer,
            bagasjerom: newLeadData.bagasjerom,
            farge: newLeadData.farge,
            bilenStarI: newLeadData.bilenStarI,
            sistEuGodkjent: newLeadData.sistEuGodkjent,
            nesteEuKontroll: newLeadData.nesteEuKontroll,
            avgiftsklasse: newLeadData.avgiftsklasse,
            chassisNr: newLeadData.chassisNr,
            forsteGangRegistrert: newLeadData.forsteGangRegistrert,
            salgsform: newLeadData.salgsform,
          }
        };

        setCreatedLeads(createdLeads.map(lead => 
          lead.id === editingLeadId ? updatedLead : lead
        ));

        toast({
          title: "Suksess",
          description: "Lead oppdatert",
        });

        setEditingLeadId(null);
      } else {
        // Create new lead in database
        const { data, error } = await supabase
          .from('leads')
          .insert(dbLead)
          .select()
          .single();

        if (error) throw error;

        // Transform and add to local state
        const newLead = {
          id: data.id,
          image: carImageUrl || "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=400",
          registrationNumber: newLeadData.registrationNumber,
          make: newLeadData.make,
          model: newLeadData.model,
          year: parseInt(newLeadData.year) || new Date().getFullYear(),
          price: parseInt(newLeadData.price) || 0,
          mileage: parseInt(newLeadData.mileage) || 0,
          fuel: newLeadData.fuel || "Ukjent",
          transmission: newLeadData.transmission || "Ukjent",
          daysOnMarket: 0,
          marketComparison: "Nylig lagt til",
          reasons: reasons,
          features: features,
          finnUrl: newLeadData.finnUrl || undefined,
          owner: {
            name: newLeadData.ownerName || "Ikke oppgitt",
            address: newLeadData.ownerAddress || "Ikke oppgitt",
            phone: newLeadData.ownerPhone || "Ikke oppgitt"
          },
          specifications: {
            omregistrering: newLeadData.omregistrering,
            prisExclOmreg: newLeadData.prisExclOmreg,
            modellYear: newLeadData.modellYear,
            karosseri: newLeadData.karosseri,
            effekt: newLeadData.effekt,
            slagvolum: newLeadData.slagvolum,
            co2Utslipp: newLeadData.co2Utslipp,
            maksimalTilhengervekt: newLeadData.maksimalTilhengervekt,
            hjuldrift: newLeadData.hjuldrift,
            vekt: newLeadData.vekt,
            seter: newLeadData.seter,
            dorer: newLeadData.dorer,
            bagasjerom: newLeadData.bagasjerom,
            farge: newLeadData.farge,
            bilenStarI: newLeadData.bilenStarI,
            sistEuGodkjent: newLeadData.sistEuGodkjent,
            nesteEuKontroll: newLeadData.nesteEuKontroll,
            avgiftsklasse: newLeadData.avgiftsklasse,
            chassisNr: newLeadData.chassisNr,
            forsteGangRegistrert: newLeadData.forsteGangRegistrert,
            salgsform: newLeadData.salgsform,
          }
        };

        setCreatedLeads([newLead, ...createdLeads]);

        toast({
          title: "Suksess",
          description: "Nytt lead opprettet og lagret",
        });
      }
    } catch (error: any) {
      console.error('Error saving lead:', error);
      toast({
        title: "Feil",
        description: "Kunne ikke lagre lead til databasen",
        variant: "destructive",
      });
      return;
    }

    // Reset form and scanned fields
    setNewLeadData({
      registrationNumber: "",
      make: "",
      model: "",
      year: "",
      price: "",
      mileage: "",
      fuel: "",
      transmission: "",
      ownerName: "",
      ownerAddress: "",
      ownerPhone: "",
      finnUrl: "",
      features: "",
      reasons: "",
      omregistrering: "",
      prisExclOmreg: "",
      modellYear: "",
      karosseri: "",
      effekt: "",
      slagvolum: "",
      co2Utslipp: "",
      maksimalTilhengervekt: "",
      hjuldrift: "",
      vekt: "",
      seter: "",
      dorer: "",
      bagasjerom: "",
      farge: "",
      bilenStarI: "",
      sistEuGodkjent: "",
      nesteEuKontroll: "",
      avgiftsklasse: "",
      chassisNr: "",
      forsteGangRegistrert: "",
      salgsform: "",
    });
    setScannedFields(new Set());
    setCarImageUrl("");
    setShowLeadForm(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Innkjøp av bil
          </h1>
          <p className="text-foreground/70 mb-6">
            Registrer detaljer for innkjøp av ny bil til lageret
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-6 mb-6">
            <TabsTrigger value="dagens-leads">Leads</TabsTrigger>
            <TabsTrigger value="avtaleutvikling">Avtaler</TabsTrigger>
            <TabsTrigger value="mottakskontroll">Mottakskontroll</TabsTrigger>
            <TabsTrigger value="vask-foto">Vask/Foto</TabsTrigger>
            <TabsTrigger value="annonsering">Annonsering</TabsTrigger>
            <TabsTrigger value="tilstandskontroll">Tilstandskontroll</TabsTrigger>
            <TabsTrigger value="mine-biler">Mine biler til salgs</TabsTrigger>
          </TabsList>

          <TabsContent value="dagens-leads" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Opprett lead</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => setShowLeadForm(!showLeadForm)}
                  >
                    {showLeadForm ? "Skjul skjema" : "Opprett Lead"}
                  </Button>
                  
                  {scannedFields.size > 0 && !showLeadForm && (
                    <div className="flex items-center justify-center gap-2 p-3 bg-green-50 rounded-md border border-green-200">
                      <Check className="h-4 w-4 text-green-600" />
                      <span className="text-sm text-green-700">
                        {scannedFields.size} felt ble fylt ut automatisk
                      </span>
                    </div>
                  )}

                  {showLeadForm && (
                    <div className="space-y-6 pt-4 border-t">
                      <div className="space-y-4">
                        <h4 className="font-semibold">Kjøretøyopplysninger</h4>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-4 border-b">
                          <div className="space-y-2">
                            <p className="text-sm text-muted-foreground">Last opp et bilde av bilen eller annonsen</p>
                            <div>
                              <input
                                type="file"
                                id="image-upload"
                                accept="image/*"
                                onChange={handleImageUpload}
                                disabled={isScanningImage}
                                className="hidden"
                              />
                              <label htmlFor="image-upload">
                                <Button
                                  type="button"
                                  className="bg-button-teal text-button-teal-foreground hover:bg-button-teal/90 cursor-pointer"
                                  disabled={isScanningImage}
                                  asChild
                                >
                                  <span className="flex items-center gap-2">
                                    <Upload className="h-4 w-4 text-white" />
                                    Velg fil
                                  </span>
                                </Button>
                              </label>
                            </div>
                            {isScanningImage && (
                              <div className="flex items-center justify-center p-4 bg-muted/50 rounded-md">
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                <span className="text-sm">Skanner bilde...</span>
                              </div>
                            )}
                          </div>
                          
                          <div className="space-y-2">
                            <p className="text-sm font-medium">Last opp bilde av bilen</p>
                            <div>
                              <input
                                type="file"
                                id="car-image-upload"
                                accept="image/*"
                                onChange={handleCarImageUpload}
                                className="hidden"
                              />
                              <label htmlFor="car-image-upload">
                                <Button
                                  type="button"
                                  variant="outline"
                                  className="cursor-pointer"
                                  asChild
                                >
                                  <span className="flex items-center gap-2">
                                    <Upload className="h-4 w-4" />
                                    Velg bilde
                                  </span>
                                </Button>
                              </label>
                            </div>
                            {carImageUrl && (
                              <div className="mt-2">
                                <img src={carImageUrl} alt="Forhåndsvisning" className="w-32 h-24 object-cover rounded-md" />
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="leadRegNumber">Registreringsnummer *</Label>
                          <ScannedInput
                            id="leadRegNumber"
                            placeholder="AB12345"
                            value={newLeadData.registrationNumber}
                            onChange={(e) => setNewLeadData({...newLeadData, registrationNumber: e.target.value})}
                            isScanned={scannedFields.has('registrationNumber')}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="leadMake">Merke *</Label>
                          <ScannedInput
                            id="leadMake"
                            placeholder="BMW"
                            value={newLeadData.make}
                            onChange={(e) => setNewLeadData({...newLeadData, make: e.target.value})}
                            isScanned={scannedFields.has('make')}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="leadModel">Modell *</Label>
                          <ScannedInput
                            id="leadModel"
                            placeholder="320d"
                            value={newLeadData.model}
                            onChange={(e) => setNewLeadData({...newLeadData, model: e.target.value})}
                            isScanned={scannedFields.has('model')}
                          />
                        </div>
                          <div className="space-y-2">
                            <Label htmlFor="leadYear">Årsmodell</Label>
                            <ScannedInput
                              id="leadYear"
                              type="number"
                              placeholder="2020"
                              value={newLeadData.year}
                              onChange={(e) => setNewLeadData({...newLeadData, year: e.target.value})}
                              isScanned={scannedFields.has('year')}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="leadPrice">Pris (kr)</Label>
                            <ScannedInput
                              id="leadPrice"
                              type="number"
                              placeholder="250000"
                              value={newLeadData.price}
                              onChange={(e) => setNewLeadData({...newLeadData, price: e.target.value})}
                              isScanned={scannedFields.has('price')}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="leadMileage">Kilometerstand</Label>
                            <ScannedInput
                              id="leadMileage"
                              type="number"
                              placeholder="100000"
                              value={newLeadData.mileage}
                              onChange={(e) => setNewLeadData({...newLeadData, mileage: e.target.value})}
                              isScanned={scannedFields.has('mileage')}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="leadFuel">Drivstoff</Label>
                            <ScannedInput
                              id="leadFuel"
                              placeholder="Diesel"
                              value={newLeadData.fuel}
                              onChange={(e) => setNewLeadData({...newLeadData, fuel: e.target.value})}
                              isScanned={scannedFields.has('fuel')}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="leadTransmission">Girkasse</Label>
                            <ScannedInput
                              id="leadTransmission"
                              placeholder="Automat"
                              value={newLeadData.transmission}
                              onChange={(e) => setNewLeadData({...newLeadData, transmission: e.target.value})}
                              isScanned={scannedFields.has('transmission')}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4 pt-4 border-t">
                        <h4 className="font-semibold">Spesifikasjoner</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="leadOmregistrering">Omregistrering</Label>
                            <ScannedInput
                              id="leadOmregistrering"
                              placeholder="Omregistrering"
                              value={newLeadData.omregistrering}
                              onChange={(e) => setNewLeadData({...newLeadData, omregistrering: e.target.value})}
                              isScanned={scannedFields.has('omregistrering')}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="leadPrisExclOmreg">Pris eksl. omreg.</Label>
                            <ScannedInput
                              id="leadPrisExclOmreg"
                              type="number"
                              placeholder="240000"
                              value={newLeadData.prisExclOmreg}
                              onChange={(e) => setNewLeadData({...newLeadData, prisExclOmreg: e.target.value})}
                              isScanned={scannedFields.has('prisExclOmreg')}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="leadModellYear">Modellår</Label>
                            <ScannedInput
                              id="leadModellYear"
                              type="number"
                              placeholder="2020"
                              value={newLeadData.modellYear}
                              onChange={(e) => setNewLeadData({...newLeadData, modellYear: e.target.value})}
                              isScanned={scannedFields.has('modellYear')}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="leadKarosseri">Karosseri</Label>
                            <ScannedInput
                              id="leadKarosseri"
                              placeholder="Sedan"
                              value={newLeadData.karosseri}
                              onChange={(e) => setNewLeadData({...newLeadData, karosseri: e.target.value})}
                              isScanned={scannedFields.has('karosseri')}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="leadEffekt">Effekt</Label>
                            <ScannedInput
                              id="leadEffekt"
                              placeholder="190 hk"
                              value={newLeadData.effekt}
                              onChange={(e) => setNewLeadData({...newLeadData, effekt: e.target.value})}
                              isScanned={scannedFields.has('effekt')}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="leadSlagvolum">Slagvolum</Label>
                            <ScannedInput
                              id="leadSlagvolum"
                              placeholder="2000 cm³"
                              value={newLeadData.slagvolum}
                              onChange={(e) => setNewLeadData({...newLeadData, slagvolum: e.target.value})}
                              isScanned={scannedFields.has('slagvolum')}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="leadCo2Utslipp">CO₂-utslipp</Label>
                            <ScannedInput
                              id="leadCo2Utslipp"
                              placeholder="120 g/km"
                              value={newLeadData.co2Utslipp}
                              onChange={(e) => setNewLeadData({...newLeadData, co2Utslipp: e.target.value})}
                              isScanned={scannedFields.has('co2Utslipp')}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="leadMaksimalTilhengervekt">Maksimal tilhengervekt</Label>
                            <ScannedInput
                              id="leadMaksimalTilhengervekt"
                              placeholder="2000 kg"
                              value={newLeadData.maksimalTilhengervekt}
                              onChange={(e) => setNewLeadData({...newLeadData, maksimalTilhengervekt: e.target.value})}
                              isScanned={scannedFields.has('maksimalTilhengervekt')}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="leadHjuldrift">Hjuldrift</Label>
                            <ScannedInput
                              id="leadHjuldrift"
                              placeholder="Forhjulsdrift"
                              value={newLeadData.hjuldrift}
                              onChange={(e) => setNewLeadData({...newLeadData, hjuldrift: e.target.value})}
                              isScanned={scannedFields.has('hjuldrift')}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="leadVekt">Vekt</Label>
                            <ScannedInput
                              id="leadVekt"
                              placeholder="1500 kg"
                              value={newLeadData.vekt}
                              onChange={(e) => setNewLeadData({...newLeadData, vekt: e.target.value})}
                              isScanned={scannedFields.has('vekt')}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="leadSeter">Seter</Label>
                            <ScannedInput
                              id="leadSeter"
                              type="number"
                              placeholder="5"
                              value={newLeadData.seter}
                              onChange={(e) => setNewLeadData({...newLeadData, seter: e.target.value})}
                              isScanned={scannedFields.has('seter')}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="leadDorer">Dører</Label>
                            <ScannedInput
                              id="leadDorer"
                              type="number"
                              placeholder="4"
                              value={newLeadData.dorer}
                              onChange={(e) => setNewLeadData({...newLeadData, dorer: e.target.value})}
                              isScanned={scannedFields.has('dorer')}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="leadBagasjerom">Størrelse på bagasjerom</Label>
                            <ScannedInput
                              id="leadBagasjerom"
                              placeholder="480 liter"
                              value={newLeadData.bagasjerom}
                              onChange={(e) => setNewLeadData({...newLeadData, bagasjerom: e.target.value})}
                              isScanned={scannedFields.has('bagasjerom')}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="leadFarge">Farge</Label>
                            <ScannedInput
                              id="leadFarge"
                              placeholder="Svart"
                              value={newLeadData.farge}
                              onChange={(e) => setNewLeadData({...newLeadData, farge: e.target.value})}
                              isScanned={scannedFields.has('farge')}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="leadBilenStarI">Bilen står i</Label>
                            <ScannedInput
                              id="leadBilenStarI"
                              placeholder="Oslo"
                              value={newLeadData.bilenStarI}
                              onChange={(e) => setNewLeadData({...newLeadData, bilenStarI: e.target.value})}
                              isScanned={scannedFields.has('bilenStarI')}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="leadSistEuGodkjent">Sist EU-godkjent</Label>
                            <ScannedInput
                              id="leadSistEuGodkjent"
                              type="date"
                              value={newLeadData.sistEuGodkjent}
                              onChange={(e) => setNewLeadData({...newLeadData, sistEuGodkjent: e.target.value})}
                              isScanned={scannedFields.has('sistEuGodkjent')}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="leadNesteEuKontroll">Neste frist for EU-kontroll</Label>
                            <ScannedInput
                              id="leadNesteEuKontroll"
                              type="date"
                              value={newLeadData.nesteEuKontroll}
                              onChange={(e) => setNewLeadData({...newLeadData, nesteEuKontroll: e.target.value})}
                              isScanned={scannedFields.has('nesteEuKontroll')}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="leadAvgiftsklasse">Avgiftsklasse</Label>
                            <ScannedInput
                              id="leadAvgiftsklasse"
                              placeholder="Avgiftsklasse"
                              value={newLeadData.avgiftsklasse}
                              onChange={(e) => setNewLeadData({...newLeadData, avgiftsklasse: e.target.value})}
                              isScanned={scannedFields.has('avgiftsklasse')}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="leadChassisNr">Chassis nr. (VIN)</Label>
                            <ScannedInput
                              id="leadChassisNr"
                              placeholder="VIN"
                              value={newLeadData.chassisNr}
                              onChange={(e) => setNewLeadData({...newLeadData, chassisNr: e.target.value})}
                              isScanned={scannedFields.has('chassisNr')}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="leadForsteGangRegistrert">1. gang registrert</Label>
                            <ScannedInput
                              id="leadForsteGangRegistrert"
                              type="date"
                              value={newLeadData.forsteGangRegistrert}
                              onChange={(e) => setNewLeadData({...newLeadData, forsteGangRegistrert: e.target.value})}
                              isScanned={scannedFields.has('forsteGangRegistrert')}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="leadSalgsform">Salgsform</Label>
                            <ScannedInput
                              id="leadSalgsform"
                              placeholder="Privat salg"
                              value={newLeadData.salgsform}
                              onChange={(e) => setNewLeadData({...newLeadData, salgsform: e.target.value})}
                              isScanned={scannedFields.has('salgsform')}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4 pt-4 border-t">
                        <h4 className="font-semibold">Eierinformasjon</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="leadOwnerName">Navn</Label>
                            <Input
                              id="leadOwnerName"
                              placeholder="Fullt navn"
                              value={newLeadData.ownerName}
                              onChange={(e) => setNewLeadData({...newLeadData, ownerName: e.target.value})}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="leadOwnerPhone">Telefon</Label>
                            <Input
                              id="leadOwnerPhone"
                              placeholder="123 45 678"
                              value={newLeadData.ownerPhone}
                              onChange={(e) => setNewLeadData({...newLeadData, ownerPhone: e.target.value})}
                            />
                          </div>
                          <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="leadOwnerAddress">Adresse</Label>
                            <Input
                              id="leadOwnerAddress"
                              placeholder="Gateadresse, postnummer og sted"
                              value={newLeadData.ownerAddress}
                              onChange={(e) => setNewLeadData({...newLeadData, ownerAddress: e.target.value})}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="leadFinnUrl">URL til finn-annonse</Label>
                        <Input
                          id="leadFinnUrl"
                          placeholder="https://www.finn.no/..."
                          value={newLeadData.finnUrl}
                          onChange={(e) => setNewLeadData({...newLeadData, finnUrl: e.target.value})}
                        />
                      </div>

                      {/* Image upload for equipment extraction */}
                      <div className="space-y-2 p-4 border border-border rounded-md bg-muted/30">
                        <Label htmlFor="leadEquipmentImage">Last opp bilde av utstyrsliste</Label>
                        <div className="flex items-center gap-2">
                          <Input
                            id="leadEquipmentImage"
                            type="file"
                            accept="image/*"
                            onChange={handleEquipmentImageUpload}
                            disabled={isAnalyzingEquipment}
                            className="flex-1"
                          />
                          {isAnalyzingEquipment && (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {isAnalyzingEquipment 
                            ? "Analyserer bildet..." 
                            : "Last opp et bilde av utstyrslisten. AI vil automatisk ekstrahere utstyr fra bildet."}
                        </p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="leadFeatures">Utstyr (kommaseparert)</Label>
                        <Textarea
                          id="leadFeatures"
                          placeholder="Navigasjon, Skinninteriør, Panoramatak"
                          value={newLeadData.features}
                          onChange={(e) => setNewLeadData({...newLeadData, features: e.target.value})}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="leadReasons">Hvorfor er dette et godt lead? (kommaseparert)</Label>
                        <Textarea
                          id="leadReasons"
                          placeholder="Lav pris, Lang tid på markedet, Høyt utstyrsnivå"
                          value={newLeadData.reasons}
                          onChange={(e) => setNewLeadData({...newLeadData, reasons: e.target.value})}
                        />
                      </div>

                       <div className="flex gap-2 pt-4">
                        <Button onClick={handleCreateManualLead} className="flex-1">
                          {editingLeadId ? "Oppdater lead" : "Opprett lead"}
                        </Button>
                        <Button 
                          variant="outline" 
                          onClick={() => {
                            setShowLeadForm(false);
                            setEditingLeadId(null);
                          }}
                        >
                          Avbryt
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <div className="space-y-4">
              {createdLeads.map((lead) => (
                <CarLeadCard 
                  key={lead.id} 
                  lead={lead} 
                  onCreateAgreement={handleCreateAgreementFromLead}
                  onDelete={handleDeleteLead}
                  onEdit={handleEditLead}
                />
              ))}
              {dummyCarLeads.map((lead) => (
                <CarLeadCard 
                  key={lead.id} 
                  lead={lead} 
                  onCreateAgreement={handleCreateAgreementFromLead}
                  onDelete={handleDeleteDummyLead}
                  onEdit={handleEditLead}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="avtaleutvikling" className="space-y-6">
            <div className="flex gap-4 mb-6">
              <Button 
                variant={agreementType === "innkjopsavtale" ? "default" : "secondary"}
                className="flex-1 h-12 text-base"
                onClick={() => setAgreementType("innkjopsavtale")}
                type="button"
              >
                Lag innkjøpsavtale
              </Button>
              <Button 
                variant={agreementType === "formidlingsavtale" ? "default" : "secondary"}
                className="flex-1 h-12 text-base"
                onClick={() => setAgreementType("formidlingsavtale")}
                type="button"
              >
                Lag Formidlingsavtale
              </Button>
            </div>

            {agreementType === "innkjopsavtale" && (
            <form className="space-y-6" onSubmit={handleFormSubmit}>
            {/* SELGER */}
            <Card>
              <CardHeader>
                <CardTitle>Selger</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="sellerName">Navn</Label>
                    <Input 
                      id="sellerName" 
                      placeholder="Fullt navn" 
                      value={sellerData.name}
                      onChange={(e) => setSellerData({...sellerData, name: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sellerPersonNr">Person/org.nr</Label>
                    <Input 
                      id="sellerPersonNr" 
                      placeholder="11 siffer"
                      value={sellerData.personNr}
                      onChange={(e) => setSellerData({...sellerData, personNr: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sellerPhone">Telefon</Label>
                    <Input 
                      id="sellerPhone" 
                      placeholder="Telefonnummer"
                      value={sellerData.phone}
                      onChange={(e) => setSellerData({...sellerData, phone: e.target.value})}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="sellerAddress">Adresse</Label>
                    <Input 
                      id="sellerAddress" 
                      placeholder="Gateadresse"
                      value={sellerData.address}
                      onChange={(e) => setSellerData({...sellerData, address: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sellerPostNr">Postnr.</Label>
                    <Input 
                      id="sellerPostNr" 
                      placeholder="0000"
                      value={sellerData.postalCode}
                      onChange={(e) => setSellerData({...sellerData, postalCode: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sellerPoststed">Poststed</Label>
                    <Input 
                      id="sellerPoststed" 
                      placeholder="By"
                      value={sellerData.city}
                      onChange={(e) => setSellerData({...sellerData, city: e.target.value})}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="sellerEmail">E-postadresse</Label>
                    <Input 
                      id="sellerEmail" 
                      type="email" 
                      placeholder="epost@eksempel.no"
                      value={sellerData.email}
                      onChange={(e) => setSellerData({...sellerData, email: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sellerAccount">Kontonummer</Label>
                    <Input 
                      id="sellerAccount" 
                      placeholder="0000.00.00000"
                      value={sellerData.account}
                      onChange={(e) => setSellerData({...sellerData, account: e.target.value})}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* KJØPER */}
            <Card>
              <CardHeader>
                <CardTitle>Kjøper</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2 mb-4">
                  <Button
                    type="button"
                    size="sm"
                    variant="default"
                    onClick={() => setBuyerData({
                      name: "RABB AUTO AS",
                      orgNumber: "932 402 149",
                      phone: "48991792",
                      address: "Stolvstadlia 7B",
                      postalCode: "2360",
                      city: "Rudshøgda",
                      email: "post@rabbauto.no"
                    })}
                  >
                    RABB AUTO
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="default"
                    onClick={() => setBuyerData({
                      name: "HUB AUTO AS",
                      orgNumber: "934 088 824",
                      phone: "40313258",
                      address: "Lønningsvegen 2",
                      postalCode: "5258",
                      city: "Blomsterdalen",
                      email: "post@hubauto.no"
                    })}
                  >
                    HUB AUTO
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="default"
                    onClick={() => setBuyerData({
                      name: "GANGÅS AUTO AS",
                      orgNumber: "924 991 232",
                      phone: "48409702",
                      address: "Wergelandsvegen 23E",
                      postalCode: "7504",
                      city: "Stjørdal",
                      email: "post@gangasauto.no"
                    })}
                  >
                    GANGÅS AUTO
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="buyerName">Navn</Label>
                    <Input 
                      id="buyerName" 
                      value={buyerData.name}
                      onChange={(e) => setBuyerData({...buyerData, name: e.target.value})}
                      placeholder="Fullt navn"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="buyerOrgNumber">Org.nummer</Label>
                    <Input 
                      id="buyerOrgNumber" 
                      value={buyerData.orgNumber}
                      onChange={(e) => setBuyerData({...buyerData, orgNumber: e.target.value})}
                      placeholder="Organisasjonsnummer"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="buyerPhone">Telefon</Label>
                    <Input 
                      id="buyerPhone" 
                      value={buyerData.phone}
                      onChange={(e) => setBuyerData({...buyerData, phone: e.target.value})}
                      placeholder="Telefonnummer"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="buyerAddress">Adresse</Label>
                    <Input 
                      id="buyerAddress" 
                      value={buyerData.address}
                      onChange={(e) => setBuyerData({...buyerData, address: e.target.value})}
                      placeholder="Gateadresse"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="buyerPostalCode">Postnr</Label>
                    <Input 
                      id="buyerPostalCode" 
                      value={buyerData.postalCode}
                      onChange={(e) => setBuyerData({...buyerData, postalCode: e.target.value})}
                      placeholder="Postnummer"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="buyerCity">Poststed</Label>
                    <Input 
                      id="buyerCity" 
                      value={buyerData.city}
                      onChange={(e) => setBuyerData({...buyerData, city: e.target.value})}
                      placeholder="Poststed"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="buyerEmail">Epost-adresse</Label>
                    <Input 
                      id="buyerEmail" 
                      type="email"
                      value={buyerData.email}
                      onChange={(e) => setBuyerData({...buyerData, email: e.target.value})}
                      placeholder="E-postadresse"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* ØKONOMI */}
            <Card>
              <CardHeader>
                <CardTitle>Økonomi</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="purchasePrice">
                      Avtalt oppgjørspris som Selger skal få utbetalt på konto,<br />
                      når og hvis Kjøper har solgt kjøretøyet videre for fullpris.
                    </Label>
                    <Input id="purchasePrice" type="number" placeholder="250000" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="grossProfit">
                      Avtalt bruttofortjeneste som Kjøper skal sitte igjen med<br />
                      etter først å ha solgt kjøretøyet videre til ny kunde
                    </Label>
                    <Input id="grossProfit" type="number" placeholder="26000" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Årsavgift betalt</Label>
                    <RadioGroup defaultValue="ja" name="arsavgift">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="ja" id="arsavgift-ja" />
                        <Label htmlFor="arsavgift-ja" className="font-normal">Ja</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="nei" id="arsavgift-nei" />
                        <Label htmlFor="arsavgift-nei" className="font-normal">Nei</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="space-y-2">
                    <Label>Pant / gjeld</Label>
                    <RadioGroup defaultValue="nei" name="pant">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="ja" id="pant-ja" />
                        <Label htmlFor="pant-ja" className="font-normal">Ja</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="nei" id="pant-nei" />
                        <Label htmlFor="pant-nei" className="font-normal">Nei</Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* KJØRETØY */}
            <Card>
              <CardHeader>
                <CardTitle>Kjøretøy</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Method Selection */}
                <div className="space-y-3 pb-4 border-b">
                  <Label>Hent kjøretøydata</Label>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant={uploadMethod === "pdf" ? "default" : "outline"}
                      onClick={() => setUploadMethod("pdf")}
                      className="flex-1"
                    >
                      <Upload className="mr-2 h-4 w-4" />
                      Last opp PDF
                    </Button>
                    <Button
                      type="button"
                      variant={uploadMethod === "url" ? "default" : "outline"}
                      onClick={() => setUploadMethod("url")}
                      className="flex-1"
                    >
                      finn.no URL
                    </Button>
                  </div>

                  {uploadMethod === "pdf" ? (
                    <div className="space-y-2">
                      <Label htmlFor="pdfUpload">Last opp PDF fra finn.no</Label>
                      <Input
                        id="pdfUpload"
                        type="file"
                        accept="application/pdf"
                        onChange={handleFileUpload}
                        disabled={isLoading}
                      />
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Label htmlFor="finnUrl">Hent data fra finn.no</Label>
                      <div className="flex gap-2">
                        <Input 
                          id="finnUrl"
                          type="url"
                          value={finnUrl}
                          onChange={(e) => setFinnUrl(e.target.value)}
                          placeholder="https://www.finn.no/mobility/item/..." 
                          className="flex-1"
                        />
                        <Button 
                          type="button"
                          onClick={fetchFinnData}
                          disabled={isLoading}
                          className="whitespace-nowrap"
                        >
                          {isLoading ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Henter...
                            </>
                          ) : (
                            'Hent data'
                          )}
                        </Button>
                      </div>
                    </div>
                  )}
                  
                  {isLoading && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Behandler data...</span>
                    </div>
                  )}
                </div>

                <h3 className="font-semibold mb-3" style={{ fontSize: '1.0rem' }}>Kjøretøybeskrivelse</h3>

                {/* Basic vehicle information matching lead form */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 p-4 border border-border rounded-md bg-background">
                  <div className="space-y-2">
                    <Label htmlFor="agreementRegNumber">Registreringsnummer *</Label>
                    <Input 
                      id="agreementRegNumber" 
                      placeholder="EH51824"
                      value={vehicleData.regNumber}
                      onChange={(e) => setVehicleData({...vehicleData, regNumber: e.target.value})}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="agreementBrand">Merke *</Label>
                    <Input 
                      id="agreementBrand" 
                      placeholder="f.eks. Tesla"
                      value={vehicleData.brand}
                      onChange={(e) => setVehicleData({...vehicleData, brand: e.target.value})}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="agreementModel">Modell *</Label>
                    <Input 
                      id="agreementModel" 
                      placeholder="f.eks. Model 3"
                      value={vehicleData.model}
                      onChange={(e) => setVehicleData({...vehicleData, model: e.target.value})}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="agreementModelYear">Årsmodell</Label>
                    <Input 
                      id="agreementModelYear" 
                      placeholder="2024"
                      value={vehicleData.modelYear}
                      onChange={(e) => setVehicleData({...vehicleData, modelYear: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="agreementPrice">Pris (kr)</Label>
                    <Input 
                      id="agreementPrice" 
                      type="number"
                      placeholder="250000"
                      value={vehicleData.price || ''}
                      onChange={(e) => setVehicleData({...vehicleData, price: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="agreementMileage">Kilometerstand</Label>
                    <Input 
                      id="agreementMileage" 
                      placeholder="44 500 km"
                      value={vehicleData.mileage}
                      onChange={(e) => setVehicleData({...vehicleData, mileage: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="agreementFuelType">Drivstoff</Label>
                    <Input 
                      id="agreementFuelType" 
                      placeholder="El"
                      value={vehicleData.fuelType}
                      onChange={(e) => setVehicleData({...vehicleData, fuelType: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="agreementTransmission">Girkasse</Label>
                    <Input 
                      id="agreementTransmission" 
                      placeholder="Automat"
                      value={vehicleData.transmission}
                      onChange={(e) => setVehicleData({...vehicleData, transmission: e.target.value})}
                    />
                  </div>
                </div>

                {/* Spesifikasjoner */}
                <div className="pt-6">
                  <h3 className="font-semibold text-foreground mb-4" style={{ fontSize: '1.0rem' }}>Spesifikasjoner</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="agreementOmregistrering">Omregistrering</Label>
                      <Input 
                        id="agreementOmregistrering" 
                        placeholder="Omregistrering"
                        value={vehicleData.reregistrationFee}
                        onChange={(e) => setVehicleData({...vehicleData, reregistrationFee: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="agreementPrisExclOmreg">Pris eksl. omreg.</Label>
                      <Input 
                        id="agreementPrisExclOmreg" 
                        type="number"
                        placeholder="240000"
                        value={vehicleData.priceExclReregistration}
                        onChange={(e) => setVehicleData({...vehicleData, priceExclReregistration: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="agreementModellYear">Modellår</Label>
                      <Input 
                        id="agreementModellYear" 
                        type="number"
                        placeholder="2020"
                        value={vehicleData.modelYear}
                        onChange={(e) => setVehicleData({...vehicleData, modelYear: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="agreementKarosseri">Karosseri</Label>
                      <Input 
                        id="agreementKarosseri" 
                        placeholder="Sedan"
                        value={vehicleData.bodyType}
                        onChange={(e) => setVehicleData({...vehicleData, bodyType: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="agreementEffekt">Effekt</Label>
                      <Input 
                        id="agreementEffekt" 
                        placeholder="190 hk"
                        value={vehicleData.power}
                        onChange={(e) => setVehicleData({...vehicleData, power: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="agreementSlagvolum">Slagvolum</Label>
                      <Input 
                        id="agreementSlagvolum" 
                        placeholder="2000 cm³"
                        value={vehicleData.slagvolum}
                        onChange={(e) => setVehicleData({...vehicleData, slagvolum: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="agreementCo2Utslipp">CO₂-utslipp</Label>
                      <Input 
                        id="agreementCo2Utslipp" 
                        placeholder="120 g/km"
                        value={vehicleData.co2Utslipp}
                        onChange={(e) => setVehicleData({...vehicleData, co2Utslipp: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="agreementMaksimalTilhengervekt">Maksimal tilhengervekt</Label>
                      <Input 
                        id="agreementMaksimalTilhengervekt" 
                        placeholder="2000 kg"
                        value={vehicleData.maxTrailerWeight}
                        onChange={(e) => setVehicleData({...vehicleData, maxTrailerWeight: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="agreementHjuldrift">Hjuldrift</Label>
                      <Input 
                        id="agreementHjuldrift" 
                        placeholder="Forhjulsdrift"
                        value={vehicleData.driveType}
                        onChange={(e) => setVehicleData({...vehicleData, driveType: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="agreementVekt">Vekt</Label>
                      <Input 
                        id="agreementVekt" 
                        placeholder="1500 kg"
                        value={vehicleData.weight}
                        onChange={(e) => setVehicleData({...vehicleData, weight: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="agreementSeter">Seter</Label>
                      <Input 
                        id="agreementSeter" 
                        type="number"
                        placeholder="5"
                        value={vehicleData.seats}
                        onChange={(e) => setVehicleData({...vehicleData, seats: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="agreementDorer">Dører</Label>
                      <Input 
                        id="agreementDorer" 
                        type="number"
                        placeholder="4"
                        value={vehicleData.dorer}
                        onChange={(e) => setVehicleData({...vehicleData, dorer: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="agreementBagasjerom">Størrelse på bagasjerom</Label>
                      <Input 
                        id="agreementBagasjerom" 
                        placeholder="480 liter"
                        value={vehicleData.trunkSize}
                        onChange={(e) => setVehicleData({...vehicleData, trunkSize: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="agreementFarge">Farge</Label>
                      <Input 
                        id="agreementFarge" 
                        placeholder="Svart"
                        value={vehicleData.color}
                        onChange={(e) => setVehicleData({...vehicleData, color: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="agreementBilenStarI">Bilen står i</Label>
                      <Input 
                        id="agreementBilenStarI" 
                        placeholder="Oslo"
                        value={vehicleData.location}
                        onChange={(e) => setVehicleData({...vehicleData, location: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="agreementSistEuGodkjent">Sist EU-godkjent</Label>
                      <Input 
                        id="agreementSistEuGodkjent" 
                        type="date"
                        value={vehicleData.sistEuGodkjent}
                        onChange={(e) => setVehicleData({...vehicleData, sistEuGodkjent: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="agreementNesteEuKontroll">Neste frist for EU-kontroll</Label>
                      <Input 
                        id="agreementNesteEuKontroll" 
                        type="date"
                        value={vehicleData.nextEuControl}
                        onChange={(e) => setVehicleData({...vehicleData, nextEuControl: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="agreementAvgiftsklasse">Avgiftsklasse</Label>
                      <Input 
                        id="agreementAvgiftsklasse" 
                        placeholder="Avgiftsklasse"
                        value={vehicleData.taxClass}
                        onChange={(e) => setVehicleData({...vehicleData, taxClass: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="agreementChassisNr">Chassis nr. (VIN)</Label>
                      <Input 
                        id="agreementChassisNr" 
                        placeholder="VIN"
                        value={vehicleData.chassisNumber}
                        onChange={(e) => setVehicleData({...vehicleData, chassisNumber: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="agreementForsteGangRegistrert">1. gang registrert</Label>
                      <Input 
                        id="agreementForsteGangRegistrert" 
                        type="date"
                        value={vehicleData.firstRegistration}
                        onChange={(e) => setVehicleData({...vehicleData, firstRegistration: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="agreementSalgsform">Salgsform</Label>
                      <Input 
                        id="agreementSalgsform" 
                        placeholder="Privat salg"
                        value={vehicleData.saleType}
                        onChange={(e) => setVehicleData({...vehicleData, saleType: e.target.value})}
                      />
                    </div>
                  </div>
                </div>

                {/* Utstyr */}
                <div className="pt-6">
                  <h3 className="font-semibold text-foreground mb-4" style={{ fontSize: '1.0rem' }}>Utstyr - Selgers egenerklæring</h3>
                  
                  <div className="space-y-2 mb-6">
                    <Label htmlFor="agreementEquipment">Utstyr</Label>
                    <Textarea 
                      id="agreementEquipment" 
                      placeholder="Beskriv utstyr her..."
                      value={vehicleData.equipment}
                      onChange={(e) => setVehicleData({...vehicleData, equipment: e.target.value})}
                      rows={8}
                    />
                  </div>
                </div>

                {/* Finn.no information field */}
                <div className="space-y-2 mt-6">
                  <Label htmlFor="finnInfo">Informasjon hentet fra Selgers egen bilannonse på finn.no:</Label>
                  <Input 
                    id="finnInfo" 
                    placeholder="Lim inn link til finn.no annonse her"
                    type="url"
                  />
                </div>
              </CardContent>
            </Card>

            {/* SELGERS ERKLÆRING */}
            <Card>
              <CardHeader>
                <CardTitle>Selgers egenerklæring</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-muted/50 p-4 rounded-md mb-6">
                  <p className="text-sm text-muted-foreground">
                    Informasjon om kjøretøyet i denne Avtale er hentet fra min egen annonse på finn.no{' '}
                    <span className="font-medium">[insert link to finn.no-ad here]</span>. Jeg bekrefter at innholdet i annonsen er korrekt og at det ikke er tilbakeholdt noen informasjon. Jeg forstår og aksepterer at jeg vil være personlig ansvarlig for uriktig og ufullstendig informasjon.
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Bilen er kjøpt</Label>
                    <RadioGroup 
                      value={selgersErklaering.condition} 
                      onValueChange={(value) => setSelgersErklaering({...selgersErklaering, condition: value})}
                      name="condition"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="ny" id="condition-ny" />
                        <Label htmlFor="condition-ny" className="font-normal">Ny</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="brukt" id="condition-brukt" />
                        <Label htmlFor="condition-brukt" className="font-normal">Brukt</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="space-y-2">
                    <Label>Bilen har vært brukt som</Label>
                    <RadioGroup 
                      value={selgersErklaering.usage} 
                      onValueChange={(value) => setSelgersErklaering({...selgersErklaering, usage: value})}
                      name="usage"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="privat" id="usage-privat" />
                        <Label htmlFor="usage-privat" className="font-normal">Privat</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="firmabil" id="usage-firmabil" />
                        <Label htmlFor="usage-firmabil" className="font-normal">Firmabil</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="taxi" id="usage-taxi" />
                        <Label htmlFor="usage-taxi" className="font-normal">Taxi</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="skolebil" id="usage-skolebil" />
                        <Label htmlFor="usage-skolebil" className="font-normal">Skolebil</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="space-y-2">
                    <Label>Vedlikehold er utført av</Label>
                    <RadioGroup 
                      value={selgersErklaering.maintenance} 
                      onValueChange={(value) => setSelgersErklaering({...selgersErklaering, maintenance: value})}
                      name="maintenance"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="merkeverksted" id="maintenance-merke" />
                        <Label htmlFor="maintenance-merke" className="font-normal">Merkeverksted</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="verksted" id="maintenance-verksted" />
                        <Label htmlFor="maintenance-verksted" className="font-normal">Verksted</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="annet" id="maintenance-annet" />
                        <Label htmlFor="maintenance-annet" className="font-normal">Annet</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="space-y-2">
                    <Label>Er offentlige avgifter betalt</Label>
                    <RadioGroup 
                      value={selgersErklaering.fees} 
                      onValueChange={(value) => setSelgersErklaering({...selgersErklaering, fees: value})}
                      name="fees"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="ja" id="fees-ja" />
                        <Label htmlFor="fees-ja" className="font-normal">Ja</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="nei" id="fees-nei" />
                        <Label htmlFor="fees-nei" className="font-normal">Nei</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="space-y-2">
                    <Label>Er alle servicer fulgt?</Label>
                    <RadioGroup 
                      value={selgersErklaering.allServicesFollowed} 
                      onValueChange={(value) => setSelgersErklaering({...selgersErklaering, allServicesFollowed: value})}
                      name="allServicesFollowed"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="ja" id="services-ja" />
                        <Label htmlFor="services-ja" className="font-normal">Ja</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="nei" id="services-nei" />
                        <Label htmlFor="services-nei" className="font-normal">Nei</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="lastServiceDate">Når ble siste service gjennomført *</Label>
                    <Input 
                      id="lastServiceDate" 
                      type="date"
                      value={selgersErklaering.lastServiceDate}
                      onChange={(e) => setSelgersErklaering({...selgersErklaering, lastServiceDate: e.target.value})}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Er bilen bruktimportert?</Label>
                    <RadioGroup 
                      value={selgersErklaering.usedImport} 
                      onValueChange={(value) => setSelgersErklaering({...selgersErklaering, usedImport: value})}
                      name="usedImport"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="ja" id="import-ja" />
                        <Label htmlFor="import-ja" className="font-normal">Ja</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="nei" id="import-nei" />
                        <Label htmlFor="import-nei" className="font-normal">Nei</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="space-y-2">
                    <Label>Har kollisjonspute vært utkoblet?</Label>
                    <RadioGroup 
                      value={selgersErklaering.airbagDisconnected} 
                      onValueChange={(value) => setSelgersErklaering({...selgersErklaering, airbagDisconnected: value})}
                      name="airbagDisconnected"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="ja" id="airbag-ja" />
                        <Label htmlFor="airbag-ja" className="font-normal">Ja</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="nei" id="airbag-nei" />
                        <Label htmlFor="airbag-nei" className="font-normal">Nei</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="space-y-2">
                    <Label>Følger Antirustgaranti fra produsent?</Label>
                    <RadioGroup 
                      value={selgersErklaering.antiRustWarranty} 
                      onValueChange={(value) => setSelgersErklaering({...selgersErklaering, antiRustWarranty: value})}
                      name="antiRustWarranty"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="ja" id="warranty-ja" />
                        <Label htmlFor="warranty-ja" className="font-normal">Ja</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="nei" id="warranty-nei" />
                        <Label htmlFor="warranty-nei" className="font-normal">Nei</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="space-y-2">
                    <Label>Følger servicehefte med bilen?</Label>
                    <RadioGroup 
                      value={selgersErklaering.serviceManual} 
                      onValueChange={(value) => setSelgersErklaering({...selgersErklaering, serviceManual: value})}
                      name="serviceManual"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="ja" id="manual-ja" />
                        <Label htmlFor="manual-ja" className="font-normal">Ja</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="nei" id="manual-nei" />
                        <Label htmlFor="manual-nei" className="font-normal">Nei</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="space-y-2">
                    <Label>Er bilen chiptunet?</Label>
                    <RadioGroup 
                      value={selgersErklaering.chipTuned} 
                      onValueChange={(value) => setSelgersErklaering({...selgersErklaering, chipTuned: value})}
                      name="chipTuned"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="ja" id="chip-ja" />
                        <Label htmlFor="chip-ja" className="font-normal">Ja</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="nei" id="chip-nei" />
                        <Label htmlFor="chip-nei" className="font-normal">Nei</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="space-y-2">
                    <Label>Har noen av bilens komponenter blitt endret?</Label>
                    <RadioGroup 
                      value={selgersErklaering.componentsChanged} 
                      onValueChange={(value) => setSelgersErklaering({...selgersErklaering, componentsChanged: value})}
                      name="componentsChanged"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="ja" id="components-ja" />
                        <Label htmlFor="components-ja" className="font-normal">Ja</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="nei" id="components-nei" />
                        <Label htmlFor="components-nei" className="font-normal">Nei</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="space-y-2">
                    <Label>Er bilens kilometerstand riktig?</Label>
                    <RadioGroup 
                      value={selgersErklaering.mileageCorrect} 
                      onValueChange={(value) => setSelgersErklaering({...selgersErklaering, mileageCorrect: value})}
                      name="mileageCorrect"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="ja" id="mileage-ja" />
                        <Label htmlFor="mileage-ja" className="font-normal">Ja</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="nei" id="mileage-nei" />
                        <Label htmlFor="mileage-nei" className="font-normal">Nei</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="space-y-2">
                    <Label>Virker aircondition / kjøling som det skal?</Label>
                    <RadioGroup 
                      value={selgersErklaering.acWorks} 
                      onValueChange={(value) => setSelgersErklaering({...selgersErklaering, acWorks: value})}
                      name="acWorks"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="ja" id="ac-ja" />
                        <Label htmlFor="ac-ja" className="font-normal">Ja</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="nei" id="ac-nei" />
                        <Label htmlFor="ac-nei" className="font-normal">Nei</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="space-y-2">
                    <Label>Er bilens oljeforbruk normalt?</Label>
                    <RadioGroup 
                      value={selgersErklaering.oilConsumption} 
                      onValueChange={(value) => setSelgersErklaering({...selgersErklaering, oilConsumption: value})}
                      name="oilConsumption"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="ja" id="oil-ja" />
                        <Label htmlFor="oil-ja" className="font-normal">Ja</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="nei" id="oil-nei" />
                        <Label htmlFor="oil-nei" className="font-normal">Nei</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="numberOfKeys">Hvor mange nøkler følger med bilen (antall stk) *</Label>
                    <Input 
                      id="numberOfKeys" 
                      type="number" 
                      placeholder="2" 
                      className="max-w-[120px]" 
                      min="1"
                      value={selgersErklaering.numberOfKeys}
                      onChange={(e) => setSelgersErklaering({...selgersErklaering, numberOfKeys: e.target.value})}
                      required
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* INTERVALLSTYRTE ARBEIDER */}
            <Card>
              <CardHeader>
                <CardTitle>Intervallstyrte arbeider</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div className="grid grid-cols-3 gap-4">
                    <Label className="font-semibold">Arbeider</Label>
                    <Label className="font-semibold">Siste foretatt</Label>
                    <Label className="font-semibold">Neste intervall/bytte</Label>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 items-center">
                    <Label className="font-normal">Registerreim skifte</Label>
                    <Input id="registerreim-siste" placeholder="Dato/km" />
                    <Input id="registerreim-neste" placeholder="Dato/km" />
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 items-center">
                    <Label className="font-normal">Service</Label>
                    <Input id="service-siste" placeholder="Dato/km" />
                    <Input id="service-neste" placeholder="Dato/km" />
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 items-center">
                    <Label className="font-normal">Periodisk kjøretøykontroll (PKK / EU)</Label>
                    <Input id="pkk-siste" placeholder="Dato/km" />
                    <Input id="pkk-neste" placeholder="Dato/km" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* KARROSSERISKADER */}
            <Card>
              <CardHeader>
                <CardTitle>Karrosseriskader</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Har bilen vært skadet / lakkert?</Label>
                  <RadioGroup defaultValue="nei" name="damage">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="ja" id="damage-ja" />
                      <Label htmlFor="damage-ja" className="font-normal">Ja</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="nei" id="damage-nei" />
                      <Label htmlFor="damage-nei" className="font-normal">Nei</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="damageDescription">Beskriv skader, eventuelt andre opplysninger av betydning</Label>
                  <Textarea 
                    id="damageDescription" 
                    placeholder="Detaljer om skader, skyldige avgifter, etc."
                    rows={4}
                  />
                </div>
              </CardContent>
            </Card>

            {/* ERKLÆRING OG SIGNERING */}
            <Card>
              <CardHeader>
                <CardTitle>Erklæring og signering</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Selger bekrefter med sin underskrift at Innkjøpsavtalens generelle betingelser nedenfor er lest, forstått og akseptert
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="signatureDate">Dato</Label>
                    <Input 
                      id="signatureDate" 
                      type="date"
                      placeholder="DD.MM.ÅÅÅÅ"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signaturePlace">Sted</Label>
                    <Input 
                      id="signaturePlace" 
                      placeholder="By/sted"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* BUTTONS */}
            <div className="flex gap-4">
              <Button type="submit" className="flex-1">
                Lagre innkjøpsavtale
              </Button>
              <Button 
                type="button" 
                variant="secondary" 
                className="flex-1"
                onClick={() => setShowForm(false)}
              >
                Avbryt
              </Button>
            </div>
          </form>
            )}

            {agreementType === "formidlingsavtale" && (
              <Card>
                <CardHeader>
                  <CardTitle>Formidlingsavtale</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">Formidlingsavtale kommer snart...</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="mottakskontroll" className="space-y-6">
            {/* Expandable Manual Upload Section */}
            <div className="border rounded-lg overflow-hidden">
              <div 
                className="flex items-center justify-between p-4 cursor-pointer bg-button-teal hover:bg-button-teal/90 transition-colors text-button-teal-foreground"
                onClick={() => setShowManualUploadDialog(!showManualUploadDialog)}
              >
                <div className="flex items-center gap-3">
                  <Upload className="h-5 w-5 text-white" />
                  <span className="font-medium">Last opp signert avtale manuelt</span>
                </div>
                <ChevronDown className={`h-5 w-5 transition-transform ${showManualUploadDialog ? 'rotate-180' : ''}`} />
              </div>
              
              {showManualUploadDialog && (
                <div className="p-4 border-t bg-muted/30 space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="manual-reg">Registreringsnummer *</Label>
                    <Input
                      id="manual-reg"
                      placeholder="AB12345"
                      value={manualUploadData.registrationNumber}
                      onChange={(e) => setManualUploadData(prev => ({...prev, registrationNumber: e.target.value.toUpperCase()}))}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label htmlFor="manual-make">Merke *</Label>
                      <Input
                        id="manual-make"
                        placeholder="BMW"
                        value={manualUploadData.make}
                        onChange={(e) => setManualUploadData(prev => ({...prev, make: e.target.value}))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="manual-model">Modell *</Label>
                      <Input
                        id="manual-model"
                        placeholder="320d"
                        value={manualUploadData.model}
                        onChange={(e) => setManualUploadData(prev => ({...prev, model: e.target.value}))}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label htmlFor="manual-year">Årsmodell</Label>
                      <Input
                        id="manual-year"
                        placeholder="2020"
                        value={manualUploadData.year}
                        onChange={(e) => setManualUploadData(prev => ({...prev, year: e.target.value}))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="manual-seller">Innkjøper *</Label>
                      <Input
                        id="manual-seller"
                        placeholder="Navn på innkjøper"
                        value={manualUploadData.sellerName}
                        onChange={(e) => setManualUploadData(prev => ({...prev, sellerName: e.target.value}))}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="manual-file">Last opp signert avtale (PDF)</Label>
                    <Input
                      id="manual-file"
                      type="file"
                      accept=".pdf"
                      onChange={(e) => setManualUploadFile(e.target.files?.[0] || null)}
                    />
                    {manualUploadFile && (
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Check className="h-3 w-3 text-green-600" />
                        {manualUploadFile.name}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-3 pt-2">
                    <Button 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => {
                        setShowManualUploadDialog(false);
                        setManualUploadData({
                          registrationNumber: "",
                          make: "",
                          model: "",
                          year: "",
                          sellerName: "",
                        });
                        setManualUploadFile(null);
                      }}
                    >
                      Avbryt
                    </Button>
                    <Button 
                      className="flex-1"
                      disabled={!manualUploadData.registrationNumber || !manualUploadData.make || !manualUploadData.model || !manualUploadData.sellerName}
                      onClick={async () => {
                        try {
                          const today = new Date().toLocaleDateString('nb-NO');
                          
                          const { data, error } = await supabase
                            .from('mottakskontroll')
                            .insert({
                              registration_number: manualUploadData.registrationNumber,
                              make: manualUploadData.make,
                              model: manualUploadData.model,
                              year: manualUploadData.year ? parseInt(manualUploadData.year) : null,
                              seller_name: manualUploadData.sellerName,
                              sent_date: today,
                              status: 'Venter på mottakskontroll',
                            })
                            .select()
                            .single();

                          if (error) throw error;

                          setMottakskontrollCars(prev => [{
                            id: data.id,
                            regNumber: data.registration_number,
                            make: data.make,
                            model: data.model,
                            year: data.year,
                            seller: data.seller_name,
                            sentDate: data.sent_date,
                            status: data.status,
                            mottakskontrollData: null,
                            leadId: null,
                          }, ...prev]);

                          toast({
                            title: "Avtale lagt til",
                            description: `${manualUploadData.registrationNumber} er lagt til for mottakskontroll`,
                          });

                          setShowManualUploadDialog(false);
                          setManualUploadData({
                            registrationNumber: "",
                            make: "",
                            model: "",
                            year: "",
                            sellerName: "",
                          });
                          setManualUploadFile(null);
                        } catch (error: any) {
                          console.error('Error adding manual agreement:', error);
                          toast({
                            title: "Feil",
                            description: "Kunne ikke legge til avtale",
                            variant: "destructive",
                          });
                        }
                      }}
                    >
                      Legg til
                    </Button>
                  </div>
                </div>
              )}
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Mottakskontroll</CardTitle>
              </CardHeader>
              <CardContent>
                {mottakskontrollCars.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">Ingen biler venter på mottakskontroll</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {mottakskontrollCars.map((car) => (
                      <div key={car.id} className="border rounded-lg overflow-hidden">
                        {/* Collapsed header */}
                        <div 
                          className="flex items-center justify-between p-3 bg-muted/50 cursor-pointer hover:bg-muted/70 transition-colors"
                          onClick={() => setExpandedMottakskontrollId(expandedMottakskontrollId === car.id ? null : car.id)}
                        >
                          <div className="flex items-center gap-4">
                            <div className="font-mono font-semibold text-primary">
                              {car.regNumber}
                            </div>
                            <div className="text-sm">
                              {car.make} {car.model} {car.year && `(${car.year})`}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              Selger: {car.seller}
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className="text-xs text-muted-foreground">
                              Sendt: {car.sentDate}
                            </span>
                            <div className="flex items-center gap-2">
                              <span className={`w-2.5 h-2.5 rounded-full ${car.status === 'Mottakskontroll fullført' ? 'bg-green-500' : 'bg-amber-500 animate-pulse'}`} />
                              <span className={`text-xs px-2 py-1 rounded-full font-medium ${car.status === 'Mottakskontroll fullført' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}`}>
                                {car.status}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                              <Button
                                size="sm"
                                variant="ghost"
                                className="text-xs h-7 w-7 p-0"
                                title="Vis avtale PDF"
                                onClick={async (e) => {
                                  e.stopPropagation();
                                  
                                  // Check if we have a saved PDF in storage
                                  if (car.agreementPdfPath) {
                                    // Get the public URL from storage
                                    const { data: urlData } = supabase.storage
                                      .from('agreement-pdfs')
                                      .getPublicUrl(car.agreementPdfPath);
                                    
                                    if (urlData?.publicUrl) {
                                      setAgreementPreviewPdfUrl(urlData.publicUrl);
                                      setAgreementPreviewCar(car);
                                      setShowAgreementPreview(true);
                                    } else {
                                      toast({
                                        title: "Feil",
                                        description: "Kunne ikke laste ned avtalen",
                                        variant: "destructive",
                                      });
                                    }
                                  } else {
                                    // Fallback: Generate agreement PDF for this car (for older entries without saved PDF)
                                    const linkedLead = createdLeads.find(l => l.id === car.leadId);
                                    if (linkedLead || car.regNumber) {
                                      const pdfBlob = generateAgreementPdfForMottakskontroll(car, linkedLead);
                                      const pdfUrl = URL.createObjectURL(pdfBlob);
                                      setAgreementPreviewPdfUrl(pdfUrl);
                                      setAgreementPreviewCar(car);
                                      setShowAgreementPreview(true);
                                    } else {
                                      toast({
                                        title: "Ingen avtale funnet",
                                        description: "Kunne ikke finne avtalen for denne bilen",
                                        variant: "destructive",
                                      });
                                    }
                                  }
                                }}
                              >
                                <FileText className="h-4 w-4 text-primary" />
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="text-xs h-7 px-3"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setExpandedMottakskontrollId(car.id);
                                  setSelectedMottakskontrollCar(car);
                                  
                                  // Check if we have EU data from the linked lead
                                  let euStatus = car.mottakskontrollData?.erEuGodkjent || '';
                                  if (!euStatus && car.leadId) {
                                    const linkedLead = createdLeads.find(l => l.id === car.leadId);
                                    if (linkedLead?.specifications?.nesteEuKontroll) {
                                      // If there's a future EU control date, the car is EU-approved
                                      const euDate = new Date(linkedLead.specifications.nesteEuKontroll);
                                      euStatus = euDate > new Date() ? 'ja' : 'nei';
                                    } else if (linkedLead?.specifications?.sistEuGodkjent) {
                                      // If there's a last EU approval date, consider it approved
                                      euStatus = 'ja';
                                    }
                                  }
                                  
                                  setMottakskontrollChecklist({
                                    erBilenVasket: car.mottakskontrollData?.erBilenVasket || '',
                                    harHund: car.mottakskontrollData?.harHund || '',
                                    vognkortDel1: car.mottakskontrollData?.vognkortDel1 || '',
                                    antallNokler: car.mottakskontrollData?.antallNokler || '',
                                    sommerdekkKomplett: car.mottakskontrollData?.sommerdekkKomplett || '',
                                    monsterdybdeSommer: car.mottakskontrollData?.monsterdybdeSommer || '',
                                    vinterdekkKomplett: car.mottakskontrollData?.vinterdekkKomplett || '',
                                    monsterdybdeVinter: car.mottakskontrollData?.monsterdybdeVinter || '',
                                    gyldigForsikring: car.mottakskontrollData?.gyldigForsikring || '',
                                    erEuGodkjent: euStatus,
                                    drivstoffniva: car.mottakskontrollData?.drivstoffniva || '',
                                    merknader: car.mottakskontrollData?.merknader || '',
                                    ekstraVask: car.mottakskontrollData?.ekstraVask || '',
                                    ekstraHundehar: car.mottakskontrollData?.ekstraHundehar || '',
                                    forholdSignature: car.mottakskontrollData?.forholdSignature || '',
                                    forholdSignatureDate: car.mottakskontrollData?.forholdSignatureDate || '',
                                    betalingBekreftet: car.mottakskontrollData?.betalingBekreftet || false,
                                  });
                                }}
                              >
                                Utfør mottakskontroll
                              </Button>
                              <ChevronDown className={`h-4 w-4 transition-transform ${expandedMottakskontrollId === car.id ? 'rotate-180' : ''}`} />
                            </div>
                          </div>
                        </div>
                        
                        {/* Expanded checklist */}
                        {expandedMottakskontrollId === car.id && (
                          <div className="p-6 border-t bg-background">
                            <h4 className="font-semibold text-base mb-6 text-primary">Sjekkliste iht avtale mellom partene</h4>
                            
                            <div className="space-y-6">
                              {/* Bilens tilstand */}
                              <div className="space-y-4">
                                <h5 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Bilens tilstand</h5>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  {/* Er bilen vasket og rengjort */}
                                  <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                                    <Label className="text-sm">Er bilen vasket og rengjort?</Label>
                                    <div className="flex gap-2">
                                      <Button
                                        type="button"
                                        size="sm"
                                        variant={mottakskontrollChecklist.erBilenVasket === 'ja' ? "default" : "outline"}
                                        className="text-xs w-12"
                                        onClick={() => setMottakskontrollChecklist(prev => ({...prev, erBilenVasket: 'ja'}))}
                                      >
                                        Ja
                                      </Button>
                                      <Button
                                        type="button"
                                        size="sm"
                                        variant={mottakskontrollChecklist.erBilenVasket === 'nei' ? "default" : "outline"}
                                        className="text-xs w-12"
                                        onClick={() => setMottakskontrollChecklist(prev => ({...prev, erBilenVasket: 'nei'}))}
                                      >
                                        Nei
                                      </Button>
                                    </div>
                                  </div>

                                  {/* Har bileier hatt hund */}
                                  <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                                    <Label className="text-sm">Har bileier hatt hund?</Label>
                                    <div className="flex gap-2">
                                      <Button
                                        type="button"
                                        size="sm"
                                        variant={mottakskontrollChecklist.harHund === 'ja' ? "default" : "outline"}
                                        className="text-xs w-12"
                                        onClick={() => setMottakskontrollChecklist(prev => ({...prev, harHund: 'ja'}))}
                                      >
                                        Ja
                                      </Button>
                                      <Button
                                        type="button"
                                        size="sm"
                                        variant={mottakskontrollChecklist.harHund === 'nei' ? "default" : "outline"}
                                        className="text-xs w-12"
                                        onClick={() => setMottakskontrollChecklist(prev => ({...prev, harHund: 'nei'}))}
                                      >
                                        Nei
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* Dokumenter og nøkler */}
                              <div className="space-y-4">
                                <h5 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Dokumenter og nøkler</h5>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  {/* Følger Vognkort del 1 */}
                                  <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                                    <Label className="text-sm">Følger Vognkort del 1?</Label>
                                    <div className="flex gap-2">
                                      <Button
                                        type="button"
                                        size="sm"
                                        variant={mottakskontrollChecklist.vognkortDel1 === 'ja' ? "default" : "outline"}
                                        className="text-xs w-12"
                                        onClick={() => setMottakskontrollChecklist(prev => ({...prev, vognkortDel1: 'ja'}))}
                                      >
                                        Ja
                                      </Button>
                                      <Button
                                        type="button"
                                        size="sm"
                                        variant={mottakskontrollChecklist.vognkortDel1 === 'nei' ? "default" : "outline"}
                                        className="text-xs w-12"
                                        onClick={() => setMottakskontrollChecklist(prev => ({...prev, vognkortDel1: 'nei'}))}
                                      >
                                        Nei
                                      </Button>
                                    </div>
                                  </div>

                                  {/* Antall nøkler */}
                                  <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                                    <Label htmlFor={`antallNokler-${car.id}`} className="text-sm">Antall nøkler?</Label>
                                    <Input 
                                      id={`antallNokler-${car.id}`}
                                      className="w-20 text-center"
                                      placeholder="0"
                                      value={mottakskontrollChecklist.antallNokler}
                                      onChange={(e) => setMottakskontrollChecklist(prev => ({...prev, antallNokler: e.target.value}))}
                                    />
                                  </div>
                                </div>
                              </div>

                              {/* Dekk og felger */}
                              <div className="space-y-4">
                                <h5 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Dekk og felger</h5>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  {/* Sommerdekk */}
                                  <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                                    <Label className="text-sm">Følger komplette sommerdekk og felger?</Label>
                                    <div className="flex gap-2">
                                      <Button
                                        type="button"
                                        size="sm"
                                        variant={mottakskontrollChecklist.sommerdekkKomplett === 'ja' ? "default" : "outline"}
                                        className="text-xs w-12"
                                        onClick={() => setMottakskontrollChecklist(prev => ({...prev, sommerdekkKomplett: 'ja'}))}
                                      >
                                        Ja
                                      </Button>
                                      <Button
                                        type="button"
                                        size="sm"
                                        variant={mottakskontrollChecklist.sommerdekkKomplett === 'nei' ? "default" : "outline"}
                                        className="text-xs w-12"
                                        onClick={() => setMottakskontrollChecklist(prev => ({...prev, sommerdekkKomplett: 'nei'}))}
                                      >
                                        Nei
                                      </Button>
                                    </div>
                                  </div>

                                  {/* Mønsterdybde sommerdekk */}
                                  <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                                    <Label htmlFor={`monsterdybdeSommer-${car.id}`} className="text-sm">Mønsterdybde sommerdekk</Label>
                                    <div className="flex items-center gap-1">
                                      <Input 
                                        id={`monsterdybdeSommer-${car.id}`}
                                        className="w-16 text-center"
                                        placeholder="0"
                                        value={mottakskontrollChecklist.monsterdybdeSommer}
                                        onChange={(e) => setMottakskontrollChecklist(prev => ({...prev, monsterdybdeSommer: e.target.value}))}
                                      />
                                      <span className="text-sm text-muted-foreground">mm</span>
                                    </div>
                                  </div>

                                  {/* Vinterdekk */}
                                  <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                                    <Label className="text-sm">Følger komplette vinterdekk og felger?</Label>
                                    <div className="flex gap-2">
                                      <Button
                                        type="button"
                                        size="sm"
                                        variant={mottakskontrollChecklist.vinterdekkKomplett === 'ja' ? "default" : "outline"}
                                        className="text-xs w-12"
                                        onClick={() => setMottakskontrollChecklist(prev => ({...prev, vinterdekkKomplett: 'ja'}))}
                                      >
                                        Ja
                                      </Button>
                                      <Button
                                        type="button"
                                        size="sm"
                                        variant={mottakskontrollChecklist.vinterdekkKomplett === 'nei' ? "default" : "outline"}
                                        className="text-xs w-12"
                                        onClick={() => setMottakskontrollChecklist(prev => ({...prev, vinterdekkKomplett: 'nei'}))}
                                      >
                                        Nei
                                      </Button>
                                    </div>
                                  </div>

                                  {/* Mønsterdybde vinterdekk */}
                                  <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                                    <Label htmlFor={`monsterdybdeVinter-${car.id}`} className="text-sm">Mønsterdybde vinterdekk</Label>
                                    <div className="flex items-center gap-1">
                                      <Input 
                                        id={`monsterdybdeVinter-${car.id}`}
                                        className="w-16 text-center"
                                        placeholder="0"
                                        value={mottakskontrollChecklist.monsterdybdeVinter}
                                        onChange={(e) => setMottakskontrollChecklist(prev => ({...prev, monsterdybdeVinter: e.target.value}))}
                                      />
                                      <span className="text-sm text-muted-foreground">mm</span>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* Forsikring og EU */}
                              <div className="space-y-4">
                                <h5 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Forsikring og EU</h5>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  {/* Gyldig forsikring */}
                                  <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                                    <Label className="text-sm">Har bilen gyldig forsikring?</Label>
                                    <div className="flex gap-2">
                                      <Button
                                        type="button"
                                        size="sm"
                                        variant={mottakskontrollChecklist.gyldigForsikring === 'ja' ? "default" : "outline"}
                                        className="text-xs w-12"
                                        onClick={() => setMottakskontrollChecklist(prev => ({...prev, gyldigForsikring: 'ja'}))}
                                      >
                                        Ja
                                      </Button>
                                      <Button
                                        type="button"
                                        size="sm"
                                        variant={mottakskontrollChecklist.gyldigForsikring === 'nei' ? "default" : "outline"}
                                        className="text-xs w-12"
                                        onClick={() => setMottakskontrollChecklist(prev => ({...prev, gyldigForsikring: 'nei'}))}
                                      >
                                        Nei
                                      </Button>
                                    </div>
                                  </div>

                                  {/* Er bilen EU-godkjent */}
                                  <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                                    <Label className="text-sm">Er bilen EU-godkjent?</Label>
                                    <div className="flex gap-2">
                                      <Button
                                        type="button"
                                        size="sm"
                                        variant={mottakskontrollChecklist.erEuGodkjent === 'ja' ? "default" : "outline"}
                                        className="text-xs w-12"
                                        onClick={() => setMottakskontrollChecklist(prev => ({...prev, erEuGodkjent: 'ja'}))}
                                      >
                                        Ja
                                      </Button>
                                      <Button
                                        type="button"
                                        size="sm"
                                        variant={mottakskontrollChecklist.erEuGodkjent === 'nei' ? "default" : "outline"}
                                        className="text-xs w-12"
                                        onClick={() => setMottakskontrollChecklist(prev => ({...prev, erEuGodkjent: 'nei'}))}
                                      >
                                        Nei
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* Drivstoffnivå */}
                              <div className="space-y-4">
                                <h5 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Drivstoff/Elektrisitet</h5>
                                <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                                  <Label className="text-sm">Er bilen levert med</Label>
                                  <div className="flex gap-2">
                                    {(['1/4', '1/2', '3/4', 'Full'] as const).map((level) => (
                                      <Button
                                        key={level}
                                        type="button"
                                        size="sm"
                                        variant={mottakskontrollChecklist.drivstoffniva === level ? "default" : "outline"}
                                        className="text-xs"
                                        onClick={() => setMottakskontrollChecklist(prev => ({...prev, drivstoffniva: level}))}
                                      >
                                        {level} tank
                                      </Button>
                                    ))}
                                  </div>
                                </div>
                              </div>

                              {/* Merknader */}
                              <div className="space-y-2">
                                <Label htmlFor={`merknader-${car.id}`} className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Merknader</Label>
                                <Textarea 
                                  id={`merknader-${car.id}`}
                                  placeholder="Eventuelle avvik eller merknader..."
                                  value={mottakskontrollChecklist.merknader}
                                  onChange={(e) => setMottakskontrollChecklist(prev => ({...prev, merknader: e.target.value}))}
                                  rows={2}
                                />
                              </div>

                              {/* Økonomi Section */}
                              <div className="space-y-4 pt-4 border-t">
                                <h4 className="font-semibold text-base text-primary">Økonomi</h4>
                                
                                {/* Vippskrav calculation display */}
                                <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                                  <div className="text-sm space-y-1">
                                    <div className="flex justify-between">
                                      <span>Tilstandskontroll:</span>
                                      <span className="font-medium">1 800 kr</span>
                                    </div>
                                    {mottakskontrollChecklist.drivstoffniva && mottakskontrollChecklist.drivstoffniva !== 'Full' && (
                                      <div className="flex justify-between">
                                        <span>Drivstoff/Elektrisitet ({mottakskontrollChecklist.drivstoffniva} tank):</span>
                                        <span className="font-medium">
                                          {mottakskontrollChecklist.drivstoffniva === '1/4' ? '750' : mottakskontrollChecklist.drivstoffniva === '1/2' ? '500' : '250'} kr
                                        </span>
                                      </div>
                                    )}
                                    {mottakskontrollChecklist.erBilenVasket === 'nei' && (
                                      <div className="flex justify-between">
                                        <span>Ekstrabetaling for vask:</span>
                                        <span className="font-medium">500 kr</span>
                                      </div>
                                    )}
                                    {mottakskontrollChecklist.harHund === 'ja' && (
                                      <div className="flex justify-between">
                                        <span>Fjerning av hundehår og lukt:</span>
                                        <span className="font-medium">1 000 kr</span>
                                      </div>
                                    )}
                                    <div className="flex justify-between pt-2 border-t mt-2">
                                      <span className="font-semibold">Totalt:</span>
                                      <span className="font-bold">
                                        {(
                                          1800 + 
                                          (mottakskontrollChecklist.drivstoffniva === '1/4' ? 750 : mottakskontrollChecklist.drivstoffniva === '1/2' ? 500 : mottakskontrollChecklist.drivstoffniva === '3/4' ? 250 : 0) +
                                          (mottakskontrollChecklist.erBilenVasket === 'nei' ? 500 : 0) +
                                          (mottakskontrollChecklist.harHund === 'ja' ? 1000 : 0)
                                        ).toLocaleString('no-NO')} kr ink mva
                                      </span>
                                    </div>
                                  </div>
                                </div>

                                <div className="flex gap-3">
                                  <Button
                                    type="button"
                                    variant="destructive"
                                    className="flex-1"
                                  >
                                    Innhent betaling via Vipps
                                  </Button>
                                  <Button
                                    type="button"
                                    variant="outline"
                                    className="flex-1"
                                  >
                                    Innhent betaling via Dintero
                                  </Button>
                                </div>

                                <Button
                                  type="button"
                                  onClick={() => setMottakskontrollChecklist(prev => ({...prev, betalingBekreftet: !prev.betalingBekreftet}))}
                                  className={`w-full transition-all ${
                                    mottakskontrollChecklist.betalingBekreftet 
                                      ? 'bg-[#91bf48] hover:bg-[#7da93d] text-white' 
                                      : 'bg-muted hover:bg-muted/80 text-muted-foreground border border-dashed border-muted-foreground/50'
                                  }`}
                                  variant="ghost"
                                >
                                  {mottakskontrollChecklist.betalingBekreftet && <Check className="h-4 w-4 mr-2" />}
                                  Betaling bekreftet mottatt
                                </Button>

                                {/* Forhold som påvirker avtalegrunnlaget */}
                                {(parseInt(mottakskontrollChecklist.antallNokler) < 2 || 
                                  mottakskontrollChecklist.sommerdekkKomplett === 'nei' || 
                                  mottakskontrollChecklist.vinterdekkKomplett === 'nei') && (
                                  <div className="mt-6 space-y-4">
                                    <h5 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                                      Forhold som påvirker avtalegrunnlaget mellom partene
                                    </h5>
                                    
                                    {/* Declaration and Signature */}
                                    <div className="bg-muted/30 border rounded-lg p-4 space-y-4">
                                      <p className="text-sm text-foreground">
                                        Jeg aksepterer at følgende forhold må utbedres i forbindelse med salg av bilen.
                                      </p>
                                      
                                      <ul className="list-none space-y-1 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
                                        {parseInt(mottakskontrollChecklist.antallNokler) < 2 && mottakskontrollChecklist.antallNokler !== '' && (
                                          <li className="text-sm text-amber-800 dark:text-amber-200">
                                            • Nye nøkler må produseres opp på bileiers regning.
                                          </li>
                                        )}
                                        {mottakskontrollChecklist.sommerdekkKomplett === 'nei' && (
                                          <li className="text-sm text-amber-800 dark:text-amber-200">
                                            • Nye sommerdekk må kjøpes inn for bileiers regning.
                                          </li>
                                        )}
                                        {mottakskontrollChecklist.vinterdekkKomplett === 'nei' && (
                                          <li className="text-sm text-amber-800 dark:text-amber-200">
                                            • Nye vinterdekk må kjøpes inn for bileiers regning.
                                          </li>
                                        )}
                                      </ul>
                                      
                                      <p className="text-sm text-foreground">
                                        Kostnaden dekkes av undertegnede i form av at det trekkes fra oppgjøret når bilen er solgt.
                                      </p>
                                      
                                      <div className="space-y-4 pt-4 border-t">
                                        <div className="space-y-2">
                                          <Label className="text-sm font-medium">Bileier</Label>
                                          <p className="text-sm font-semibold">{car.seller || "Ikke oppgitt"}</p>
                                        </div>
                                        
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                          <div className="space-y-2">
                                            <Label className="text-sm font-medium">Signatur</Label>
                                            <SignatureCanvas
                                              onSignatureChange={(signatureData) => 
                                                setMottakskontrollChecklist(prev => ({...prev, forholdSignature: signatureData}))
                                              }
                                              initialSignature={mottakskontrollChecklist.forholdSignature}
                                            />
                                          </div>
                                          <div className="space-y-2">
                                            <Label className="text-sm font-medium">Dato</Label>
                                            <Input
                                              type="date"
                                              value={mottakskontrollChecklist.forholdSignatureDate}
                                              onChange={(e) => setMottakskontrollChecklist(prev => ({...prev, forholdSignatureDate: e.target.value}))}
                                              className="border-2"
                                            />
                                            {mottakskontrollChecklist.forholdSignature && mottakskontrollChecklist.forholdSignatureDate && (
                                              <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400 mt-2">
                                                <Check className="h-4 w-4" />
                                                <span>Signert {new Date(mottakskontrollChecklist.forholdSignatureDate).toLocaleDateString('no-NO')}</span>
                                              </div>
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </div>

                              {/* Actions */}
                              <div className="flex gap-3 pt-4 border-t mt-4">
                                <Button 
                                  variant="outline" 
                                  onClick={() => setExpandedMottakskontrollId(null)}
                                >
                                  Lukk
                                </Button>
                                <Button 
                                  variant="default" 
                                  disabled={!mottakskontrollChecklist.betalingBekreftet}
                                  onClick={() => {
                                    if (!mottakskontrollChecklist.betalingBekreftet) {
                                      toast({
                                        title: "Betaling ikke bekreftet",
                                        description: "Du må bekrefte at betaling er mottatt før du kan fullføre mottakskontroll",
                                        variant: "destructive",
                                      });
                                      return;
                                    }
                                    
                                    // Generate PDF and show preview
                                    const pdfBlob = generateMottakskontrollPdf(car, mottakskontrollChecklist);
                                    const pdfUrl = URL.createObjectURL(pdfBlob);
                                    setMottakskontrollPdfUrl(pdfUrl);
                                    setPreviewMottakskontrollCar(car);
                                    setShowMottakskontrollPreview(true);
                                  }}
                                >
                                  Fullfør mottakskontroll
                                </Button>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tilstandskontroll" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Tilstandskontroll</CardTitle>
              </CardHeader>
              <CardContent>
                {mottakskontrollCars.filter(car => car.status === 'Avtale signert og mottakskontroll utført').length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">Ingen biler klare for tilstandskontroll</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {mottakskontrollCars
                      .filter(car => car.status === 'Avtale signert og mottakskontroll utført')
                      .map((car) => (
                        <div key={car.id} className="border rounded-lg overflow-hidden">
                          {selectedTilstandskontrollCar?.id === car.id ? (
                            <div className="p-4">
                              <div className="mb-4 pb-3 border-b">
                                <h4 className="font-semibold">{car.regNumber} - {car.make} {car.model}</h4>
                              </div>
                              <TilstandskontrollForm
                                car={car}
                                onComplete={async (data) => {
                                  console.log('Tilstandskontroll completed:', data);
                                  try {
                                    const { error } = await supabase
                                      .from('mottakskontroll')
                                      .update({
                                        tilstandskontroll_data: data as any,
                                        status: 'Tilstandskontroll fullført',
                                        updated_at: new Date().toISOString(),
                                      })
                                      .eq('id', car.id);

                                    if (error) throw error;

                                    // Update local state
                                    setMottakskontrollCars(prev => prev.map(c => 
                                      c.id === car.id 
                                        ? { ...c, status: 'Tilstandskontroll fullført', tilstandskontrollData: data }
                                        : c
                                    ));

                                    toast({
                                      title: "Tilstandskontroll lagret",
                                      description: `${car.regNumber} er ferdig kontrollert og lagret`,
                                    });
                                    setSelectedTilstandskontrollCar(null);
                                  } catch (error: any) {
                                    console.error('Error saving tilstandskontroll:', error);
                                    toast({
                                      title: "Feil",
                                      description: "Kunne ikke lagre tilstandskontroll",
                                      variant: "destructive",
                                    });
                                  }
                                }}
                                onCancel={() => setSelectedTilstandskontrollCar(null)}
                              />
                            </div>
                          ) : (
                            <div className="flex items-center justify-between p-3 bg-muted/50">
                              <div className="flex items-center gap-4">
                                <div className="font-mono font-semibold text-primary">
                                  {car.regNumber}
                                </div>
                                <div className="text-sm">
                                  {car.make} {car.model} {car.year && `(${car.year})`}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  Selger: {car.seller}
                                </div>
                              </div>
                              <div className="flex items-center gap-4">
                                <span className="text-xs text-muted-foreground">
                                  Sendt: {car.sentDate}
                                </span>
                                <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-800">
                                  {car.status}
                                </span>
                                <Button 
                                  size="sm" 
                                  variant="default" 
                                  className="text-xs h-7"
                                  onClick={() => setSelectedTilstandskontrollCar(car)}
                                >
                                  Gjennomfør tilstandskontroll
                                </Button>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="vask-foto" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Camera className="h-5 w-5" />
                  Vask og Foto
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Biler som har fullført mottakskontroll og er klare for vask og fotografering
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                {mottakskontrollCars.filter(car => car.status === 'Avtale signert og mottakskontroll utført').length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Camera className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Ingen biler klare for vask og foto ennå</p>
                    <p className="text-sm">Biler vises her etter mottakskontroll er fullført</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {mottakskontrollCars
                      .filter(car => car.status === 'Avtale signert og mottakskontroll utført')
                      .map((car) => {
                        const isExpanded = expandedVaskFotoId === car.id;
                        const media = car.vaskFotoData || { photos: [], videos: [] };
                        const photoCount = media.photos?.length || 0;
                        const videoCount = media.videos?.length || 0;
                        
                        return (
                          <div key={car.id} className="border rounded-lg overflow-hidden">
                            {/* Collapsed view */}
                            <div 
                              className="flex items-center justify-between p-4 cursor-pointer hover:bg-muted/50 transition-colors"
                              onClick={() => setExpandedVaskFotoId(isExpanded ? null : car.id)}
                            >
                              <div className="flex items-center gap-4">
                                <div className="flex flex-col">
                                  <span className="font-semibold">{car.regNumber}</span>
                                  <span className="text-sm text-muted-foreground">
                                    {car.make} {car.model} {car.year}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                  <Image className="h-4 w-4" />
                                  <span>{photoCount} bilder</span>
                                  <Video className="h-4 w-4 ml-2" />
                                  <span>{videoCount} videoer</span>
                                  {car.agreementPdfPath && (
                                    <button
                                      className="flex items-center gap-1 ml-2 hover:text-foreground transition-colors"
                                      onClick={async (e) => {
                                        e.stopPropagation();
                                        const { data } = supabase.storage
                                          .from('agreement-pdfs')
                                          .getPublicUrl(car.agreementPdfPath);
                                        setAgreementPreviewPdfUrl(data.publicUrl);
                                        setAgreementPreviewCar(car);
                                        setShowAgreementPreview(true);
                                      }}
                                      title="Se avtale og mottakskontroll"
                                    >
                                      <FileText className="h-4 w-4" />
                                      <span>Avtalegrunnlag</span>
                                    </button>
                                  )}
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                {car.vaskFotoCompleted && (
                                  <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                                    Fullført
                                  </span>
                                )}
                                <ChevronDown className={`h-5 w-5 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                              </div>
                            </div>
                            
                            {/* Expanded view */}
                            {isExpanded && (
                              <div className="border-t p-4 bg-muted/30 space-y-6">
                                {/* Photo upload section */}
                                <div className="space-y-3">
                                  <div className="flex items-center justify-between">
                                    <h4 className="font-medium flex items-center gap-2">
                                      <Camera className="h-4 w-4" />
                                      Bilder
                                    </h4>
                                    <Label className="cursor-pointer">
                                      <Input
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        className="hidden"
                                        onChange={(e) => e.target.files && handleMediaUpload(car.id, e.target.files, 'photo')}
                                        disabled={uploadingMedia === car.id}
                                      />
                                      <Button variant="outline" size="sm" asChild disabled={uploadingMedia === car.id}>
                                        <span>
                                          {uploadingMedia === car.id ? (
                                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                          ) : (
                                            <Upload className="h-4 w-4 mr-2" />
                                          )}
                                          Last opp bilder
                                        </span>
                                      </Button>
                                    </Label>
                                  </div>
                                  {media.photos?.length > 0 ? (
                                    <div className="grid grid-cols-4 gap-3">
                                      {media.photos.map((url: string, idx: number) => (
                                        <div key={idx} className="relative group aspect-video rounded-lg overflow-hidden border">
                                          <img 
                                            src={url} 
                                            alt={`Bilde ${idx + 1}`}
                                            className="w-full h-full object-cover"
                                          />
                                          <button
                                            onClick={() => handleDeleteMedia(car.id, url, 'photo')}
                                            className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                          >
                                            <X className="h-3 w-3" />
                                          </button>
                                        </div>
                                      ))}
                                    </div>
                                  ) : (
                                    <p className="text-sm text-muted-foreground">Ingen bilder lastet opp ennå</p>
                                  )}
                                </div>

                                {/* Video upload section */}
                                <div className="space-y-3">
                                  <div className="flex items-center justify-between">
                                    <h4 className="font-medium flex items-center gap-2">
                                      <Video className="h-4 w-4" />
                                      Videoer
                                    </h4>
                                    <Label className="cursor-pointer">
                                      <Input
                                        type="file"
                                        accept="video/*"
                                        multiple
                                        className="hidden"
                                        onChange={(e) => e.target.files && handleMediaUpload(car.id, e.target.files, 'video')}
                                        disabled={uploadingMedia === car.id}
                                      />
                                      <Button variant="outline" size="sm" asChild disabled={uploadingMedia === car.id}>
                                        <span>
                                          {uploadingMedia === car.id ? (
                                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                          ) : (
                                            <Upload className="h-4 w-4 mr-2" />
                                          )}
                                          Last opp videoer
                                        </span>
                                      </Button>
                                    </Label>
                                  </div>
                                  {media.videos?.length > 0 ? (
                                    <div className="grid grid-cols-3 gap-3">
                                      {media.videos.map((url: string, idx: number) => (
                                        <div key={idx} className="relative group aspect-video rounded-lg overflow-hidden border bg-black">
                                          <video 
                                            src={url} 
                                            className="w-full h-full object-contain"
                                            controls
                                          />
                                          <button
                                            onClick={() => handleDeleteMedia(car.id, url, 'video')}
                                            className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                          >
                                            <X className="h-3 w-3" />
                                          </button>
                                        </div>
                                      ))}
                                    </div>
                                  ) : (
                                    <p className="text-sm text-muted-foreground">Ingen videoer lastet opp ennå</p>
                                  )}
                                </div>

                                {/* Complete button */}
                                <div className="flex justify-end pt-4 border-t">
                                  {!car.vaskFotoCompleted ? (
                                    <Button 
                                      onClick={() => handleMarkVaskFotoComplete(car.id)}
                                      disabled={photoCount === 0}
                                      style={{ backgroundColor: '#91bf48' }}
                                      className="text-white hover:opacity-90"
                                    >
                                      <Check className="h-4 w-4 mr-2" />
                                      Fullfør Vask/Foto
                                    </Button>
                                  ) : (
                                    <span className="flex items-center gap-2 text-green-600">
                                      <Check className="h-5 w-5" />
                                      Vask/Foto fullført
                                    </span>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="annonsering" className="space-y-6">
            <div className="text-center py-12">
              <p className="text-muted-foreground">Annonsering kommer snart...</p>
            </div>
          </TabsContent>

          <TabsContent value="mine-biler" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Mine biler til salgs</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <p className="text-muted-foreground">Mine biler til salgs kommer snart...</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

      {/* PDF Preview Dialog with Actions */}
      <Dialog open={showPreview} onOpenChange={(open) => {
        if (!open) {
          setShowPreview(false);
        }
      }}>
        <DialogContent className="max-w-4xl h-[85vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>Forhåndsvisning av innkjøpsavtale</DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-auto min-h-0">
            {pdfPreviewUrl && (
              <iframe
                src={pdfPreviewUrl}
                className="w-full h-full border-0"
                title="PDF Preview"
              />
            )}
          </div>
          <div className="flex gap-3 pt-4 border-t">
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={handleEditAgreement}
            >
              Rediger avtale
            </Button>
            <Button 
              variant="default" 
              className="flex-1"
              onClick={handleSendToSeller}
            >
              Send avtale til signering
            </Button>
            <Button 
              variant="destructive" 
              className="flex-1"
              onClick={handleDeleteAndCancel}
            >
              Slett avtale
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Mottakskontroll PDF Preview Dialog */}
      <Dialog open={showMottakskontrollPreview} onOpenChange={(open) => {
        if (!open) {
          setShowMottakskontrollPreview(false);
          if (mottakskontrollPdfUrl) {
            URL.revokeObjectURL(mottakskontrollPdfUrl);
            setMottakskontrollPdfUrl(null);
          }
        }
      }}>
        <DialogContent className="max-w-4xl h-[85vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>Forhåndsvisning av mottakskontroll</DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-auto min-h-0">
            {mottakskontrollPdfUrl && (
              <iframe
                src={mottakskontrollPdfUrl}
                className="w-full h-full border-0"
                title="Mottakskontroll PDF Preview"
              />
            )}
          </div>
          <div className="flex gap-3 pt-4 border-t">
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={() => {
                setShowMottakskontrollPreview(false);
                if (mottakskontrollPdfUrl) {
                  URL.revokeObjectURL(mottakskontrollPdfUrl);
                  setMottakskontrollPdfUrl(null);
                }
                setPreviewMottakskontrollCar(null);
              }}
            >
              Rediger mottakskontroll
            </Button>
            <Button 
              variant="default" 
              className="flex-1"
              onClick={async () => {
                if (!previewMottakskontrollCar) return;
                
                try {
                  // Get the mottakskontroll PDF blob
                  const mottakskontrollBlob = generateMottakskontrollPdf(previewMottakskontrollCar, mottakskontrollChecklist);
                  const mottakskontrollArrayBuffer = await mottakskontrollBlob.arrayBuffer();
                  
                  let mergedPdfBytes: Uint8Array;
                  
                  // Check if there's an existing agreement PDF to merge with
                  if (previewMottakskontrollCar.agreementPdfPath) {
                    // Fetch the existing agreement PDF from storage
                    const { data: agreementPdfData, error: fetchError } = await supabase.storage
                      .from('agreement-pdfs')
                      .download(previewMottakskontrollCar.agreementPdfPath);
                    
                    if (fetchError) {
                      console.error('Error fetching agreement PDF:', fetchError);
                      throw fetchError;
                    }
                    
                    const agreementArrayBuffer = await agreementPdfData.arrayBuffer();
                    
                    // Merge the PDFs: Agreement first, then Mottakskontroll
                    const agreementPdf = await PDFDocument.load(agreementArrayBuffer);
                    const mottakskontrollPdf = await PDFDocument.load(mottakskontrollArrayBuffer);
                    
                    const mergedPdf = await PDFDocument.create();
                    
                    // Copy all pages from agreement PDF
                    const agreementPages = await mergedPdf.copyPages(agreementPdf, agreementPdf.getPageIndices());
                    agreementPages.forEach(page => mergedPdf.addPage(page));
                    
                    // Copy all pages from mottakskontroll PDF
                    const mottakskontrollPages = await mergedPdf.copyPages(mottakskontrollPdf, mottakskontrollPdf.getPageIndices());
                    mottakskontrollPages.forEach(page => mergedPdf.addPage(page));
                    
                    mergedPdfBytes = await mergedPdf.save();
                    
                    // Delete the old PDF file
                    await supabase.storage
                      .from('agreement-pdfs')
                      .remove([previewMottakskontrollCar.agreementPdfPath]);
                  } else {
                    // No existing agreement, just use the mottakskontroll PDF
                    mergedPdfBytes = new Uint8Array(mottakskontrollArrayBuffer);
                  }
                  
                  // Upload the merged PDF with a new filename
                  const fileName = `${previewMottakskontrollCar.regNumber}_merged_${Date.now()}.pdf`;
                  const { error: uploadError } = await supabase.storage
                    .from('agreement-pdfs')
                    .upload(fileName, mergedPdfBytes, {
                      contentType: 'application/pdf',
                      upsert: false
                    });
                  
                  if (uploadError) throw uploadError;
                  
                  // Save to database with updated status and new PDF path
                  const { error } = await supabase
                    .from('mottakskontroll')
                    .update({
                      status: 'Avtale signert og mottakskontroll utført',
                      mottakskontroll_data: mottakskontrollChecklist,
                      agreement_pdf_path: fileName,
                    })
                    .eq('id', previewMottakskontrollCar.id);

                  if (error) throw error;

                  // Update local state - move from mottakskontroll to tilstandskontroll
                  setMottakskontrollCars(prev => prev.map(c => 
                    c.id === previewMottakskontrollCar.id 
                      ? {...c, status: 'Avtale signert og mottakskontroll utført', mottakskontrollData: mottakskontrollChecklist, agreementPdfPath: fileName}
                      : c
                  ));
                  
                  setExpandedMottakskontrollId(null);
                  setShowMottakskontrollPreview(false);
                  if (mottakskontrollPdfUrl) {
                    URL.revokeObjectURL(mottakskontrollPdfUrl);
                    setMottakskontrollPdfUrl(null);
                  }
                  setPreviewMottakskontrollCar(null);
                  
                  toast({
                    title: "Mottakskontroll lagret",
                    description: `${previewMottakskontrollCar.regNumber} er nå klar for tilstandskontroll`,
                  });
                  
                  // Switch to tilstandskontroll tab
                  setActiveTab('tilstandskontroll');
                } catch (error: any) {
                  console.error('Error updating mottakskontroll:', error);
                  toast({
                    title: "Feil",
                    description: "Kunne ikke lagre mottakskontroll",
                    variant: "destructive",
                  });
                }
              }}
            >
              Lagre mottakskontroll som vedlegg til avtale
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Agreement PDF Preview Dialog (from Mottakskontroll) */}
      <Dialog open={showAgreementPreview} onOpenChange={(open) => {
        if (!open) {
          setShowAgreementPreview(false);
          if (agreementPreviewPdfUrl) {
            URL.revokeObjectURL(agreementPreviewPdfUrl);
            setAgreementPreviewPdfUrl(null);
          }
          setAgreementPreviewCar(null);
        }
      }}>
        <DialogContent className="max-w-4xl h-[85vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>
              Innkjøpsavtale - {agreementPreviewCar?.regNumber} {agreementPreviewCar?.make} {agreementPreviewCar?.model}
            </DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-auto min-h-0">
            {agreementPreviewPdfUrl && (
              <iframe
                src={agreementPreviewPdfUrl}
                className="w-full h-full border-0"
                title="Avtale PDF"
              />
            )}
          </div>
          <div className="flex gap-3 pt-4 border-t">
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={() => {
                setShowAgreementPreview(false);
                if (agreementPreviewPdfUrl) {
                  URL.revokeObjectURL(agreementPreviewPdfUrl);
                  setAgreementPreviewPdfUrl(null);
                }
                setAgreementPreviewCar(null);
              }}
            >
              Lukk
            </Button>
          </div>
        </DialogContent>
      </Dialog>


      </div>
    </div>
  );
}
