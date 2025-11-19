import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Calendar, MapPin, Plus, Trash2, Edit, Users } from "lucide-react";
import { format, parseISO } from "date-fns";

interface FamilyEvent {
  id: string;
  title: string;
  description?: string;
  event_date: string;
  event_type: string;
  location?: string;
  related_member_ids?: string[];
  created_at: string;
}

interface FamilyMember {
  id: string;
  name: string;
}

const eventTypes = [
  { value: "birth", label: "Birth" },
  { value: "wedding", label: "Wedding" },
  { value: "anniversary", label: "Anniversary" },
  { value: "graduation", label: "Graduation" },
  { value: "migration", label: "Migration" },
  { value: "achievement", label: "Achievement" },
  { value: "reunion", label: "Family Reunion" },
  { value: "other", label: "Other" },
];

export const FamilyEventsManager = () => {
  const [events, setEvents] = useState<FamilyEvent[]>([]);
  const [members, setMembers] = useState<FamilyMember[]>([]);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingEvent, setEditingEvent] = useState<FamilyEvent | null>(null);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    event_date: "",
    event_type: "other",
    location: "",
    related_member_ids: [] as string[],
  });

  useEffect(() => {
    fetchEvents();
    fetchMembers();
  }, []);

  const fetchEvents = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from("family_events")
      .select("*")
      .eq("parent_id", user.id)
      .order("event_date", { ascending: false });

    if (error) {
      toast.error("Failed to load events");
      return;
    }

    setEvents(data || []);
  };

  const fetchMembers = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from("family_members")
      .select("id, name")
      .eq("parent_id", user.id);

    if (error) {
      toast.error("Failed to load family members");
      return;
    }

    setMembers(data || []);
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      event_date: "",
      event_type: "other",
      location: "",
      related_member_ids: [],
    });
    setEditingEvent(null);
  };

  const handleOpenCreate = () => {
    resetForm();
    setShowCreateDialog(true);
  };

  const handleOpenEdit = (event: FamilyEvent) => {
    setEditingEvent(event);
    setFormData({
      title: event.title,
      description: event.description || "",
      event_date: event.event_date,
      event_type: event.event_type,
      location: event.location || "",
      related_member_ids: event.related_member_ids || [],
    });
    setShowCreateDialog(true);
  };

  const handleSave = async () => {
    if (!formData.title || !formData.event_date) {
      toast.error("Please fill in required fields");
      return;
    }

    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      toast.error("You must be logged in");
      setLoading(false);
      return;
    }

    const eventData = {
      parent_id: user.id,
      title: formData.title,
      description: formData.description || null,
      event_date: formData.event_date,
      event_type: formData.event_type,
      location: formData.location || null,
      related_member_ids: formData.related_member_ids,
    };

    let error;
    if (editingEvent) {
      ({ error } = await supabase
        .from("family_events")
        .update(eventData)
        .eq("id", editingEvent.id));
    } else {
      ({ error } = await supabase.from("family_events").insert(eventData));
    }

    setLoading(false);

    if (error) {
      toast.error(`Failed to ${editingEvent ? "update" : "create"} event`);
      return;
    }

    toast.success(`Event ${editingEvent ? "updated" : "created"} successfully!`);
    setShowCreateDialog(false);
    resetForm();
    fetchEvents();
  };

  const handleDelete = async (eventId: string) => {
    const { error } = await supabase
      .from("family_events")
      .delete()
      .eq("id", eventId);

    if (error) {
      toast.error("Failed to delete event");
      return;
    }

    toast.success("Event deleted");
    fetchEvents();
  };

  const getEventTypeLabel = (type: string) => {
    return eventTypes.find((t) => t.value === type)?.label || type;
  };

  const getRelatedMemberNames = (memberIds: string[]) => {
    return members
      .filter((m) => memberIds.includes(m.id))
      .map((m) => m.name)
      .join(", ");
  };

  return (
    <>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-semibold">Family Events</h3>
            <p className="text-muted-foreground">
              Record important milestones and celebrations
            </p>
          </div>
          <Button onClick={handleOpenCreate}>
            <Plus className="h-4 w-4 mr-2" />
            Add Event
          </Button>
        </div>

        {events.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Events Yet</h3>
              <p className="text-muted-foreground text-center mb-4">
                Start recording important family events and milestones
              </p>
              <Button onClick={handleOpenCreate}>
                <Plus className="h-4 w-4 mr-2" />
                Create First Event
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {events.map((event) => (
              <Card key={event.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="flex items-center gap-2">
                        {event.title}
                        <Badge variant="secondary">
                          {getEventTypeLabel(event.event_type)}
                        </Badge>
                      </CardTitle>
                      <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {format(parseISO(event.event_date), "MMMM d, yyyy")}
                        </div>
                        {event.location && (
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {event.location}
                          </div>
                        )}
                        {event.related_member_ids && event.related_member_ids.length > 0 && (
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            {getRelatedMemberNames(event.related_member_ids)}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleOpenEdit(event)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(event.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                {event.description && (
                  <CardContent>
                    <p className="text-muted-foreground">{event.description}</p>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>

      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingEvent ? "Edit Event" : "Create New Event"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Event Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder="e.g., Sarah's Graduation"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="event_type">Event Type</Label>
                <Select
                  value={formData.event_type}
                  onValueChange={(value) =>
                    setFormData({ ...formData, event_type: value })
                  }
                >
                  <SelectTrigger id="event_type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {eventTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="event_date">Date *</Label>
                <Input
                  id="event_date"
                  type="date"
                  value={formData.event_date}
                  onChange={(e) =>
                    setFormData({ ...formData, event_date: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
                placeholder="e.g., New York City"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Add details about this event..."
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label>Related Family Members</Label>
              <div className="flex flex-wrap gap-2">
                {members.map((member) => (
                  <Button
                    key={member.id}
                    type="button"
                    variant={
                      formData.related_member_ids.includes(member.id)
                        ? "default"
                        : "outline"
                    }
                    size="sm"
                    onClick={() => {
                      const isSelected = formData.related_member_ids.includes(
                        member.id
                      );
                      setFormData({
                        ...formData,
                        related_member_ids: isSelected
                          ? formData.related_member_ids.filter(
                              (id) => id !== member.id
                            )
                          : [...formData.related_member_ids, member.id],
                      });
                    }}
                  >
                    {member.name}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowCreateDialog(false);
                resetForm();
              }}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={loading}>
              {loading ? "Saving..." : editingEvent ? "Update" : "Create"} Event
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
