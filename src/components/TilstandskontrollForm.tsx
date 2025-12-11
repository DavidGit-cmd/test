import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { ChevronDown, ChevronUp, Camera, Upload, X } from "lucide-react";

type CheckValue = '' | 'ok' | 'feil';

interface ItemPhoto {
  itemId: string;
  itemLabel: string;
  section: 'provekjoring' | 'verktoyNedutstyr' | 'bilIFullHoyde';
  dataUrl: string;
}

interface TilstandskontrollChecklistItem {
  id: string;
  label: string;
  value: CheckValue;
  anmerkning: string;
  photos?: string[];
}

interface TilstandskontrollFormProps {
  car: {
    regNumber: string;
    make: string;
    model: string;
    year?: number;
    seller?: string;
  };
  onComplete: (data: TilstandskontrollData) => void;
  onCancel: () => void;
}

export interface TilstandskontrollData {
  kjoretoy: {
    merke: string;
    modell: string;
    regNr: string;
    chassisNr: string;
    kmStand: string;
  };
  egendefinert: {
    kjoretoyKjopt: 'ny' | 'brukt' | '';
    vedlikeholdUtfort: 'merkeverksted' | 'verksted' | 'annet' | '';
  };
  intervaller: {
    registerreimSisteKm: string;
    registerreimNesteKm: string;
    serviceSisteKm: string;
    serviceNesteKm: string;
  };
  opplysninger: {
    antallNokler: string;
    antallLadekabler: string;
    periodiskKontroll: string;
    salgskode: string;
    bruktImport: 'ja' | 'nei' | '';
    skjulRegNr: 'ja' | 'nei' | '';
    komplettServicehistorikk: 'ja' | 'nei' | 'ikke_kontrollert' | '';
  };
  provekjoring: TilstandskontrollChecklistItem[];
  verktoyNedutstyr: TilstandskontrollChecklistItem[];
  bilIFullHoyde: TilstandskontrollChecklistItem[];
  photos: ItemPhoto[];
  hjul: {
    sommerhjul: {
      ok: CheckValue;
      anmerkning: string;
      vf: { dot: string; monsterdybde: string; dimensjon: string };
      vb: { dot: string; monsterdybde: string; dimensjon: string };
      hf: { dot: string; monsterdybde: string; dimensjon: string };
      hb: { dot: string; monsterdybde: string; dimensjon: string };
    };
    vinterhjul: {
      ok: CheckValue;
      anmerkning: string;
      vf: { dot: string; monsterdybde: string; dimensjon: string };
      vb: { dot: string; monsterdybde: string; dimensjon: string };
      hf: { dot: string; monsterdybde: string; dimensjon: string };
      hb: { dot: string; monsterdybde: string; dimensjon: string };
    };
  };
  bremser: {
    bremseklosser: CheckValue;
    bremseklosserAnmerkning: string;
    bremseskiver: CheckValue;
    bremseskiverAnmerkning: string;
    bremseskiverVf: { minTykkelse: string; anmerkning: string };
    bremseskiverVb: { minTykkelse: string; anmerkning: string };
    bremseskiverHf: { minTykkelse: string; anmerkning: string };
    bremseskiverHb: { minTykkelse: string; anmerkning: string };
  };
  signatur: {
    kontaktperson: string;
    sted: string;
    dato: string;
  };
  generelleAnmerkninger: string;
}

const initialProvekjoringItems: TilstandskontrollChecklistItem[] = [
  { id: 'diagnose', label: '1. Diagnose', value: '', anmerkning: '', photos: [] },
  { id: 'opplysninger', label: '2. Opplysninger', value: '', anmerkning: '', photos: [] },
  { id: 'ovrigUtstyr', label: '3. Øvrig utstyr/klargjøring', value: '', anmerkning: '', photos: [] },
  { id: 'annet', label: '4. Annet', value: '', anmerkning: '', photos: [] },
  { id: 'ulyder', label: '5. Ulyder', value: '', anmerkning: '', photos: [] },
  { id: 'provekjort', label: '6. Prøvekjørt', value: '', anmerkning: '', photos: [] },
  { id: 'foreUnderlag', label: '7. Føre/Underlag', value: '', anmerkning: '', photos: [] },
  { id: 'maxHastighet', label: '8. Max hastighet', value: '', anmerkning: '', photos: [] },
  { id: 'uteTemperatur', label: '9. Ute temperatur', value: '', anmerkning: '', photos: [] },
  { id: 'vibrasjoner', label: '10. Vibrasjoner', value: '', anmerkning: '', photos: [] },
  { id: 'ovrigeFeil', label: '11. Øvrige feil', value: '', anmerkning: '', photos: [] },
  { id: 'vinduspussere', label: '12. Vinduspussere/-spyler', value: '', anmerkning: '', photos: [] },
  { id: 'setevarmer', label: '13. Setevarmer', value: '', anmerkning: '', photos: [] },
  { id: 'klima', label: '14. Klima', value: '', anmerkning: '', photos: [] },
  { id: 'kamera', label: '15. Kamera', value: '', anmerkning: '', photos: [] },
  { id: 'systemfunksjoner', label: '16. Systemfunksjoner', value: '', anmerkning: '', photos: [] },
  { id: 'sensor', label: '17. Sensor', value: '', anmerkning: '', photos: [] },
  { id: 'trekkraft', label: '18. Trekkraft', value: '', anmerkning: '', photos: [] },
  { id: 'rettstabilitet', label: '19. Rettstabilitet', value: '', anmerkning: '', photos: [] },
  { id: 'bremsefunksjon', label: '20. Bremsefunksjon', value: '', anmerkning: '', photos: [] },
  { id: 'parkeringsbrems', label: '21. Parkeringsbrems', value: '', anmerkning: '', photos: [] },
  { id: 'bremsekraftforsterker', label: '22. Bremsekraftforsterker', value: '', anmerkning: '', photos: [] },
  { id: 'identitet', label: '23. Identitet', value: '', anmerkning: '', photos: [] },
  { id: 'understellsnummer', label: '24. Understellsnummer', value: '', anmerkning: '', photos: [] },
  { id: 'dokumentasjon', label: '25. Dokumentasjon utstyr/godkjenning', value: '', anmerkning: '', photos: [] },
  { id: 'service', label: '26. Service', value: '', anmerkning: '', photos: [] },
  { id: 'nokler', label: '27. Nøkler', value: '', anmerkning: '', photos: [] },
  { id: 'lakk', label: '28. Lakk', value: '', anmerkning: '', photos: [] },
  { id: 'speil', label: '29. Speil', value: '', anmerkning: '', photos: [] },
];

