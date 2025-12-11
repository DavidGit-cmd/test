import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { BarChart3, TrendingUp, TrendingDown, Car, ShoppingCart, Package, DollarSign, Building2, ChevronDown, ChevronUp, ArrowUpDown, ArrowUp, ArrowDown, Calendar, FileText, X, Printer, Download, Send } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";
import { toast } from "sonner";
// Months for 2026
const months2026 = [
  { value: "jan", label: "Januar 2026", index: 0 },
  { value: "feb", label: "Februar 2026", index: 1 },
  { value: "mar", label: "Mars 2026", index: 2 },
  { value: "apr", label: "April 2026", index: 3 },
  { value: "mai", label: "Mai 2026", index: 4 },
  { value: "jun", label: "Juni 2026", index: 5 },
  { value: "jul", label: "Juli 2026", index: 6 },
  { value: "aug", label: "August 2026", index: 7 },
  { value: "sep", label: "September 2026", index: 8 },
  { value: "okt", label: "Oktober 2026", index: 9 },
  { value: "nov", label: "November 2026", index: 10 },
  { value: "des", label: "Desember 2026", index: 11 },
];

// Company-specific innkjøpere
const innkjopereByCompany: Record<string, string[]> = {
  "rabb-auto": ["Ronny Bysveen", "Espen Thomassen", "Herman Haukaas"],
  "gangas-auto": ["Isak Hansen", "Gabriel Pettersen"],
  "hub-auto": ["Sebastian Aune Edvardsen", "Elias Vikesland", "Tord Andersen Sollesnes"],
};

// Combined innkjøpere for Superia Cars (all companies)
const allInnkjopere = [
  ...innkjopereByCompany["rabb-auto"],
  ...innkjopereByCompany["gangas-auto"],
  ...innkjopereByCompany["hub-auto"],
];

// Initial IB values for January 2026 and innkjøpere count
const companyConfig: Record<string, { initialIB: number; innkjopereCount: number; avgMargin: number }> = {
  "superia-cars": { initialIB: 200, innkjopereCount: 8, avgMargin: 22000 },
  "rabb-auto": { initialIB: 90, innkjopereCount: 3, avgMargin: 20000 },
  "gangas-auto": { initialIB: 60, innkjopereCount: 2, avgMargin: 21000 },
  "hub-auto": { initialIB: 50, innkjopereCount: 3, avgMargin: 23000 },
};

// Seeded random for consistent "random" values
const seededRandom = (seed: number) => {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
};

// Generate per-innkjøper purchases for a month
const generateInnkjoperPurchases = (companyKey: string, monthIndex: number): Array<{ name: string; cars: number }> => {
  const innkjopere = companyKey === "superia-cars" ? allInnkjopere : (innkjopereByCompany[companyKey] || []);
  
  return innkjopere.map((name, j) => {
    const cars = 9 + Math.floor(seededRandom(monthIndex * 100 + j + companyKey.length) * 7); // 9-15 range
    return { name, cars };
  });
};

// Generate monthly KPI data for a company for entire year
const generateYearlyData = (companyKey: string) => {
  const config = companyConfig[companyKey];
  const monthlyData: Array<{
    month: string;
    carsForSaleIB: number;
    totalPurchases: number;
    purchasesByInnkjoper: Array<{ name: string; cars: number }>;
    totalSales: number;
    carsForSaleUB: number;
    totalRevenue: number;
    avgDaysInStock: number;
  }> = [];

  let currentIB = config.initialIB;

  for (let i = 0; i < 12; i++) {
    // Generate per-innkjøper purchases
    const purchasesByInnkjoper = generateInnkjoperPurchases(companyKey, i);
    const purchases = purchasesByInnkjoper.reduce((sum, p) => sum + p.cars, 0);
    
    // Biler solgt = 20-25% of IB (use seeded random for consistency)
    const salePercentage = 0.20 + (seededRandom(i * 200 + companyKey.length) * 0.05);
    const sales = Math.round(currentIB * salePercentage);
    
    // UB = IB + Kjøpt - Solgt
    const currentUB = currentIB + purchases - sales;
    
    // Revenue based on sales and avg margin
    const revenue = sales * config.avgMargin;
    
    // Avg days in stock varies slightly
    const avgDays = 24 + Math.round(seededRandom(i * 50 + companyKey.length * 2) * 8);
    
    monthlyData.push({
      month: months2026[i].label,
      carsForSaleIB: currentIB,
      totalPurchases: purchases,
      purchasesByInnkjoper,
      totalSales: sales,
      carsForSaleUB: currentUB,
      totalRevenue: revenue,
      avgDaysInStock: avgDays,
    });
    
    // Next month's IB = this month's UB
    currentIB = currentUB;
  }

  return monthlyData;
};

// Pre-generate yearly data for all companies
const yearlyDataByCompany: Record<string, ReturnType<typeof generateYearlyData>> = {
  "superia-cars": generateYearlyData("superia-cars"),
  "rabb-auto": generateYearlyData("rabb-auto"),
  "gangas-auto": generateYearlyData("gangas-auto"),
  "hub-auto": generateYearlyData("hub-auto"),
};

