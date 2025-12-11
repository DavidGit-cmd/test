import { ReactNode } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Play, 
  FileText, 
  Presentation, 
  HelpCircle, 
  CheckCircle, 
  Clock,
  Users,
  Lock,
  Eye,
  Download,
  Share2
} from "lucide-react";

interface ContentItem {
  id: string;
  title: string;
  description: string;
  duration?: string;
  completed?: boolean;
  restricted?: boolean;
  downloadUrl?: string;
  videoUrl?: string;
}

interface ContentSectionProps {
  title: string;
  description?: string;
  icon: ReactNode;
  items: ContentItem[];
  type: 'video' | 'document' | 'presentation' | 'faq' | 'exam';
  className?: string;
}

const typeIcons = {
  video: Play,
  document: FileText,
  presentation: Presentation,
  faq: HelpCircle,
  exam: CheckCircle
};

const typeColors = {
  video: "bg-info/10 text-info border-info/20",
  document: "bg-primary/10 text-primary border-primary/20",
  presentation: "bg-accent/10 text-accent-foreground border-accent/20",
  faq: "bg-warning/10 text-warning-foreground border-warning/20",
  exam: "bg-success/10 text-success border-success/20"
};

export default function ContentSection({ 
  title, 
  description, 
  icon, 
  items, 
  type,
  className = "" 
}: ContentSectionProps) {
  const TypeIcon = typeIcons[type];

  const handleDownload = (downloadUrl: string, fileName: string) => {
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleView = (downloadUrl: string) => {
    window.open(downloadUrl, '_blank');
  };

  const handleShare = (downloadUrl: string, title: string) => {
    if (navigator.share) {
      navigator.share({
        title: title,
        url: downloadUrl
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(downloadUrl).then(() => {
        // You could add a toast notification here
        console.log('Document URL copied to clipboard');
      });
    }
  };

  const handleVideoPlay = (videoUrl: string) => {
    window.open(videoUrl, '_blank');
  };

  return (
    <Card className={`${className} shadow-md hover:shadow-lg transition-all duration-200 bg-gradient-card border-border/50`}>
      <CardHeader className="pb-4">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-lg ${typeColors[type]}`}>
            {icon}
          </div>
          <div className="flex-1">
            <CardTitle className="flex items-center space-x-2">
              <span>{title}</span>
              <Badge variant="secondary" className="text-xs">
                {items.length} elementer
              </Badge>
            </CardTitle>
            {description && (
              <CardDescription className="mt-1">{description}</CardDescription>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3">
        {items.map((item) => (
          <div 
            key={item.id}
            className="flex items-center justify-between p-3 rounded-lg bg-background/50 border border-border/30 hover:bg-secondary/30 transition-colors duration-200"
          >
            <div className="flex items-center space-x-3 flex-1 min-w-0">
              <TypeIcon className={`h-4 w-4 flex-shrink-0 ${type === 'document' ? 'text-primary' : 'text-muted-foreground'}`} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2">
                  <h4 className="text-sm font-medium truncate">{item.title}</h4>
                  {item.restricted && (
                    <Lock className="h-3 w-3 text-warning" />
                  )}
                  {item.completed && (
                    <CheckCircle className="h-3 w-3 text-success" />
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-1 truncate">
                  {item.description}
                </p>
                {item.duration && (
                  <div className="flex items-center space-x-1 mt-1">
                    <Clock className="h-3 w-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">{item.duration}</span>
                  </div>
                )}
              </div>
            </div>
            
            {type === 'document' ? (
              <div className="flex space-x-1 ml-3 flex-shrink-0">
                {item.videoUrl && (
                  <Button 
                    size="sm" 
                    variant="default" 
                    className="px-2 bg-button-teal hover:bg-button-teal/90"
                    onClick={() => handleVideoPlay(item.videoUrl!)}
                  >
                    <Play className="h-3 w-3 text-white" />
                  </Button>
                )}
                {item.downloadUrl && (
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="px-2"
                    onClick={() => handleView(item.downloadUrl!)}
                  >
                    <Eye className="h-3 w-3 text-primary" />
                  </Button>
                )}
                {item.downloadUrl && (
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="px-2"
                    onClick={() => handleDownload(item.downloadUrl!, item.title)}
                  >
                    <Download className="h-3 w-3 text-primary" />
                  </Button>
                )}
                {item.downloadUrl && (
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="px-2"
                    onClick={() => handleShare(item.downloadUrl!, item.title)}
                  >
                    <Share2 className="h-3 w-3 text-primary" />
                  </Button>
                )}
              </div>
            ) : (
              <Button 
                size="sm" 
                variant={item.completed ? "secondary" : "default"}
                className="ml-3 flex-shrink-0"
                onClick={() => {
                  if (type === 'video' && item.videoUrl) {
                    handleVideoPlay(item.videoUrl);
                  }
                }}
              >
                {type === 'exam' ? (
                  item.completed ? 'Se resultat' : 'Start eksamen'
                ) : (
                  item.completed ? 'Åpne igjen' : 'Åpne'
                )}
              </Button>
            )}
          </div>
        ))}
        
        {items.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <TypeIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="text-sm">Ingen {title.toLowerCase()} tilgjengelig ennå</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}