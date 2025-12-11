import { Play, Clock, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface VideoSectionProps {
  title: string;
  description: string;
  videoUrl: string;
  duration: string;
  completed?: boolean;
  thumbnailUrl?: string;
  roleTitle: string;
  roleDescription: string;
  badgeText: string;
}

export default function VideoSection({ 
  title, 
  description, 
  videoUrl, 
  duration, 
  completed = false,
  thumbnailUrl,
  roleTitle,
  roleDescription,
  badgeText
}: VideoSectionProps) {
  return (
    <section className="p-6">
      <div className="max-w-7xl mx-auto">
        <Card className="shadow-lg bg-gradient-card border border-primary/20">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-primary/10 text-primary border-primary/20">
                <Play className="h-5 w-5" />
              </div>
              <div>
                <CardTitle className="flex items-center space-x-2">
                  <span>{title}</span>
                  <Badge className="bg-primary/10 text-primary border-primary/20">
                    {badgeText}
                  </Badge>
                </CardTitle>
                <CardDescription>
                  {description}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
              {/* Video Column */}
              <div>
                <div className="bg-black rounded-lg overflow-hidden shadow-inner">
                  <video 
                    controls 
                    className="w-full h-auto"
                    preload="metadata"
                  >
                    <source 
                      src={videoUrl} 
                      type="video/mp4" 
                    />
                    Din nettleser støtter ikke video-avspilling.
                  </video>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <Badge variant="outline" className="text-xs">
                    Påkrevd visning
                  </Badge>
                  <div className="flex items-center space-x-2 text-muted-foreground text-sm">
                    <Clock className="h-4 w-4" />
                    <span>{duration}</span>
                  </div>
                </div>
                {completed && (
                  <div className="mt-2">
                    <Badge className="bg-success/20 text-success border-success/30">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Fullført
                    </Badge>
                  </div>
                )}
              </div>
              
              {/* Introduction Text Column */}
              <div className="space-y-4">
                <div>
                  <h3 className="text-2xl font-bold text-primary mb-2">
                    VELKOMMEN TIL
                  </h3>
                  <h2 className="text-3xl font-bold text-foreground mb-4">
                    {roleTitle}
                  </h2>
                </div>
                
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    {roleDescription}
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
  );
}