const carTypeData = [
  { name: "SUV", value: 35, color: "#0088FE" },
  { name: "Sedan", value: 28, color: "#00C49F" },
  { name: "Kombi", value: 22, color: "#FFBB28" },
  { name: "Elektrisk", value: 15, color: "#FF8042" },
];

const recentTransactions = [
  { id: 1, type: "Salg", car: "Tesla Model 3 2023", amount: 485000, date: "2026-01-15" },
  { id: 2, type: "Innkjøp", car: "BMW X5 2022", amount: -520000, date: "2026-01-14" },
  { id: 3, type: "Salg", car: "Volkswagen ID.4 2023", amount: 425000, date: "2026-01-13" },
  { id: 4, type: "Innkjøp", car: "Audi e-tron 2023", amount: -480000, date: "2026-01-12" },
  { id: 5, type: "Salg", car: "Toyota RAV4 2022", amount: 395000, date: "2026-01-11" },
];

// Base car data template
const baseCarsData = [
  { regNr: "EL12345", merke: "Tesla", modell: "Model 3", avtaleType: "Innkjøpsavtale", marginHonorar: 25000, innleveringsdato: "2026-01-10", dagerUtenSalg: 32 },
  { regNr: "AB98765", merke: "BMW", modell: "X5", avtaleType: "Formidlingsavtale", marginHonorar: 8000, innleveringsdato: "2026-01-12", dagerUtenSalg: 28 },
  { regNr: "CD45678", merke: "Audi", modell: "e-tron", avtaleType: "Innkjøpsavtale", marginHonorar: 32000, innleveringsdato: "2026-01-08", dagerUtenSalg: 45 },
  { regNr: "EF11223", merke: "Volkswagen", modell: "ID.4", avtaleType: "Formidlingsavtale", marginHonorar: 12000, innleveringsdato: "2026-01-15", dagerUtenSalg: 18 },
  { regNr: "GH33445", merke: "Toyota", modell: "RAV4", avtaleType: "Innkjøpsavtale", marginHonorar: 28000, innleveringsdato: "2026-01-05", dagerUtenSalg: 52 },
  { regNr: "IJ55667", merke: "Mercedes", modell: "EQC", avtaleType: "Innkjøpsavtale", marginHonorar: 35000, innleveringsdato: "2026-01-18", dagerUtenSalg: 12 },
  { regNr: "KL77889", merke: "Volvo", modell: "XC40", avtaleType: "Formidlingsavtale", marginHonorar: 9500, innleveringsdato: "2026-01-20", dagerUtenSalg: 8 },
  { regNr: "MN99001", merke: "Skoda", modell: "Enyaq", avtaleType: "Innkjøpsavtale", marginHonorar: 22000, innleveringsdato: "2026-01-11", dagerUtenSalg: 35 },
  { regNr: "OP22334", merke: "Polestar", modell: "2", avtaleType: "Formidlingsavtale", marginHonorar: 7500, innleveringsdato: "2026-01-22", dagerUtenSalg: 5 },
  { regNr: "QR44556", merke: "Hyundai", modell: "Ioniq 5", avtaleType: "Innkjøpsavtale", marginHonorar: 30000, innleveringsdato: "2026-01-09", dagerUtenSalg: 41 },
  { regNr: "ST66778", merke: "Kia", modell: "EV6", avtaleType: "Innkjøpsavtale", marginHonorar: 27000, innleveringsdato: "2026-01-14", dagerUtenSalg: 22 },
  { regNr: "UV88990", merke: "Nissan", modell: "Ariya", avtaleType: "Formidlingsavtale", marginHonorar: 11000, innleveringsdato: "2026-01-16", dagerUtenSalg: 15 },
  { regNr: "WX11122", merke: "Ford", modell: "Mustang Mach-E", avtaleType: "Innkjøpsavtale", marginHonorar: 33000, innleveringsdato: "2026-01-07", dagerUtenSalg: 48 },
  { regNr: "YZ33344", merke: "Cupra", modell: "Born", avtaleType: "Formidlingsavtale", marginHonorar: 10000, innleveringsdato: "2026-01-19", dagerUtenSalg: 10 },
  { regNr: "AA55566", merke: "BMW", modell: "iX3", avtaleType: "Innkjøpsavtale", marginHonorar: 29000, innleveringsdato: "2026-01-21", dagerUtenSalg: 6 },
  { regNr: "BB77788", merke: "Audi", modell: "Q4 e-tron", avtaleType: "Formidlingsavtale", marginHonorar: 8500, innleveringsdato: "2026-01-23", dagerUtenSalg: 3 },
  { regNr: "CC99900", merke: "Tesla", modell: "Model Y", avtaleType: "Innkjøpsavtale", marginHonorar: 31000, innleveringsdato: "2026-01-06", dagerUtenSalg: 50 },
  { regNr: "DD11233", merke: "Volkswagen", modell: "ID.5", avtaleType: "Innkjøpsavtale", marginHonorar: 26000, innleveringsdato: "2026-01-13", dagerUtenSalg: 25 },
  { regNr: "EE33455", merke: "Lexus", modell: "UX 300e", avtaleType: "Formidlingsavtale", marginHonorar: 9000, innleveringsdato: "2026-01-17", dagerUtenSalg: 14 },
  { regNr: "FF55677", merke: "Jaguar", modell: "I-PACE", avtaleType: "Innkjøpsavtale", marginHonorar: 34000, innleveringsdato: "2026-01-04", dagerUtenSalg: 55 },
];

