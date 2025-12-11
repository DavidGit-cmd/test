import { Outlet, useLocation, Link } from "react-router-dom";
import { 
  BookOpen, 
  Users, 
  ShoppingCart, 
  Car, 
  Wrench, 
  GraduationCap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import heroImage from "@/assets/hero-superia.jpg";
import superiaLogo from "@/assets/superia-logo.png";
import Footer from "./Footer";

interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  restricted?: boolean;
  restrictedTo?: string;
}

const navigationItems: NavItem[] = [
  {
    title: "Superia Cars Kunnskapssenter",
    href: "/",
    icon: GraduationCap,
    restricted: false
  },
  {
    title: "For alle ansatte - uavhengig av stilling",
    href: "/alle-ansatte",
    icon: Users,
    restricted: false
  },
  {
    title: "For Innkjøpere",
    href: "/innkjoper",
    icon: ShoppingCart,
    restricted: false
  },
  {
    title: "For Selgere",
    href: "/selger",
    icon: Car,
    restricted: false
  },
  {
    title: "For Klargjørere",
    href: "/klargjorer",
    icon: Wrench,
    restricted: false
  },
  {
    title: "For Daglige ledere",
    href: "/daglig-leder",
    icon: Users,
    restricted: true,
    restrictedTo: "Kun daglig ledere"
  }
];

export default function TrainingLayout() {
  const location = useLocation();
  const isCurrentPath = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="bg-gradient-primary shadow-md border-b border-border">
        <div className="px-4 lg:px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <img 
              src={superiaLogo} 
              alt="Superia Cars Logo" 
              className="h-12 w-auto"
            />
            <Button asChild variant="default" className="bg-button-teal hover:bg-button-teal/90 text-button-teal-foreground">
              <Link to="/superia-markets">
                Superia Markets
              </Link>
            </Button>
          </div>
        </div>
        
        {/* Hero Section */}
        <div 
          className="relative h-64 md:h-80 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${heroImage})` }}
        >
          <div className="absolute inset-0 bg-gradient-primary/60" />
          <div className="relative h-full flex items-center justify-center text-center px-4">
            <div className="max-w-4xl">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary-foreground mb-4">
                Superia Cars Training Center
              </h2>
              <p className="text-lg md:text-xl text-primary-foreground/90 max-w-3xl mx-auto">
                Skandinavias ledende bilforhandler - Bygg din kompetanse og voks i din rolle
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="bg-card shadow-md">
          <div className="px-4 lg:px-6 py-4">
            <nav className="flex flex-wrap justify-center gap-2 md:gap-4">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const isActive = isCurrentPath(item.href);
                
                 return (
                   <Button
                     key={item.href}
                     asChild
                     size="sm"
                     variant={isActive ? "default" : "secondary"}
                     className="flex items-center space-x-2"
                   >
                     <Link to={item.href}>
                       <Icon className="h-4 w-4" />
                       <span className="font-medium">
                         {item.title}
                       </span>
                     </Link>
                   </Button>
                 );
              })}
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}