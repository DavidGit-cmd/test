import { useState, useEffect } from "react";
import { PartyPopper, Send, ThumbsUp, MessageCircle, MoreHorizontal, ChevronDown, ChevronUp, X } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface SaleAnnouncement {
  id: string;
  registration_number: string;
  car_make: string;
  car_model: string;
  sold_price: number;
  extras: string | null;
  total_amount: number;
  seller_name: string;
  buyer_cost: number | null;
  profit: number | null;
  notes: string | null;
  author_name: string;
  created_at: string;
}

interface Like {
  id: string;
  announcement_id: string;
  author_name: string;
  created_at: string;
}

interface Comment {
  id: string;
  announcement_id: string;
  author_name: string;
  content: string;
  created_at: string;
}

// Mock names for the team
const teamMembers = [
  "Ronny Rønning Bysveen",
  "Espen Thomassen",
  "André Syversen",
  "Tom Anders Melheim",
  "Lars Erik Hansen",
  "Kristine Olsen"
];

export default function IJustGotPaid() {
  const { toast } = useToast();
  const [announcements, setAnnouncements] = useState<SaleAnnouncement[]>([]);
  const [likes, setLikes] = useState<Record<string, Like[]>>({});
  const [comments, setComments] = useState<Record<string, Comment[]>>({});
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [expandedPosts, setExpandedPosts] = useState<Set<string>>(new Set());
  const [showComments, setShowComments] = useState<Set<string>>(new Set());
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [currentUser] = useState(teamMembers[0]);
  
  // Form state
  const [formData, setFormData] = useState({
    registration_number: "",
    car_make: "",
    car_model: "",
    sold_price: "",
    extras: "",
    total_amount: "",
    seller_name: "",
    buyer_cost: "",
    profit: "",
    notes: "",
    author_name: teamMembers[0]
  });

  useEffect(() => {
    fetchAnnouncements();
    
    // Subscribe to realtime updates
    const channel = supabase
      .channel('sale-announcements-all')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'sale_announcements'
        },
        (payload) => {
          setAnnouncements(prev => [payload.new as SaleAnnouncement, ...prev]);
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'announcement_likes'
        },
        () => {
          fetchLikesAndComments();
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'announcement_comments'
        },
        () => {
          fetchLikesAndComments();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchAnnouncements = async () => {
    const { data, error } = await supabase
      .from('sale_announcements')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching announcements:', error);
      toast({
        title: "Feil",
        description: "Kunne ikke hente meldinger",
        variant: "destructive"
      });
    } else {
      setAnnouncements(data || []);
      if (data && data.length > 0) {
        fetchLikesAndComments(data.map(a => a.id));
      }
    }
    setLoading(false);
  };

  const fetchLikesAndComments = async (announcementIds?: string[]) => {
    const ids = announcementIds || announcements.map(a => a.id);
    if (ids.length === 0) return;

    const [likesRes, commentsRes] = await Promise.all([
      supabase.from('announcement_likes').select('*').in('announcement_id', ids),
      supabase.from('announcement_comments').select('*').in('announcement_id', ids).order('created_at', { ascending: true })
    ]);

    if (likesRes.data) {
      const likesMap: Record<string, Like[]> = {};
      likesRes.data.forEach((like: Like) => {
        if (!likesMap[like.announcement_id]) {
          likesMap[like.announcement_id] = [];
        }
        likesMap[like.announcement_id].push(like);
      });
      setLikes(likesMap);
    }

    if (commentsRes.data) {
      const commentsMap: Record<string, Comment[]> = {};
      commentsRes.data.forEach((comment: Comment) => {
        if (!commentsMap[comment.announcement_id]) {
          commentsMap[comment.announcement_id] = [];
        }
        commentsMap[comment.announcement_id].push(comment);
      });
      setComments(commentsMap);
    }
  };

  const handleLike = async (announcementId: string) => {
    const announcementLikes = likes[announcementId] || [];
    const existingLike = announcementLikes.find(l => l.author_name === currentUser);

    if (existingLike) {
      // Unlike
      await supabase.from('announcement_likes').delete().eq('id', existingLike.id);
      setLikes(prev => ({
        ...prev,
        [announcementId]: (prev[announcementId] || []).filter(l => l.id !== existingLike.id)
      }));
    } else {
      // Like
      const { data, error } = await supabase.from('announcement_likes').insert({
        announcement_id: announcementId,
        author_name: currentUser
      }).select().single();

      if (!error && data) {
        setLikes(prev => ({
          ...prev,
          [announcementId]: [...(prev[announcementId] || []), data]
        }));
      }
    }
  };

  const handleComment = async (announcementId: string) => {
    const content = commentInputs[announcementId]?.trim();
    if (!content) return;

    const { error } = await supabase.from('announcement_comments').insert({
      announcement_id: announcementId,
      author_name: currentUser,
      content
    });

    if (!error) {
      setCommentInputs(prev => ({ ...prev, [announcementId]: "" }));
      fetchLikesAndComments([announcementId]);
    }
  };

  const handleShare = async (announcement: SaleAnnouncement) => {
    const text = `${announcement.author_name} solgte ${announcement.car_make} ${announcement.car_model} (${announcement.registration_number}) for ${formatCurrency(announcement.total_amount)} kr!`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'I just got paid!',
          text
        });
      } catch (err) {
        // User cancelled or error
      }
    } else {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Kopiert!",
        description: "Teksten er kopiert til utklippstavlen"
      });
    }
  };

  const toggleComments = (id: string) => {
    setShowComments(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const { error } = await supabase
      .from('sale_announcements')
      .insert({
        registration_number: formData.registration_number,
        car_make: formData.car_make,
        car_model: formData.car_model,
        sold_price: parseFloat(formData.sold_price) || 0,
        extras: formData.extras || null,
        total_amount: parseFloat(formData.total_amount) || 0,
        seller_name: formData.seller_name,
        buyer_cost: formData.buyer_cost ? parseFloat(formData.buyer_cost) : null,
        profit: formData.profit ? parseFloat(formData.profit) : null,
        notes: formData.notes || null,
        author_name: formData.author_name
      });

    if (error) {
      console.error('Error creating announcement:', error);
      toast({
        title: "Feil",
        description: "Kunne ikke opprette melding",
        variant: "destructive"
      });
    } else {
      toast({
        title: "Suksess!",
        description: "Salgsmelding publisert! 🎉"
      });
      setFormData({
        registration_number: "",
        car_make: "",
        car_model: "",
        sold_price: "",
        extras: "",
        total_amount: "",
        seller_name: "",
        buyer_cost: "",
        profit: "",
        notes: "",
        author_name: formData.author_name
      });
      setShowForm(false);
    }
    setSubmitting(false);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('nb-NO', { 
      style: 'decimal',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0 
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Akkurat nå";
    if (diffMins < 60) return `${diffMins} min`;
    if (diffHours < 24) return `${diffHours} t`;
    if (diffDays < 7) return `${diffDays} d`;
    
    return date.toLocaleDateString('nb-NO', { day: 'numeric', month: 'long' });
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  };

  const toggleExpand = (id: string) => {
    setExpandedPosts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const hasUserLiked = (announcementId: string) => {
    return (likes[announcementId] || []).some(l => l.author_name === currentUser);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex justify-center items-center gap-3 mb-2">
          <PartyPopper className="h-8 w-8 text-yellow-500" />
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">
            I just got paid!
          </h1>
          <PartyPopper className="h-8 w-8 text-yellow-500" />
        </div>
        <p className="text-muted-foreground">
          Del dine salg med teamet
        </p>
      </div>

      {/* Post Composer */}
      <Card className="mb-6 shadow-sm">
        <CardContent className="p-4">
          {!showForm ? (
            <div 
              className="flex items-center gap-3 cursor-pointer"
              onClick={() => setShowForm(true)}
            >
              <Avatar className="h-10 w-10">
                <AvatarFallback className="bg-primary/10 text-primary">
                  {getInitials(formData.author_name)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 bg-muted rounded-full px-4 py-2.5 text-muted-foreground hover:bg-muted/80 transition-colors">
                Skriv noe ... Del et salg med teamet!
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {getInitials(formData.author_name)}
                  </AvatarFallback>
                </Avatar>
                <select
                  value={formData.author_name}
                  onChange={(e) => setFormData(prev => ({ ...prev, author_name: e.target.value }))}
                  className="bg-muted rounded px-3 py-1.5 text-sm font-medium"
                >
                  {teamMembers.map(name => (
                    <option key={name} value={name}>{name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <Label className="text-xs">Reg.nr *</Label>
                  <Input
                    value={formData.registration_number}
                    onChange={(e) => setFormData(prev => ({ ...prev, registration_number: e.target.value.toUpperCase() }))}
                    placeholder="AB12345"
                    required
                  />
                </div>
                <div>
                  <Label className="text-xs">Merke *</Label>
                  <Input
                    value={formData.car_make}
                    onChange={(e) => setFormData(prev => ({ ...prev, car_make: e.target.value }))}
                    placeholder="Ford"
                    required
                  />
                </div>
                <div>
                  <Label className="text-xs">Modell *</Label>
                  <Input
                    value={formData.car_model}
                    onChange={(e) => setFormData(prev => ({ ...prev, car_model: e.target.value }))}
                    placeholder="Transit Connect"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs">Solgt for *</Label>
                  <Input
                    type="number"
                    value={formData.sold_price}
                    onChange={(e) => setFormData(prev => ({ ...prev, sold_price: e.target.value }))}
                    placeholder="120000"
                    required
                  />
                </div>
                <div>
                  <Label className="text-xs">Tilsammen *</Label>
                  <Input
                    type="number"
                    value={formData.total_amount}
                    onChange={(e) => setFormData(prev => ({ ...prev, total_amount: e.target.value }))}
                    placeholder="127000"
                    required
                  />
                </div>
              </div>

              <div>
                <Label className="text-xs">Ekstrautstyr/tillegg</Label>
                <Input
                  value={formData.extras}
                  onChange={(e) => setFormData(prev => ({ ...prev, extras: e.target.value }))}
                  placeholder="+ Safepakke 12mnd garanti 7000,-"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs">Selgers navn *</Label>
                  <Input
                    value={formData.seller_name}
                    onChange={(e) => setFormData(prev => ({ ...prev, seller_name: e.target.value }))}
                    placeholder="Espen Thomassen"
                    required
                  />
                </div>
                <div>
                  <Label className="text-xs">Påkost (kr)</Label>
                  <Input
                    type="number"
                    value={formData.buyer_cost}
                    onChange={(e) => setFormData(prev => ({ ...prev, buyer_cost: e.target.value }))}
                    placeholder="9417"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs">Fortjeneste (kr)</Label>
                  <Input
                    type="number"
                    value={formData.profit}
                    onChange={(e) => setFormData(prev => ({ ...prev, profit: e.target.value }))}
                    placeholder="30931"
                  />
                </div>
                <div></div>
              </div>

              <div>
                <Label className="text-xs">Notater</Label>
                <Textarea
                  value={formData.notes}
                  onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Kontrakt er signert, venter kun på finans bevis fra kjøper."
                  rows={2}
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="ghost" onClick={() => setShowForm(false)}>
                  Avbryt
                </Button>
                <Button type="submit" disabled={submitting}>
                  {submitting ? "Publiserer..." : "Publiser"}
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>

      {/* Feed */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-8 text-muted-foreground">
            Laster meldinger...
          </div>
        ) : announcements.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            Ingen salgsmeldinger ennå. Vær den første til å dele!
          </div>
        ) : (
          announcements.map((announcement) => {
            const isExpanded = expandedPosts.has(announcement.id);
            const announcementLikes = likes[announcement.id] || [];
            const announcementComments = comments[announcement.id] || [];
            const userLiked = hasUserLiked(announcement.id);
            const showCommentsSection = showComments.has(announcement.id);
            
            return (
              <Card key={announcement.id} className="shadow-sm">
                <CardContent className="p-4">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-blue-500 text-white text-sm">
                          {getInitials(announcement.author_name)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-sm">{announcement.author_name}</span>
                          <span className="bg-blue-100 text-blue-700 text-xs px-1.5 py-0.5 rounded">
                            Selger
                          </span>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {formatDate(announcement.created_at)} · 🌐
                        </span>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Content */}
                  <div className="mb-3">
                    <p className="text-foreground">
                      <span className="font-semibold">{announcement.registration_number}</span>, {announcement.car_make} {announcement.car_model}. Solgt for {formatCurrency(announcement.sold_price)} {announcement.extras && `inkl ${announcement.extras}`}
                    </p>
                    <p className="text-foreground mt-1">
                      Tilsammen {formatCurrency(announcement.total_amount)}
                    </p>
                    <p className="text-blue-600 mt-2">
                      {announcement.seller_name} sin bil.
                    </p>
                    
                    {isExpanded && (
                      <div className="mt-3 space-y-1 text-sm">
                        {announcement.buyer_cost && (
                          <p className="text-muted-foreground">{formatCurrency(announcement.buyer_cost)}kr i påkost.</p>
                        )}
                        {announcement.profit && (
                          <p className="text-green-600 font-medium">Fortjenste {formatCurrency(announcement.profit)}kr</p>
                        )}
                        {announcement.notes && (
                          <p className="text-muted-foreground mt-2">{announcement.notes}</p>
                        )}
                      </div>
                    )}

                    {(announcement.buyer_cost || announcement.profit || announcement.notes) && (
                      <button 
                        onClick={() => toggleExpand(announcement.id)}
                        className="text-muted-foreground text-sm mt-2 hover:underline flex items-center gap-1"
                      >
                        {isExpanded ? (
                          <>Se mindre <ChevronUp className="h-3 w-3" /></>
                        ) : (
                          <>Se mer <ChevronDown className="h-3 w-3" /></>
                        )}
                      </button>
                    )}
                  </div>

                  {/* Reactions summary */}
                  <div className="flex items-center justify-between text-sm text-muted-foreground py-2 border-t border-b border-border">
                    <div className="flex items-center gap-1">
                      {announcementLikes.length > 0 && (
                        <>
                          <span className="bg-blue-500 text-white rounded-full p-0.5">
                            <ThumbsUp className="h-3 w-3" />
                          </span>
                          <span>{announcementLikes.length}</span>
                        </>
                      )}
                    </div>
                    {announcementComments.length > 0 && (
                      <button 
                        onClick={() => toggleComments(announcement.id)}
                        className="hover:underline"
                      >
                        {announcementComments.length} kommentar{announcementComments.length !== 1 ? 'er' : ''}
                      </button>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-around pt-2">
                    <Button 
                      variant="ghost" 
                      className={`flex-1 ${userLiked ? 'text-blue-600' : 'text-muted-foreground'} hover:bg-muted`}
                      onClick={() => handleLike(announcement.id)}
                    >
                      <ThumbsUp className={`h-4 w-4 mr-2 ${userLiked ? 'fill-current' : ''}`} />
                      Liker
                    </Button>
                    <Button 
                      variant="ghost" 
                      className="flex-1 text-muted-foreground hover:bg-muted"
                      onClick={() => toggleComments(announcement.id)}
                    >
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Kommenter
                    </Button>
                    <Button 
                      variant="ghost" 
                      className="flex-1 text-muted-foreground hover:bg-muted"
                      onClick={() => handleShare(announcement)}
                    >
                      <Send className="h-4 w-4 mr-2" />
                      Send
                    </Button>
                  </div>

                  {/* Comments section */}
                  {showCommentsSection && (
                    <div className="mt-4 space-y-3 border-t border-border pt-3">
                      {/* Existing comments */}
                      {announcementComments.map((comment) => (
                        <div key={comment.id} className="flex gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="bg-gray-200 text-gray-600 text-xs">
                              {getInitials(comment.author_name)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="bg-muted rounded-2xl px-3 py-2">
                              <span className="font-semibold text-sm">{comment.author_name}</span>
                              <p className="text-sm">{comment.content}</p>
                            </div>
                            <span className="text-xs text-muted-foreground ml-3">
                              {formatDate(comment.created_at)}
                            </span>
                          </div>
                        </div>
                      ))}

                      {/* Comment input */}
                      <div className="flex gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-primary/10 text-primary text-xs">
                            {getInitials(currentUser)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 flex gap-2">
                          <Input
                            value={commentInputs[announcement.id] || ""}
                            onChange={(e) => setCommentInputs(prev => ({ ...prev, [announcement.id]: e.target.value }))}
                            placeholder="Skriv en kommentar..."
                            className="rounded-full"
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleComment(announcement.id);
                              }
                            }}
                          />
                          <Button 
                            size="icon" 
                            variant="ghost"
                            onClick={() => handleComment(announcement.id)}
                            disabled={!commentInputs[announcement.id]?.trim()}
                          >
                            <Send className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