const initialVerktoyItems: TilstandskontrollChecklistItem[] = [
  { id: 'doropning', label: '30. Døråpning', value: '', anmerkning: '', photos: [] },
  { id: 'frontvindu', label: '31. Frontvindu', value: '', anmerkning: '', photos: [] },
  { id: 'vinduer', label: '32. Vinduer', value: '', anmerkning: '', photos: [] },
  { id: 'lysForan', label: '33. Lys foran', value: '', anmerkning: '', photos: [] },
  { id: 'lysBak', label: '34. Lys bak', value: '', anmerkning: '', photos: [] },
  { id: 'refleks', label: '35. Refleks', value: '', anmerkning: '', photos: [] },
  { id: 'andreLys', label: '36. Andre lys', value: '', anmerkning: '', photos: [] },
  { id: 'avgass', label: '37. Avgass', value: '', anmerkning: '', photos: [] },
  { id: 'batteri', label: '38. Batteri(er)', value: '', anmerkning: '', photos: [] },
  { id: 'tenningsanlegg', label: '39. Tenningsanlegg', value: '', anmerkning: '', photos: [] },
  { id: 'dynamoLading', label: '40. Dynamo/lading', value: '', anmerkning: '', photos: [] },
  { id: 'oljeniva', label: '41. Oljenivå/røykutslipp', value: '', anmerkning: '', photos: [] },
  { id: 'bremseveske', label: '42. Bremsevæske', value: '', anmerkning: '', photos: [] },
  { id: 'dashbord', label: '43. Dashbord', value: '', anmerkning: '', photos: [] },
  { id: 'instrumenter', label: '44. Instrumenter og brytere', value: '', anmerkning: '', photos: [] },
  { id: 'midtkonsoll', label: '45. Midtkonsoll/midtarmlene', value: '', anmerkning: '', photos: [] },
  { id: 'dortrekk', label: '46. Dørtrekk', value: '', anmerkning: '', photos: [] },
  { id: 'seter', label: '47. Seter', value: '', anmerkning: '', photos: [] },
  { id: 'taktrekk', label: '48. Taktrekk', value: '', anmerkning: '', photos: [] },
  { id: 'tepperBekledning', label: '49. Tepper/bekledning', value: '', anmerkning: '', photos: [] },
  { id: 'vindusheiser', label: '50. Vindusheiser', value: '', anmerkning: '', photos: [] },
  { id: 'bilbelte', label: '51. Bilbelte', value: '', anmerkning: '', photos: [] },
  { id: 'varmeAcKlima', label: '52. Varme/AC/Klima', value: '', anmerkning: '', photos: [] },
  { id: 'signalhorn', label: '53. Signalhorn/lydsignal', value: '', anmerkning: '', photos: [] },
  { id: 'multimedia', label: '54. Multimedia', value: '', anmerkning: '', photos: [] },
  { id: 'multifunksjonsratt', label: '55. Multifunksjonsratt', value: '', anmerkning: '', photos: [] },
  { id: 'deksel', label: '56. Deksel', value: '', anmerkning: '', photos: [] },
  { id: 'tilhengerfeste', label: '57. Tilhengerfeste', value: '', anmerkning: '', photos: [] },
];