// Function to generate cars with company-specific innkjøpere
const generateCarsForCompany = (companyKey: string) => {
  const innkjopere = companyKey === "superia-cars" ? allInnkjopere : innkjopereByCompany[companyKey] || allInnkjopere;
  return baseCarsData.map((car, index) => ({
    ...car,
    innkjoper: innkjopere[index % innkjopere.length],
  }));
};

type SortKey = "regNr" | "merke" | "modell" | "innkjoper" | "avtaleType" | "marginHonorar" | "innleveringsdato" | "dagerUtenSalg";
type SortDirection = "asc" | "desc" | null;

function DashboardContent({ companyKey }: { companyKey: string }) {
  const [selectedMonth, setSelectedMonth] = useState("jan");
  const [showCarsList, setShowCarsList] = useState(false);
  const [showPurchasesBreakdown, setShowPurchasesBreakdown] = useState(false);
  const [visibleCars, setVisibleCars] = useState(15);
  const [visiblePurchasedCars, setVisiblePurchasedCars] = useState(15);
  const [sortKey, setSortKey] = useState<SortKey | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);
  const [purchasedSortKey, setPurchasedSortKey] = useState<SortKey | null>(null);
  const [purchasedSortDirection, setPurchasedSortDirection] = useState<SortDirection>(null);
  const [selectedAgreement, setSelectedAgreement] = useState<typeof baseCarsData[0] & { innkjoper: string } | null>(null);

  const yearlyData = yearlyDataByCompany[companyKey] || yearlyDataByCompany["superia-cars"];
  const monthIndex = months2026.find(m => m.value === selectedMonth)?.index || 0;
  const kpi = yearlyData[monthIndex];

  // Chart data for the year
  const chartData = yearlyData.map((data, idx) => ({
    month: months2026[idx].value.charAt(0).toUpperCase() + months2026[idx].value.slice(1),
    innkjop: data.totalPurchases,
    salg: data.totalSales,
    fortjeneste: data.totalRevenue,
  }));

  const carsForSaleData = useMemo(() => generateCarsForCompany(companyKey), [companyKey]);

  // Generate purchased cars data (similar structure but with purchase dates)
  const purchasedCarsData = useMemo(() => {
    const innkjopere = companyKey === "superia-cars" ? allInnkjopere : innkjopereByCompany[companyKey] || allInnkjopere;
    const purchasedCars = [];
    const totalNeeded = kpi.totalPurchases;
    
    for (let i = 0; i < totalNeeded; i++) {
      const baseCar = baseCarsData[i % baseCarsData.length];
      const day = 1 + (i % 28);
      purchasedCars.push({
        ...baseCar,
        regNr: `${baseCar.regNr.slice(0, 2)}${10000 + i}`.slice(0, 7),
        innkjoper: innkjopere[i % innkjopere.length],
        innleveringsdato: `2026-01-${day.toString().padStart(2, '0')}`,
        dagerUtenSalg: Math.floor(seededRandom(i * 33 + companyKey.length) * 30),
      });
    }
    return purchasedCars;
  }, [companyKey, kpi.totalPurchases]);

  const sortedCars = useMemo(() => {
    if (!sortKey || !sortDirection) return carsForSaleData;
    
    return [...carsForSaleData].sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];
      
      if (typeof aVal === "number" && typeof bVal === "number") {
        return sortDirection === "asc" ? aVal - bVal : bVal - aVal;
      }
      
      const aStr = String(aVal).toLowerCase();
      const bStr = String(bVal).toLowerCase();
      return sortDirection === "asc" ? aStr.localeCompare(bStr) : bStr.localeCompare(aStr);
    });
  }, [sortKey, sortDirection, carsForSaleData]);

  const sortedPurchasedCars = useMemo(() => {
    if (!purchasedSortKey || !purchasedSortDirection) return purchasedCarsData;
    
    return [...purchasedCarsData].sort((a, b) => {
      const aVal = a[purchasedSortKey];
      const bVal = b[purchasedSortKey];
      
      if (typeof aVal === "number" && typeof bVal === "number") {
        return purchasedSortDirection === "asc" ? aVal - bVal : bVal - aVal;
      }
      
      const aStr = String(aVal).toLowerCase();
      const bStr = String(bVal).toLowerCase();
      return purchasedSortDirection === "asc" ? aStr.localeCompare(bStr) : bStr.localeCompare(aStr);
    });
  }, [purchasedSortKey, purchasedSortDirection, purchasedCarsData]);

  const displayedCars = sortedCars.slice(0, visibleCars);
  const hasMoreCars = visibleCars < carsForSaleData.length;
  
  const displayedPurchasedCars = sortedPurchasedCars.slice(0, visiblePurchasedCars);
  const hasMorePurchasedCars = visiblePurchasedCars < purchasedCarsData.length;

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      if (sortDirection === "asc") setSortDirection("desc");
      else if (sortDirection === "desc") { setSortKey(null); setSortDirection(null); }
      else setSortDirection("asc");
    } else {
      setSortKey(key);
      setSortDirection("asc");
    }
  };

  const handlePurchasedSort = (key: SortKey) => {
    if (purchasedSortKey === key) {
      if (purchasedSortDirection === "asc") setPurchasedSortDirection("desc");
      else if (purchasedSortDirection === "desc") { setPurchasedSortKey(null); setPurchasedSortDirection(null); }
      else setPurchasedSortDirection("asc");
    } else {
      setPurchasedSortKey(key);
      setPurchasedSortDirection("asc");
    }
  };

  const SortIcon = ({ columnKey }: { columnKey: SortKey }) => {
    if (sortKey !== columnKey) return <ArrowUpDown className="h-3 w-3 ml-1 opacity-50" />;
    if (sortDirection === "asc") return <ArrowUp className="h-3 w-3 ml-1" />;
    return <ArrowDown className="h-3 w-3 ml-1" />;
  };

  const PurchasedSortIcon = ({ columnKey }: { columnKey: SortKey }) => {
    if (purchasedSortKey !== columnKey) return <ArrowUpDown className="h-3 w-3 ml-1 opacity-50" />;
    if (purchasedSortDirection === "asc") return <ArrowUp className="h-3 w-3 ml-1" />;
    return <ArrowDown className="h-3 w-3 ml-1" />;
  };

  return (
    <div className="space-y-8">
      {/* Month Slider */}
      <div className="flex items-center gap-4">
        <Calendar className="h-5 w-5 text-primary shrink-0" />
        <div className="flex gap-1 overflow-x-auto pb-2 scrollbar-thin">
          {months2026.map((month) => (
            <Button
              key={month.value}
              variant={selectedMonth === month.value ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedMonth(month.value)}
              className="whitespace-nowrap px-3"
            >
              {month.value.charAt(0).toUpperCase() + month.value.slice(1)}
            </Button>
          ))}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-foreground/70">Biler til salgs (IB)</CardTitle>
            <Package className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpi.carsForSaleIB} biler</div>
            <p className="text-xs text-foreground/70 flex items-center gap-1 mt-1">
              På lager nå
            </p>
            <Button
              variant="outline"
              size="sm"
              className="mt-3 w-full"
              onClick={() => setShowCarsList(!showCarsList)}
            >
              {showCarsList ? (
                <>
                  <ChevronUp className="h-4 w-4 mr-1" />
                  Skjul biler
                </>
              ) : (
                <>
                  <ChevronDown className="h-4 w-4 mr-1" />
                  Se biler
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-foreground/70">Biler kjøpt</CardTitle>
            <ShoppingCart className="h-4 w-4 text-button-teal" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpi.totalPurchases} biler</div>
            <p className="text-xs text-[#91bf48] flex items-center gap-1 mt-1">
              <TrendingUp className="h-3 w-3" />
              +8% fra forrige måned
            </p>
            <Button
              variant="outline"
              size="sm"
              className="mt-3 w-full"
              onClick={() => setShowPurchasesBreakdown(!showPurchasesBreakdown)}
            >
              {showPurchasesBreakdown ? (
                <>
                  <ChevronUp className="h-4 w-4 mr-1" />
                  Skjul biler
                </>
              ) : (
                <>
                  <ChevronDown className="h-4 w-4 mr-1" />
                  Se biler
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-foreground/70">Biler solgt</CardTitle>
            <Car className="h-4 w-4 text-[#91bf48]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpi.totalSales} biler</div>
            <p className="text-xs text-[#91bf48] flex items-center gap-1 mt-1">
              <TrendingUp className="h-3 w-3" />
              +12% fra forrige måned
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-foreground/70">Total fortjeneste</CardTitle>
            <DollarSign className="h-4 w-4 text-[#91bf48]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpi.totalRevenue.toLocaleString('nb-NO')} kr</div>
            <p className="text-xs text-[#91bf48] flex items-center gap-1 mt-1">
              <TrendingUp className="h-3 w-3" />
              +15% fra forrige måned
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-foreground/70">Biler til salgs (UB)</CardTitle>
            <Package className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpi.carsForSaleUB} biler</div>
            <p className="text-xs text-foreground/70 flex items-center gap-1 mt-1">
              IB + Kjøpt - Solgt
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-foreground/70">Gj.snitt dager på lager</CardTitle>
            <Package className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpi.avgDaysInStock} dager</div>
            <p className="text-xs text-destructive flex items-center gap-1 mt-1">
              <TrendingDown className="h-3 w-3" />
              +3 dager fra forrige måned
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Expandable Cars List */}
      {showCarsList && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Biler til salgs</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Mini KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Cars per Innkjøper */}
              <div className="bg-muted/50 rounded-lg p-4 border border-border">
                <h4 className="text-sm font-medium text-foreground/70 mb-3">Antall biler per Innkjøper</h4>
                <div className="space-y-2">
                  {(() => {
                    const innkjoperCounts: Record<string, number> = {};
                    carsForSaleData.forEach(car => {
                      innkjoperCounts[car.innkjoper] = (innkjoperCounts[car.innkjoper] || 0) + 1;
                    });
                    return Object.entries(innkjoperCounts).map(([name, count]) => (
                      <div key={name} className="flex justify-between text-sm">
                        <span className="text-foreground/70 truncate mr-2">{name}</span>
                        <span className="font-medium">{count}</span>
                      </div>
                    ));
                  })()}
                </div>
              </div>

              {/* Average Margin/Honorar */}
              <div className="bg-muted/50 rounded-lg p-4 border border-border">
                <h4 className="text-sm font-medium text-foreground/70 mb-3">Gjennomsnittlig margin/honorar</h4>
                <div className="space-y-3">
                  {(() => {
                    const innkjopsavtaler = carsForSaleData.filter(c => c.avtaleType === "Innkjøpsavtale");
                    const formidlingsavtaler = carsForSaleData.filter(c => c.avtaleType === "Formidlingsavtale");
                    const avgMargin = innkjopsavtaler.length > 0 
                      ? Math.round(innkjopsavtaler.reduce((sum, c) => sum + c.marginHonorar, 0) / innkjopsavtaler.length)
                      : 0;
                    const avgHonorar = formidlingsavtaler.length > 0
                      ? Math.round(formidlingsavtaler.reduce((sum, c) => sum + c.marginHonorar, 0) / formidlingsavtaler.length)
                      : 0;
                    return (
                      <>
                        <div className="flex justify-between text-sm">
                          <span className="text-foreground/70">Innkjøpsavtale (margin)</span>
                          <span className="font-medium">{avgMargin.toLocaleString('nb-NO')} kr</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-foreground/70">Formidlingsavtale (honorar)</span>
                          <span className="font-medium">{avgHonorar.toLocaleString('nb-NO')} kr</span>
                        </div>
                      </>
                    );
                  })()}
                </div>
              </div>

              {/* Days Without Sale Distribution */}
              <div className="bg-muted/50 rounded-lg p-4 border border-border">
                <h4 className="text-sm font-medium text-foreground/70 mb-3">Dager uten salg fordeling</h4>
                <div className="space-y-2">
                  {(() => {
                    const ranges = [
                      { label: "0-14 dager", min: 0, max: 14 },
                      { label: "15-30 dager", min: 15, max: 30 },
                      { label: "31-45 dager", min: 31, max: 45 },
                      { label: "46+ dager", min: 46, max: Infinity },
                    ];
                    return ranges.map(range => {
                      const count = carsForSaleData.filter(c => c.dagerUtenSalg >= range.min && c.dagerUtenSalg <= range.max).length;
                      return (
                        <div key={range.label} className="flex justify-between text-sm">
                          <span className={`${range.min > 30 ? "text-destructive" : "text-foreground/70"}`}>{range.label}</span>
                          <span className={`font-medium ${range.min > 30 ? "text-destructive" : ""}`}>{count} biler</span>
                        </div>
                      );
                    });
                  })()}
                </div>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2 px-3 font-medium text-foreground/70 cursor-pointer hover:text-foreground" onClick={() => handleSort("regNr")}>
                      <span className="flex items-center">Reg.nr<SortIcon columnKey="regNr" /></span>
                    </th>
                    <th className="text-left py-2 px-3 font-medium text-foreground/70 cursor-pointer hover:text-foreground" onClick={() => handleSort("merke")}>
                      <span className="flex items-center">Merke<SortIcon columnKey="merke" /></span>
                    </th>
                    <th className="text-left py-2 px-3 font-medium text-foreground/70 cursor-pointer hover:text-foreground" onClick={() => handleSort("modell")}>
                      <span className="flex items-center">Modell<SortIcon columnKey="modell" /></span>
                    </th>
                    <th className="text-left py-2 px-3 font-medium text-foreground/70 cursor-pointer hover:text-foreground" onClick={() => handleSort("innkjoper")}>
                      <span className="flex items-center">Innkjøper<SortIcon columnKey="innkjoper" /></span>
                    </th>
                    <th className="text-left py-2 px-3 font-medium text-foreground/70 cursor-pointer hover:text-foreground" onClick={() => handleSort("avtaleType")}>
                      <span className="flex items-center">Type avtale<SortIcon columnKey="avtaleType" /></span>
                    </th>
                    <th className="text-right py-2 px-3 font-medium text-foreground/70 cursor-pointer hover:text-foreground" onClick={() => handleSort("marginHonorar")}>
                      <span className="flex items-center justify-end">Margin/Honorar<SortIcon columnKey="marginHonorar" /></span>
                    </th>
                    <th className="text-left py-2 px-3 font-medium text-foreground/70 cursor-pointer hover:text-foreground" onClick={() => handleSort("innleveringsdato")}>
                      <span className="flex items-center">Innleveringsdato<SortIcon columnKey="innleveringsdato" /></span>
                    </th>
                    <th className="text-right py-2 px-3 font-medium text-foreground/70 cursor-pointer hover:text-foreground" onClick={() => handleSort("dagerUtenSalg")}>
                      <span className="flex items-center justify-end"># dager uten salg<SortIcon columnKey="dagerUtenSalg" /></span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {displayedCars.map((car, index) => (
                    <tr key={index} className="border-b border-border/50 hover:bg-muted/50">
                      <td className="py-2 px-3 font-mono">{car.regNr}</td>
                      <td className="py-2 px-3">{car.merke}</td>
                      <td className="py-2 px-3">{car.modell}</td>
                      <td className="py-2 px-3">{car.innkjoper}</td>
                      <td className="py-2 px-3">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setSelectedAgreement(car)}
                            className="p-1 rounded hover:bg-muted transition-colors"
                            title="Vis avtale"
                          >
                            <FileText className="h-4 w-4 text-button-teal" />
                          </button>
                          <span className={`px-2 py-1 rounded-full text-xs text-foreground ${
                            car.avtaleType === "Innkjøpsavtale" 
                              ? "bg-[#91bf48]/20" 
                              : "bg-[#91bf48]/10"
                          }`}>
                            {car.avtaleType}
                          </span>
                        </div>
                      </td>
                      <td className="py-2 px-3 text-right">
                        {car.marginHonorar.toLocaleString('nb-NO')} kr
                      </td>
                      <td className="py-2 px-3">{car.innleveringsdato}</td>
                      <td className="py-2 px-3 text-right">
                        <span className={car.dagerUtenSalg > 30 ? "text-destructive font-medium" : ""}>
                          {car.dagerUtenSalg}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {hasMoreCars && (
              <div className="mt-4 text-center">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setVisibleCars(prev => prev + 15)}
                >
                  Last inn flere ({carsForSaleData.length - visibleCars} gjenstår)
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Expandable Purchased Cars List */}
      {showPurchasesBreakdown && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Biler kjøpt</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Mini KPI Cards for Purchases */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Cars per Innkjøper */}
              <div className="bg-muted/50 rounded-lg p-4 border border-border">
                <h4 className="text-sm font-medium text-foreground/70 mb-3">Antall biler per Innkjøper</h4>
                <div className="space-y-2">
                  {kpi.purchasesByInnkjoper.map((p, idx) => (
                    <div key={idx} className="flex justify-between text-sm">
                      <span className="text-foreground/70 truncate mr-2">{p.name}</span>
                      <span className="font-medium">{p.cars} biler</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Average Margin/Honorar per Innkjøper */}
              <div className="bg-muted/50 rounded-lg p-4 border border-border">
                <h4 className="text-sm font-medium text-foreground/70 mb-3">Gj.snitt margin/honorar per innkjøper</h4>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {(() => {
                    const innkjopere = companyKey === "superia-cars" ? allInnkjopere : innkjopereByCompany[companyKey] || allInnkjopere;
                    return innkjopere.map((name) => {
                      const innkjoperCars = purchasedCarsData.filter(c => c.innkjoper === name);
                      const innkjopsavtaler = innkjoperCars.filter(c => c.avtaleType === "Innkjøpsavtale");
                      const formidlingsavtaler = innkjoperCars.filter(c => c.avtaleType === "Formidlingsavtale");
                      const avgMargin = innkjopsavtaler.length > 0 
                        ? Math.round(innkjopsavtaler.reduce((sum, c) => sum + c.marginHonorar, 0) / innkjopsavtaler.length)
                        : 0;
                      const avgHonorar = formidlingsavtaler.length > 0
                        ? Math.round(formidlingsavtaler.reduce((sum, c) => sum + c.marginHonorar, 0) / formidlingsavtaler.length)
                        : 0;
                      return (
                        <div key={name} className="pb-2 border-b border-border/50 last:border-0">
                          <span className="text-foreground/70 text-xs font-medium block mb-1">{name}</span>
                          <div className="flex justify-between text-xs">
                            <span className="text-foreground/50">Gj.snittlig avtalt margin:</span>
                            <span className="font-medium">{avgMargin > 0 ? `${avgMargin.toLocaleString('nb-NO')} kr` : '-'}</span>
                          </div>
                          <div className="flex justify-between text-xs">
                            <span className="text-foreground/50">Gj.snittlig avtalt honorar:</span>
                            <span className="font-medium">{avgHonorar > 0 ? `${avgHonorar.toLocaleString('nb-NO')} kr` : '-'}</span>
                          </div>
                        </div>
                      );
                    });
                  })()}
                </div>
              </div>

              {/* Performance ranking */}
              <div className="bg-muted/50 rounded-lg p-4 border border-border">
                <h4 className="text-sm font-medium text-foreground/70 mb-3">Topp innkjøpere</h4>
                <div className="space-y-2">
                  {(() => {
                    // Calculate weighted score: 60% cars, 40% margin/honorar
                    const innkjopere = companyKey === "superia-cars" ? allInnkjopere : innkjopereByCompany[companyKey] || allInnkjopere;
                    const maxCars = Math.max(...kpi.purchasesByInnkjoper.map(p => p.cars));
                    const allMargins = purchasedCarsData.map(c => c.marginHonorar);
                    const maxMargin = Math.max(...allMargins);
                    
                    const rankedInnkjopere = innkjopere.map(name => {
                      const purchaseData = kpi.purchasesByInnkjoper.find(p => p.name === name);
                      const cars = purchaseData?.cars || 0;
                      const innkjoperCars = purchasedCarsData.filter(c => c.innkjoper === name);
                      const avgMarginHonorar = innkjoperCars.length > 0
                        ? innkjoperCars.reduce((sum, c) => sum + c.marginHonorar, 0) / innkjoperCars.length
                        : 0;
                      
                      // Normalize and weight: 60% cars, 40% margin
                      const carsScore = maxCars > 0 ? (cars / maxCars) * 0.6 : 0;
                      const marginScore = maxMargin > 0 ? (avgMarginHonorar / maxMargin) * 0.4 : 0;
                      const totalScore = carsScore + marginScore;
                      
                      return { name, cars, avgMarginHonorar, totalScore };
                    });
                    
                    return rankedInnkjopere
                      .sort((a, b) => b.totalScore - a.totalScore)
                      .slice(0, 3)
                      .map((p, idx) => (
                        <div key={idx} className="flex justify-between text-sm">
                          <span className="text-foreground/70 truncate mr-2">
                            {idx === 0 ? "🥇" : idx === 1 ? "🥈" : "🥉"} {p.name}
                          </span>
                          <span className="font-medium text-[#91bf48]">
                            {p.cars} biler · {Math.round(p.avgMarginHonorar).toLocaleString('nb-NO')} kr
                          </span>
                        </div>
                      ));
                  })()}
                </div>
              </div>
            </div>

            {/* Cars Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2 px-3 font-medium text-foreground/70 cursor-pointer hover:text-foreground" onClick={() => handlePurchasedSort("regNr")}>
                      <span className="flex items-center">Reg.nr<PurchasedSortIcon columnKey="regNr" /></span>
                    </th>
                    <th className="text-left py-2 px-3 font-medium text-foreground/70 cursor-pointer hover:text-foreground" onClick={() => handlePurchasedSort("merke")}>
                      <span className="flex items-center">Merke<PurchasedSortIcon columnKey="merke" /></span>
                    </th>
                    <th className="text-left py-2 px-3 font-medium text-foreground/70 cursor-pointer hover:text-foreground" onClick={() => handlePurchasedSort("modell")}>
                      <span className="flex items-center">Modell<PurchasedSortIcon columnKey="modell" /></span>
                    </th>
                    <th className="text-left py-2 px-3 font-medium text-foreground/70 cursor-pointer hover:text-foreground" onClick={() => handlePurchasedSort("innkjoper")}>
                      <span className="flex items-center">Innkjøper<PurchasedSortIcon columnKey="innkjoper" /></span>
                    </th>
                    <th className="text-left py-2 px-3 font-medium text-foreground/70 cursor-pointer hover:text-foreground" onClick={() => handlePurchasedSort("avtaleType")}>
                      <span className="flex items-center">Type avtale<PurchasedSortIcon columnKey="avtaleType" /></span>
                    </th>
                    <th className="text-right py-2 px-3 font-medium text-foreground/70 cursor-pointer hover:text-foreground" onClick={() => handlePurchasedSort("marginHonorar")}>
                      <span className="flex items-center justify-end">Margin/Honorar<PurchasedSortIcon columnKey="marginHonorar" /></span>
                    </th>
                    <th className="text-left py-2 px-3 font-medium text-foreground/70 cursor-pointer hover:text-foreground" onClick={() => handlePurchasedSort("innleveringsdato")}>
                      <span className="flex items-center">Innleveringsdato<PurchasedSortIcon columnKey="innleveringsdato" /></span>
                    </th>
                    <th className="text-right py-2 px-3 font-medium text-foreground/70 cursor-pointer hover:text-foreground" onClick={() => handlePurchasedSort("dagerUtenSalg")}>
                      <span className="flex items-center justify-end"># dager uten salg<PurchasedSortIcon columnKey="dagerUtenSalg" /></span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {displayedPurchasedCars.map((car, index) => (
                    <tr key={index} className="border-b border-border/50 hover:bg-muted/50">
                      <td className="py-2 px-3 font-mono">{car.regNr}</td>
                      <td className="py-2 px-3">{car.merke}</td>
                      <td className="py-2 px-3">{car.modell}</td>
                      <td className="py-2 px-3">{car.innkjoper}</td>
                      <td className="py-2 px-3">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setSelectedAgreement(car)}
                            className="p-1 rounded hover:bg-muted transition-colors"
                            title="Vis avtale"
                          >
                            <FileText className="h-4 w-4 text-button-teal" />
                          </button>
                          <span className={`px-2 py-1 rounded-full text-xs text-foreground ${
                            car.avtaleType === "Innkjøpsavtale" 
                              ? "bg-[#91bf48]/20" 
                              : "bg-[#91bf48]/10"
                          }`}>
                            {car.avtaleType}
                          </span>
                        </div>
                      </td>
                      <td className="py-2 px-3 text-right">
                        {car.marginHonorar.toLocaleString('nb-NO')} kr
                      </td>
                      <td className="py-2 px-3">{car.innleveringsdato}</td>
                      <td className="py-2 px-3 text-right">
                        <span className={car.dagerUtenSalg > 30 ? "text-destructive font-medium" : ""}>
                          {car.dagerUtenSalg}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {hasMorePurchasedCars && (
              <div className="mt-4 text-center">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setVisiblePurchasedCars(prev => prev + 15)}
                >
                  Last inn flere ({purchasedCarsData.length - visiblePurchasedCars} gjenstår)
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Agreement Preview Dialog */}
      <Dialog open={!!selectedAgreement} onOpenChange={(open) => !open && setSelectedAgreement(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              {selectedAgreement?.avtaleType} - {selectedAgreement?.regNr}
            </DialogTitle>
          </DialogHeader>
          
          {selectedAgreement && (
            <div className="space-y-6">
              {/* PDF Preview Placeholder */}
              <div className="bg-muted/50 border border-border rounded-lg p-8 min-h-[400px] flex flex-col items-center justify-center">
                <FileText className="h-16 w-16 text-muted-foreground/50 mb-4" />
                <p className="text-muted-foreground text-center">
                  {selectedAgreement.avtaleType}<br />
                  <span className="font-semibold text-foreground">{selectedAgreement.merke} {selectedAgreement.modell}</span><br />
                  <span className="text-sm">Reg.nr: {selectedAgreement.regNr}</span><br />
                  <span className="text-sm">Innkjøper: {selectedAgreement.innkjoper}</span><br />
                  <span className="text-sm">Innleveringsdato: {selectedAgreement.innleveringsdato}</span>
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 justify-end border-t border-border pt-4">
                <Button
                  variant="outline"
                  onClick={() => setSelectedAgreement(null)}
                >
                  <X className="h-4 w-4 mr-2" />
                  Close window
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    toast.success("Skriver ut avtale...");
                    window.print();
                  }}
                >
                  <Printer className="h-4 w-4 mr-2" />
                  Print
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    toast.success("Laster ned avtale...");
                  }}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
                <Button
                  className="bg-[#91bf48] hover:bg-[#7da93d] text-white"
                  onClick={() => {
                    toast.success("Avtale sendt!");
                    setSelectedAgreement(null);
                  }}
                >
                  <Send className="h-4 w-4 mr-2" />
                  Send Agreement
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Innkjøp vs Salg per måned</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="month" className="text-foreground/70" />
                  <YAxis className="text-foreground/70" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                  <Bar dataKey="innkjop" fill="#0ea5e9" name="Innkjøp" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="salg" fill="#91bf48" name="Salg" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Fortjeneste trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="month" className="text-foreground/70" />
                  <YAxis className="text-foreground/70" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                    formatter={(value: number) => [`${value.toLocaleString('nb-NO')} kr`, 'Fortjeneste']}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="fortjeneste" 
                    stroke="#91bf48" 
                    strokeWidth={3}
                    dot={{ fill: '#91bf48', strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Biltyper solgt</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={carTypeData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {carTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                    formatter={(value: number) => [`${value}%`, '']}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-wrap justify-center gap-4 mt-4">
              {carTypeData.map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm text-foreground/70">{item.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Siste transaksjoner</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentTransactions.map((transaction) => (
                <div 
                  key={transaction.id}
                  className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full ${
                      transaction.type === 'Salg' 
                        ? 'bg-[#91bf48]/10 text-[#91bf48]' 
                        : 'bg-button-teal/10 text-button-teal'
                    }`}>
                      {transaction.type === 'Salg' ? (
                        <TrendingUp className="h-4 w-4" />
                      ) : (
                        <ShoppingCart className="h-4 w-4" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{transaction.car}</p>
                      <p className="text-sm text-foreground/70">{transaction.date}</p>
                    </div>
                  </div>
                  <div className={`font-bold ${
                    transaction.amount > 0 ? 'text-[#91bf48]' : 'text-foreground'
                  }`}>
                    {transaction.amount > 0 ? '+' : ''}{transaction.amount.toLocaleString('nb-NO')} kr
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function Reporting() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <BarChart3 className="h-8 w-8 text-[#91bf48]" />
            Reporting Dashboard
          </h1>
          <p className="text-foreground/70 mt-2">
            Oversikt over salg, innkjøp og nøkkeltall for bilhandelen
          </p>
        </div>

        <Tabs defaultValue="superia-cars" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-grid">
            <TabsTrigger value="superia-cars" className="flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              <span className="hidden sm:inline">Superia Cars</span>
              <span className="sm:hidden">Superia</span>
            </TabsTrigger>
            <TabsTrigger value="rabb-auto">Rabb Auto</TabsTrigger>
            <TabsTrigger value="gangas-auto">Gangås Auto</TabsTrigger>
            <TabsTrigger value="hub-auto">Hub Auto</TabsTrigger>
          </TabsList>

          <TabsContent value="superia-cars">
            <DashboardContent companyKey="superia-cars" />
          </TabsContent>
          <TabsContent value="rabb-auto">
            <DashboardContent companyKey="rabb-auto" />
          </TabsContent>
          <TabsContent value="gangas-auto">
            <DashboardContent companyKey="gangas-auto" />
          </TabsContent>
          <TabsContent value="hub-auto">
            <DashboardContent companyKey="hub-auto" />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
