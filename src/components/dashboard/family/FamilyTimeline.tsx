import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, User, Plus } from "lucide-react";
import { format, parseISO } from "date-fns";
import { toast } from "sonner";
import { MemberDetailDialog } from "./MemberDetailDialog";

interface FamilyMember {
  id: string;
  name: string;
  relationship?: string;
  birth_date?: string;
  location?: string;
  bio?: string;
  photo_url?: string;
}

interface TimelineEvent {
  type: "birth" | "event";
  date: string;
  member?: FamilyMember;
  title?: string;
  description?: string;
}

export const FamilyTimeline = () => {
  const [members, setMembers] = useState<FamilyMember[]>([]);
  const [timeline, setTimeline] = useState<TimelineEvent[]>([]);
  const [selectedMember, setSelectedMember] = useState<FamilyMember | null>(null);
  const [showMemberDialog, setShowMemberDialog] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from("family_members")
      .select("*")
      .eq("parent_id", user.id)
      .not("birth_date", "is", null)
      .order("birth_date", { ascending: true });

    if (error) {
      toast.error("Failed to load family members");
      setLoading(false);
      return;
    }

    setMembers(data || []);
    
    // Build timeline from members' birth dates
    const events: TimelineEvent[] = (data || []).map(member => ({
      type: "birth",
      date: member.birth_date!,
      member,
    }));

    setTimeline(events);
    setLoading(false);
  };

  const handleMemberClick = (member: FamilyMember) => {
    setSelectedMember(member);
    setShowMemberDialog(true);
  };

  const groupByDecade = (events: TimelineEvent[]) => {
    const groups: { [key: string]: TimelineEvent[] } = {};
    
    events.forEach(event => {
      const year = new Date(event.date).getFullYear();
      const decade = Math.floor(year / 10) * 10;
      const key = `${decade}s`;
      
      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(event);
    });

    return groups;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (timeline.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Timeline Data</h3>
          <p className="text-muted-foreground text-center mb-4">
            Add birth dates to family members to see them on the timeline
          </p>
        </CardContent>
      </Card>
    );
  }

  const groupedTimeline = groupByDecade(timeline);
  const decades = Object.keys(groupedTimeline).sort((a, b) => 
    parseInt(a) - parseInt(b)
  );

  return (
    <>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-semibold">Family Timeline</h3>
            <p className="text-muted-foreground">
              Chronological view of your family history
            </p>
          </div>
        </div>

        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border" />

          {decades.map((decade, decadeIndex) => (
            <div key={decade} className="relative mb-12">
              {/* Decade marker */}
              <div className="sticky top-0 z-10 bg-background pb-4 mb-6">
                <Badge variant="secondary" className="text-lg px-4 py-2">
                  {decade}
                </Badge>
              </div>

              <div className="space-y-6 pl-12">
                {groupedTimeline[decade].map((event, eventIndex) => (
                  <div key={`${decade}-${eventIndex}`} className="relative">
                    {/* Timeline dot */}
                    <div className="absolute -left-[30px] top-3 w-3 h-3 rounded-full bg-primary border-4 border-background" />

                    <Card 
                      className="hover:shadow-lg transition-shadow cursor-pointer"
                      onClick={() => event.member && handleMemberClick(event.member)}
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            {event.member?.photo_url ? (
                              <img
                                src={event.member.photo_url}
                                alt={event.member.name}
                                className="w-12 h-12 rounded-full object-cover"
                              />
                            ) : (
                              <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                                <User className="h-6 w-6 text-muted-foreground" />
                              </div>
                            )}
                            <div>
                              <CardTitle className="text-lg">
                                {event.member?.name}
                              </CardTitle>
                              {event.member?.relationship && (
                                <Badge variant="outline" className="mt-1">
                                  {event.member.relationship}
                                </Badge>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-2 text-muted-foreground text-sm">
                            <Calendar className="h-4 w-4" />
                            {format(parseISO(event.date), "MMMM d, yyyy")}
                          </div>
                        </div>
                      </CardHeader>
                      {(event.member?.location || event.member?.bio) && (
                        <CardContent>
                          {event.member.location && (
                            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                              <MapPin className="h-4 w-4" />
                              {event.member.location}
                            </div>
                          )}
                          {event.member.bio && (
                            <p className="text-sm text-muted-foreground line-clamp-2">
                              {event.member.bio}
                            </p>
                          )}
                        </CardContent>
                      )}
                    </Card>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <MemberDetailDialog
        member={selectedMember}
        open={showMemberDialog}
        onClose={() => setShowMemberDialog(false)}
        onUpdate={fetchMembers}
      />
    </>
  );
};