const initialBilIFullHoydeItems: TilstandskontrollChecklistItem[] = [
  { id: 'drivstoffanlegg', label: '58. Drivstoffanlegg/-ledninger', value: '', anmerkning: '', photos: [] },
  { id: 'eksosanlegg', label: '59. Eksosanlegg', value: '', anmerkning: '', photos: [] },
  { id: 'kjolesystem', label: '60. Kjølesystem/vannpumpe', value: '', anmerkning: '', photos: [] },
  { id: 'motor', label: '61. Motor', value: '', anmerkning: '', photos: [] },
  { id: 'motorfester', label: '62. Motorfester/-demper', value: '', anmerkning: '', photos: [] },
  { id: 'startmotor', label: '63. Startmotor', value: '', anmerkning: '', photos: [] },
  { id: 'turbo', label: '64. Turbo', value: '', anmerkning: '', photos: [] },
  { id: 'registerreim', label: '65. Registerreim', value: '', anmerkning: '', photos: [] },
  { id: 'ratt', label: '66. Ratt/styringsmekanisme', value: '', anmerkning: '', photos: [] },
  { id: 'stabilisatorer', label: '67. Stabilisatorer/stag', value: '', anmerkning: '', photos: [] },
  { id: 'forstilling', label: '68. Forstilling', value: '', anmerkning: '', photos: [] },
  { id: 'bakstilling', label: '69. Bakstilling', value: '', anmerkning: '', photos: [] },
  { id: 'korrosjon', label: '70. Korrosjon', value: '', anmerkning: '', photos: [] },
  { id: 'antirust', label: '71. Antirustbehandling', value: '', anmerkning: '', photos: [] },
  { id: 'lekkasjer', label: '72. Lekkasjer', value: '', anmerkning: '', photos: [] },
  { id: 'rorSlange', label: '73. Rør/slange', value: '', anmerkning: '', photos: [] },
  { id: 'bremseskjold', label: '74. Bremseskjold', value: '', anmerkning: '', photos: [] },
  { id: 'girkasse', label: '75. Girkasse', value: '', anmerkning: '', photos: [] },
  { id: 'differensial', label: '76. Differensial', value: '', anmerkning: '', photos: [] },
  { id: 'clutch', label: '77. Clutch/kobling/svinghjul', value: '', anmerkning: '', photos: [] },
  { id: 'aksler', label: '78. Aksler', value: '', anmerkning: '', photos: [] },
  { id: 'fordelingskasse', label: '79. Fordelingskasse', value: '', anmerkning: '', photos: [] },
  { id: 'hjulmuttere', label: '82. Hjulmuttere/-bolter', value: '', anmerkning: '', photos: [] },
  { id: 'hjullager', label: '83. Hjullager', value: '', anmerkning: '', photos: [] },
  { id: 'fjarer', label: '84. Fjærer/støtdemper', value: '', anmerkning: '', photos: [] },
  { id: 'ledd', label: '85. Ledd', value: '', anmerkning: '', photos: [] },
];

const initialData: TilstandskontrollData = {
  kjoretoy: { merke: '', modell: '', regNr: '', chassisNr: '', kmStand: '' },
  egendefinert: { kjoretoyKjopt: '', vedlikeholdUtfort: '' },
  intervaller: { registerreimSisteKm: '', registerreimNesteKm: '', serviceSisteKm: '', serviceNesteKm: '' },
  opplysninger: { antallNokler: '', antallLadekabler: '', periodiskKontroll: '', salgskode: '', bruktImport: '', skjulRegNr: '', komplettServicehistorikk: '' },
  provekjoring: initialProvekjoringItems,
  verktoyNedutstyr: initialVerktoyItems,
  bilIFullHoyde: initialBilIFullHoydeItems,
  photos: [],
  hjul: {
    sommerhjul: {
      ok: '',
      anmerkning: '',
      vf: { dot: '', monsterdybde: '', dimensjon: '' },
      vb: { dot: '', monsterdybde: '', dimensjon: '' },
      hf: { dot: '', monsterdybde: '', dimensjon: '' },
      hb: { dot: '', monsterdybde: '', dimensjon: '' },
    },
    vinterhjul: {
      ok: '',
      anmerkning: '',
      vf: { dot: '', monsterdybde: '', dimensjon: '' },
      vb: { dot: '', monsterdybde: '', dimensjon: '' },
      hf: { dot: '', monsterdybde: '', dimensjon: '' },
      hb: { dot: '', monsterdybde: '', dimensjon: '' },
    },
  },
  bremser: {
    bremseklosser: '',
    bremseklosserAnmerkning: '',
    bremseskiver: '',
    bremseskiverAnmerkning: '',
    bremseskiverVf: { minTykkelse: '', anmerkning: '' },
    bremseskiverVb: { minTykkelse: '', anmerkning: '' },
    bremseskiverHf: { minTykkelse: '', anmerkning: '' },
    bremseskiverHb: { minTykkelse: '', anmerkning: '' },
  },
  signatur: { kontaktperson: '', sted: '', dato: '' },
  generelleAnmerkninger: '',
};

export function TilstandskontrollForm({ car, onComplete, onCancel }: TilstandskontrollFormProps) {
  const [data, setData] = useState<TilstandskontrollData>(() => ({
    ...initialData,
    kjoretoy: {
      ...initialData.kjoretoy,
      merke: car.make,
      modell: car.model,
      regNr: car.regNumber,
    },
    signatur: {
      ...initialData.signatur,
      dato: new Date().toLocaleDateString('no-NO'),
    },
  }));

  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['kjoretoy']));
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const uploadInputRef = useRef<HTMLInputElement>(null);
  const [activePhotoItem, setActivePhotoItem] = useState<{ section: 'provekjoring' | 'verktoyNedutstyr' | 'bilIFullHoyde'; itemId: string; itemLabel: string } | null>(null);

  const toggleSection = (section: string) => {
    setExpandedSections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(section)) {
        newSet.delete(section);
      } else {
        newSet.add(section);
      }
      return newSet;
    });
  };

  const handlePhotoCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0] || !activePhotoItem) return;
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      const dataUrl = reader.result as string;
      setData(prev => ({
        ...prev,
        photos: [...prev.photos, {
          itemId: activePhotoItem.itemId,
          itemLabel: activePhotoItem.itemLabel,
          section: activePhotoItem.section,
          dataUrl
        }]
      }));
      setActivePhotoItem(null);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const removePhoto = (index: number) => {
    setData(prev => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index)
    }));
  };

  const triggerCamera = (section: 'provekjoring' | 'verktoyNedutstyr' | 'bilIFullHoyde', itemId: string, itemLabel: string) => {
    setActivePhotoItem({ section, itemId, itemLabel });
    cameraInputRef.current?.click();
  };

  const triggerUpload = (section: 'provekjoring' | 'verktoyNedutstyr' | 'bilIFullHoyde', itemId: string, itemLabel: string) => {
    setActivePhotoItem({ section, itemId, itemLabel });
    uploadInputRef.current?.click();
  };

  const updateChecklistItem = (
    section: 'provekjoring' | 'verktoyNedutstyr' | 'bilIFullHoyde',
    id: string,
    field: 'value' | 'anmerkning',
    value: string
  ) => {
    setData(prev => ({
      ...prev,
      [section]: prev[section].map(item =>
        item.id === id ? { ...item, [field]: value } : item
      ),
    }));
  };

  const renderChecklistItem = (
    item: TilstandskontrollChecklistItem,
    section: 'provekjoring' | 'verktoyNedutstyr' | 'bilIFullHoyde'
  ) => {
    const photoCount = data.photos.filter(p => p.itemId === item.id && p.section === section).length;
    return (
      <div key={item.id} className="grid grid-cols-12 gap-2 items-center py-2 border-b border-muted/50 last:border-b-0">
        <div className="col-span-3">
          <span className="text-sm">{item.label}</span>
        </div>
        <div className="col-span-2 flex gap-1">
          <Button
            type="button"
            size="sm"
            variant={item.value === 'ok' ? 'default' : 'outline'}
            className={`text-xs h-7 w-10 ${item.value === 'ok' ? 'bg-green-600 hover:bg-green-700' : ''}`}
            onClick={() => updateChecklistItem(section, item.id, 'value', 'ok')}
          >
            Ok
          </Button>
          <Button
            type="button"
            size="sm"
            variant={item.value === 'feil' ? 'default' : 'outline'}
            className={`text-xs h-7 w-10 ${item.value === 'feil' ? 'bg-destructive hover:bg-destructive/90' : ''}`}
            onClick={() => updateChecklistItem(section, item.id, 'value', 'feil')}
          >
            Feil
          </Button>
        </div>
        <div className="col-span-4">
          <Input
            placeholder="Anmerkning..."
            value={item.anmerkning}
            onChange={(e) => updateChecklistItem(section, item.id, 'anmerkning', e.target.value)}
            className="text-xs h-7"
          />
        </div>
        <div className="col-span-3 flex gap-1 items-center justify-end">
          <Button
            type="button"
            size="sm"
            variant="ghost"
            className="h-7 w-7 p-0"
            onClick={() => triggerCamera(section, item.id, item.label)}
            title="Ta bilde"
          >
            <Camera className="h-4 w-4 text-muted-foreground hover:text-foreground" />
          </Button>
          <Button
            type="button"
            size="sm"
            variant="ghost"
            className="h-7 w-7 p-0"
            onClick={() => triggerUpload(section, item.id, item.label)}
            title="Last opp bilde"
          >
            <Upload className="h-4 w-4 text-muted-foreground hover:text-foreground" />
          </Button>
          {photoCount > 0 && (
            <span className="text-xs bg-primary text-primary-foreground rounded-full px-1.5 py-0.5 min-w-[18px] text-center">
              {photoCount}
            </span>
          )}
        </div>
      </div>
    );
  };

  const renderSectionHeader = (title: string, sectionKey: string, itemCount?: number) => (
    <button
      type="button"
      onClick={() => toggleSection(sectionKey)}
      className="w-full flex items-center justify-between p-3 bg-muted/50 hover:bg-muted/70 rounded-lg transition-colors"
    >
      <div className="flex items-center gap-2">
        <h4 className="font-semibold text-sm">{title}</h4>
        {itemCount !== undefined && (
          <span className="text-xs text-muted-foreground">({itemCount} punkter)</span>
        )}
      </div>
      {expandedSections.has(sectionKey) ? (
        <ChevronUp className="h-4 w-4 text-muted-foreground" />
      ) : (
        <ChevronDown className="h-4 w-4 text-muted-foreground" />
      )}
    </button>
  );

  const handleSubmit = () => {
    onComplete(data);
  };

  return (
    <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
      {/* Hidden file inputs */}
      <input
        type="file"
        ref={cameraInputRef}
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={handlePhotoCapture}
      />
      <input
        type="file"
        ref={uploadInputRef}
        accept="image/*"
        className="hidden"
        onChange={handlePhotoCapture}
      />
      {/* Kjøretøy Section */}
      <Card>
        {renderSectionHeader('Kjøretøyet', 'kjoretoy')}
        {expandedSections.has('kjoretoy') && (
          <CardContent className="pt-4">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="space-y-1">
                <Label className="text-xs">Merke</Label>
                <Input
                  value={data.kjoretoy.merke}
                  onChange={(e) => setData(prev => ({ ...prev, kjoretoy: { ...prev.kjoretoy, merke: e.target.value } }))}
                  className="h-8"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Modell</Label>
                <Input
                  value={data.kjoretoy.modell}
                  onChange={(e) => setData(prev => ({ ...prev, kjoretoy: { ...prev.kjoretoy, modell: e.target.value } }))}
                  className="h-8"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Reg. nr.</Label>
                <Input
                  value={data.kjoretoy.regNr}
                  onChange={(e) => setData(prev => ({ ...prev, kjoretoy: { ...prev.kjoretoy, regNr: e.target.value } }))}
                  className="h-8"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Chassisnr.</Label>
                <Input
                  value={data.kjoretoy.chassisNr}
                  onChange={(e) => setData(prev => ({ ...prev, kjoretoy: { ...prev.kjoretoy, chassisNr: e.target.value } }))}
                  className="h-8"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Km.stand</Label>
                <Input
                  value={data.kjoretoy.kmStand}
                  onChange={(e) => setData(prev => ({ ...prev, kjoretoy: { ...prev.kjoretoy, kmStand: e.target.value } }))}
                  className="h-8"
                />
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Egendefinerte opplysninger */}
      <Card>
        {renderSectionHeader('Egendefinerte opplysninger', 'egendefinert')}
        {expandedSections.has('egendefinert') && (
          <CardContent className="pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs">Kjøretøyet er kjøpt</Label>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    size="sm"
                    variant={data.egendefinert.kjoretoyKjopt === 'ny' ? 'default' : 'outline'}
                    onClick={() => setData(prev => ({ ...prev, egendefinert: { ...prev.egendefinert, kjoretoyKjopt: 'ny' } }))}
                    className="text-xs h-7"
                  >
                    Ny
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant={data.egendefinert.kjoretoyKjopt === 'brukt' ? 'default' : 'outline'}
                    onClick={() => setData(prev => ({ ...prev, egendefinert: { ...prev.egendefinert, kjoretoyKjopt: 'brukt' } }))}
                    className="text-xs h-7"
                  >
                    Brukt
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-xs">Vedlikehold er utført av</Label>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    size="sm"
                    variant={data.egendefinert.vedlikeholdUtfort === 'merkeverksted' ? 'default' : 'outline'}
                    onClick={() => setData(prev => ({ ...prev, egendefinert: { ...prev.egendefinert, vedlikeholdUtfort: 'merkeverksted' } }))}
                    className="text-xs h-7"
                  >
                    Merkeverksted
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant={data.egendefinert.vedlikeholdUtfort === 'verksted' ? 'default' : 'outline'}
                    onClick={() => setData(prev => ({ ...prev, egendefinert: { ...prev.egendefinert, vedlikeholdUtfort: 'verksted' } }))}
                    className="text-xs h-7"
                  >
                    Verksted
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant={data.egendefinert.vedlikeholdUtfort === 'annet' ? 'default' : 'outline'}
                    onClick={() => setData(prev => ({ ...prev, egendefinert: { ...prev.egendefinert, vedlikeholdUtfort: 'annet' } }))}
                    className="text-xs h-7"
                  >
                    Annet
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Intervallstyrte arbeider */}
      <Card>
        {renderSectionHeader('Intervallstyrte arbeider', 'intervaller')}
        {expandedSections.has('intervaller') && (
          <CardContent className="pt-4">
            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-4 text-xs font-medium text-muted-foreground border-b pb-2">
                <span>Arbeid</span>
                <span>Siste foretatt</span>
                <span>Neste intervall/bytte</span>
              </div>
              <div className="grid grid-cols-3 gap-4 items-center">
                <span className="text-sm">Registerreim skift</span>
                <Input
                  placeholder="Km"
                  value={data.intervaller.registerreimSisteKm}
                  onChange={(e) => setData(prev => ({ ...prev, intervaller: { ...prev.intervaller, registerreimSisteKm: e.target.value } }))}
                  className="h-7 text-xs"
                />
                <Input
                  placeholder="Km"
                  value={data.intervaller.registerreimNesteKm}
                  onChange={(e) => setData(prev => ({ ...prev, intervaller: { ...prev.intervaller, registerreimNesteKm: e.target.value } }))}
                  className="h-7 text-xs"
                />
              </div>
              <div className="grid grid-cols-3 gap-4 items-center">
                <span className="text-sm">Service</span>
                <Input
                  placeholder="Km"
                  value={data.intervaller.serviceSisteKm}
                  onChange={(e) => setData(prev => ({ ...prev, intervaller: { ...prev.intervaller, serviceSisteKm: e.target.value } }))}
                  className="h-7 text-xs"
                />
                <Input
                  placeholder="Km"
                  value={data.intervaller.serviceNesteKm}
                  onChange={(e) => setData(prev => ({ ...prev, intervaller: { ...prev.intervaller, serviceNesteKm: e.target.value } }))}
                  className="h-7 text-xs"
                />
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Opplysninger */}
      <Card>
        {renderSectionHeader('Opplysninger', 'opplysninger')}
        {expandedSections.has('opplysninger') && (
          <CardContent className="pt-4">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="space-y-1">
                <Label className="text-xs">Nøkler antall</Label>
                <Input
                  value={data.opplysninger.antallNokler}
                  onChange={(e) => setData(prev => ({ ...prev, opplysninger: { ...prev.opplysninger, antallNokler: e.target.value } }))}
                  className="h-8"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Antall ladekabler</Label>
                <Input
                  value={data.opplysninger.antallLadekabler}
                  onChange={(e) => setData(prev => ({ ...prev, opplysninger: { ...prev.opplysninger, antallLadekabler: e.target.value } }))}
                  className="h-8"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Periodisk kjøretøykontroll</Label>
                <Input
                  placeholder="MM/YYYY"
                  value={data.opplysninger.periodiskKontroll}
                  onChange={(e) => setData(prev => ({ ...prev, opplysninger: { ...prev.opplysninger, periodiskKontroll: e.target.value } }))}
                  className="h-8"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs">Brukt import</Label>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    size="sm"
                    variant={data.opplysninger.bruktImport === 'ja' ? 'default' : 'outline'}
                    onClick={() => setData(prev => ({ ...prev, opplysninger: { ...prev.opplysninger, bruktImport: 'ja' } }))}
                    className="text-xs h-7 w-12"
                  >
                    Ja
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant={data.opplysninger.bruktImport === 'nei' ? 'default' : 'outline'}
                    onClick={() => setData(prev => ({ ...prev, opplysninger: { ...prev.opplysninger, bruktImport: 'nei' } }))}
                    className="text-xs h-7 w-12"
                  >
                    Nei
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-xs">Komplett servicehistorikk</Label>
                <div className="flex gap-2 flex-wrap">
                  <Button
                    type="button"
                    size="sm"
                    variant={data.opplysninger.komplettServicehistorikk === 'ja' ? 'default' : 'outline'}
                    onClick={() => setData(prev => ({ ...prev, opplysninger: { ...prev.opplysninger, komplettServicehistorikk: 'ja' } }))}
                    className="text-xs h-7"
                  >
                    Ja
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant={data.opplysninger.komplettServicehistorikk === 'nei' ? 'default' : 'outline'}
                    onClick={() => setData(prev => ({ ...prev, opplysninger: { ...prev.opplysninger, komplettServicehistorikk: 'nei' } }))}
                    className="text-xs h-7"
                  >
                    Nei
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant={data.opplysninger.komplettServicehistorikk === 'ikke_kontrollert' ? 'default' : 'outline'}
                    onClick={() => setData(prev => ({ ...prev, opplysninger: { ...prev.opplysninger, komplettServicehistorikk: 'ikke_kontrollert' } }))}
                    className="text-xs h-7"
                  >
                    Ikke kontrollert
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Prøvekjøring / Generelt */}
      <Card>
        {renderSectionHeader('Prøvekjøring / Generelt', 'provekjoring', data.provekjoring.length)}
        {expandedSections.has('provekjoring') && (
          <CardContent className="pt-4">
            <div className="space-y-1">
              {data.provekjoring.map((item) => renderChecklistItem(item, 'provekjoring'))}
            </div>
          </CardContent>
        )}
      </Card>

      {/* Verktøy/Nedutstyr */}
      <Card>
        {renderSectionHeader('Verktøy / Nedutstyr', 'verktoy', data.verktoyNedutstyr.length)}
        {expandedSections.has('verktoy') && (
          <CardContent className="pt-4">
            <div className="space-y-1">
              {data.verktoyNedutstyr.map((item) => renderChecklistItem(item, 'verktoyNedutstyr'))}
            </div>
          </CardContent>
        )}
      </Card>

      {/* Bil i full høyde */}
      <Card>
        {renderSectionHeader('Bil i full høyde', 'fullhoyde', data.bilIFullHoyde.length)}
        {expandedSections.has('fullhoyde') && (
          <CardContent className="pt-4">
            <div className="space-y-1">
              {data.bilIFullHoyde.map((item) => renderChecklistItem(item, 'bilIFullHoyde'))}
            </div>
          </CardContent>
        )}
      </Card>

      {/* Hjul */}
      <Card>
        {renderSectionHeader('Hjul', 'hjul')}
        {expandedSections.has('hjul') && (
          <CardContent className="pt-4 space-y-6">
            {/* Sommerhjul */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="font-medium">80. Sommerhjul</Label>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    size="sm"
                    variant={data.hjul.sommerhjul.ok === 'ok' ? 'default' : 'outline'}
                    className={`text-xs h-7 w-12 ${data.hjul.sommerhjul.ok === 'ok' ? 'bg-green-600 hover:bg-green-700' : ''}`}
                    onClick={() => setData(prev => ({ ...prev, hjul: { ...prev.hjul, sommerhjul: { ...prev.hjul.sommerhjul, ok: 'ok' } } }))}
                  >
                    Ok
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant={data.hjul.sommerhjul.ok === 'feil' ? 'default' : 'outline'}
                    className={`text-xs h-7 w-12 ${data.hjul.sommerhjul.ok === 'feil' ? 'bg-destructive hover:bg-destructive/90' : ''}`}
                    onClick={() => setData(prev => ({ ...prev, hjul: { ...prev.hjul, sommerhjul: { ...prev.hjul.sommerhjul, ok: 'feil' } } }))}
                  >
                    Feil
                  </Button>
                </div>
              </div>
              <div className="grid grid-cols-4 gap-2 text-xs text-muted-foreground font-medium">
                <span></span>
                <span>DOT</span>
                <span>Mønsterdybde</span>
                <span>Dimensjon</span>
              </div>
              {(['vf', 'vb', 'hf', 'hb'] as const).map((pos) => (
                <div key={pos} className="grid grid-cols-4 gap-2 items-center">
                  <span className="text-sm">Sommerhjul {pos.toUpperCase()}</span>
                  <Input
                    value={data.hjul.sommerhjul[pos].dot}
                    onChange={(e) => setData(prev => ({ ...prev, hjul: { ...prev.hjul, sommerhjul: { ...prev.hjul.sommerhjul, [pos]: { ...prev.hjul.sommerhjul[pos], dot: e.target.value } } } }))}
                    className="h-7 text-xs"
                  />
                  <Input
                    value={data.hjul.sommerhjul[pos].monsterdybde}
                    onChange={(e) => setData(prev => ({ ...prev, hjul: { ...prev.hjul, sommerhjul: { ...prev.hjul.sommerhjul, [pos]: { ...prev.hjul.sommerhjul[pos], monsterdybde: e.target.value } } } }))}
                    className="h-7 text-xs"
                  />
                  <Input
                    value={data.hjul.sommerhjul[pos].dimensjon}
                    onChange={(e) => setData(prev => ({ ...prev, hjul: { ...prev.hjul, sommerhjul: { ...prev.hjul.sommerhjul, [pos]: { ...prev.hjul.sommerhjul[pos], dimensjon: e.target.value } } } }))}
                    className="h-7 text-xs"
                  />
                </div>
              ))}
            </div>

            <Separator />

            {/* Vinterhjul */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="font-medium">81. Vinterhjul</Label>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    size="sm"
                    variant={data.hjul.vinterhjul.ok === 'ok' ? 'default' : 'outline'}
                    className={`text-xs h-7 w-12 ${data.hjul.vinterhjul.ok === 'ok' ? 'bg-green-600 hover:bg-green-700' : ''}`}
                    onClick={() => setData(prev => ({ ...prev, hjul: { ...prev.hjul, vinterhjul: { ...prev.hjul.vinterhjul, ok: 'ok' } } }))}
                  >
                    Ok
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant={data.hjul.vinterhjul.ok === 'feil' ? 'default' : 'outline'}
                    className={`text-xs h-7 w-12 ${data.hjul.vinterhjul.ok === 'feil' ? 'bg-destructive hover:bg-destructive/90' : ''}`}
                    onClick={() => setData(prev => ({ ...prev, hjul: { ...prev.hjul, vinterhjul: { ...prev.hjul.vinterhjul, ok: 'feil' } } }))}
                  >
                    Feil
                  </Button>
                </div>
              </div>
              <div className="grid grid-cols-4 gap-2 text-xs text-muted-foreground font-medium">
                <span></span>
                <span>DOT</span>
                <span>Mønsterdybde</span>
                <span>Dimensjon</span>
              </div>
              {(['vf', 'vb', 'hf', 'hb'] as const).map((pos) => (
                <div key={pos} className="grid grid-cols-4 gap-2 items-center">
                  <span className="text-sm">Vinterhjul {pos.toUpperCase()}</span>
                  <Input
                    value={data.hjul.vinterhjul[pos].dot}
                    onChange={(e) => setData(prev => ({ ...prev, hjul: { ...prev.hjul, vinterhjul: { ...prev.hjul.vinterhjul, [pos]: { ...prev.hjul.vinterhjul[pos], dot: e.target.value } } } }))}
                    className="h-7 text-xs"
                  />
                  <Input
                    value={data.hjul.vinterhjul[pos].monsterdybde}
                    onChange={(e) => setData(prev => ({ ...prev, hjul: { ...prev.hjul, vinterhjul: { ...prev.hjul.vinterhjul, [pos]: { ...prev.hjul.vinterhjul[pos], monsterdybde: e.target.value } } } }))}
                    className="h-7 text-xs"
                  />
                  <Input
                    value={data.hjul.vinterhjul[pos].dimensjon}
                    onChange={(e) => setData(prev => ({ ...prev, hjul: { ...prev.hjul, vinterhjul: { ...prev.hjul.vinterhjul, [pos]: { ...prev.hjul.vinterhjul[pos], dimensjon: e.target.value } } } }))}
                    className="h-7 text-xs"
                  />
                </div>
              ))}
            </div>
          </CardContent>
        )}
      </Card>

      {/* Bremser */}
      <Card>
        {renderSectionHeader('Bremser', 'bremser')}
        {expandedSections.has('bremser') && (
          <CardContent className="pt-4 space-y-4">
            <div className="grid grid-cols-12 gap-2 items-center">
              <span className="col-span-4 text-sm">86. Bremseklosser</span>
              <div className="col-span-3 flex gap-2">
                <Button
                  type="button"
                  size="sm"
                  variant={data.bremser.bremseklosser === 'ok' ? 'default' : 'outline'}
                  className={`text-xs h-7 w-12 ${data.bremser.bremseklosser === 'ok' ? 'bg-green-600 hover:bg-green-700' : ''}`}
                  onClick={() => setData(prev => ({ ...prev, bremser: { ...prev.bremser, bremseklosser: 'ok' } }))}
                >
                  Ok
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant={data.bremser.bremseklosser === 'feil' ? 'default' : 'outline'}
                  className={`text-xs h-7 w-12 ${data.bremser.bremseklosser === 'feil' ? 'bg-destructive hover:bg-destructive/90' : ''}`}
                  onClick={() => setData(prev => ({ ...prev, bremser: { ...prev.bremser, bremseklosser: 'feil' } }))}
                >
                  Feil
                </Button>
              </div>
              <div className="col-span-5">
                <Input
                  placeholder="Anmerkning..."
                  value={data.bremser.bremseklosserAnmerkning}
                  onChange={(e) => setData(prev => ({ ...prev, bremser: { ...prev.bremser, bremseklosserAnmerkning: e.target.value } }))}
                  className="text-xs h-7"
                />
              </div>
            </div>

            <div className="grid grid-cols-12 gap-2 items-center">
              <span className="col-span-4 text-sm">87. Bremseskiver</span>
              <div className="col-span-3 flex gap-2">
                <Button
                  type="button"
                  size="sm"
                  variant={data.bremser.bremseskiver === 'ok' ? 'default' : 'outline'}
                  className={`text-xs h-7 w-12 ${data.bremser.bremseskiver === 'ok' ? 'bg-green-600 hover:bg-green-700' : ''}`}
                  onClick={() => setData(prev => ({ ...prev, bremser: { ...prev.bremser, bremseskiver: 'ok' } }))}
                >
                  Ok
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant={data.bremser.bremseskiver === 'feil' ? 'default' : 'outline'}
                  className={`text-xs h-7 w-12 ${data.bremser.bremseskiver === 'feil' ? 'bg-destructive hover:bg-destructive/90' : ''}`}
                  onClick={() => setData(prev => ({ ...prev, bremser: { ...prev.bremser, bremseskiver: 'feil' } }))}
                >
                  Feil
                </Button>
              </div>
              <div className="col-span-5">
                <Input
                  placeholder="Anmerkning..."
                  value={data.bremser.bremseskiverAnmerkning}
                  onChange={(e) => setData(prev => ({ ...prev, bremser: { ...prev.bremser, bremseskiverAnmerkning: e.target.value } }))}
                  className="text-xs h-7"
                />
              </div>
            </div>

            <Separator />
            <div className="text-xs text-muted-foreground font-medium">Bremseskiver min. tykkelse</div>
            <div className="grid grid-cols-3 gap-3">
              {(['Vf', 'Vb', 'Hf', 'Hb'] as const).map((pos) => {
                const key = `bremseskiver${pos}` as keyof typeof data.bremser;
                const value = data.bremser[key] as { minTykkelse: string; anmerkning: string };
                return (
                  <div key={pos} className="space-y-1">
                    <Label className="text-xs">Bremseskiver {pos}</Label>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Min. tykkelse"
                        value={value.minTykkelse}
                        onChange={(e) => setData(prev => ({
                          ...prev,
                          bremser: {
                            ...prev.bremser,
                            [key]: { ...value, minTykkelse: e.target.value }
                          }
                        }))}
                        className="h-7 text-xs"
                      />
                      <Input
                        placeholder="Anmerkning"
                        value={value.anmerkning}
                        onChange={(e) => setData(prev => ({
                          ...prev,
                          bremser: {
                            ...prev.bremser,
                            [key]: { ...value, anmerkning: e.target.value }
                          }
                        }))}
                        className="h-7 text-xs"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        )}
      </Card>

      {/* Generelle anmerkninger */}
      <Card>
        {renderSectionHeader('Generelle anmerkninger', 'anmerkninger')}
        {expandedSections.has('anmerkninger') && (
          <CardContent className="pt-4">
            <Textarea
              placeholder="Eventuelle generelle anmerkninger..."
              value={data.generelleAnmerkninger}
              onChange={(e) => setData(prev => ({ ...prev, generelleAnmerkninger: e.target.value }))}
              rows={4}
            />
          </CardContent>
        )}
      </Card>

      {/* Bilder fra kontroll */}
      {data.photos.length > 0 && (
        <Card>
          {renderSectionHeader(`Bilder fra kontroll (${data.photos.length})`, 'bilder')}
          {expandedSections.has('bilder') && (
            <CardContent className="pt-4">
              <div className="space-y-4">
                {data.photos.map((photo, index) => (
                  <div key={index} className="border rounded-lg p-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{photo.itemLabel}</span>
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        className="h-7 w-7 p-0 text-destructive hover:text-destructive"
                        onClick={() => removePhoto(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    <img
                      src={photo.dataUrl}
                      alt={`Bilde for ${photo.itemLabel}`}
                      className="w-full max-w-md rounded-lg border"
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          )}
        </Card>
      )}

      {/* Signatur */}
      <Card>
        {renderSectionHeader('Signaturfelt', 'signatur')}
        {expandedSections.has('signatur') && (
          <CardContent className="pt-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1">
                <Label className="text-xs">Oppdragsgiver/kontaktperson</Label>
                <Input
                  value={data.signatur.kontaktperson}
                  onChange={(e) => setData(prev => ({ ...prev, signatur: { ...prev.signatur, kontaktperson: e.target.value } }))}
                  className="h-8"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Sted</Label>
                <Input
                  value={data.signatur.sted}
                  onChange={(e) => setData(prev => ({ ...prev, signatur: { ...prev.signatur, sted: e.target.value } }))}
                  className="h-8"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Dato</Label>
                <Input
                  value={data.signatur.dato}
                  onChange={(e) => setData(prev => ({ ...prev, signatur: { ...prev.signatur, dato: e.target.value } }))}
                  className="h-8"
                />
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Action buttons */}
      <div className="flex gap-3 pt-4 sticky bottom-0 bg-background pb-4 border-t pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="flex-1"
        >
          Avbryt
        </Button>
        <Button
          type="button"
          onClick={handleSubmit}
          className="flex-1 bg-button-teal hover:bg-button-teal/90"
        >
          Fullfør tilstandskontroll
        </Button>
      </div>
    </div>
  );
}
