import { useParams, useNavigate } from "react-router-dom";
import { useEvent, useIsRegistered } from "@/hooks/useEvents";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { Calendar, MapPin, Users, User, ArrowLeft, Loader2 } from "lucide-react";

const EventDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { data: event, isLoading } = useEvent(id!);
  const { data: registration } = useIsRegistered(id!, user?.id);
  const { toast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const spotsLeft = event ? event.capacity - event.registration_count : 0;
  const isFull = spotsLeft <= 0;
  const isRegistered = !!registration;

  const handleRegister = async () => {
    if (!user) {
      navigate("/auth");
      return;
    }
    const { error } = await supabase
      .from("event_registrations")
      .insert({ event_id: id!, user_id: user.id });

    if (error) {
      toast({ title: "Registration failed", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Registered!", description: "You're signed up for this event." });
      queryClient.invalidateQueries({ queryKey: ["registration", id, user.id] });
      queryClient.invalidateQueries({ queryKey: ["event", id] });
      queryClient.invalidateQueries({ queryKey: ["registrations"] });
    }
  };

  const handleCancel = async () => {
    if (!registration) return;
    const { error } = await supabase
      .from("event_registrations")
      .delete()
      .eq("id", registration.id);

    if (error) {
      toast({ title: "Cancellation failed", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Registration cancelled" });
      queryClient.invalidateQueries({ queryKey: ["registration", id, user?.id] });
      queryClient.invalidateQueries({ queryKey: ["event", id] });
      queryClient.invalidateQueries({ queryKey: ["registrations"] });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="py-20 text-center">
          <p className="text-lg text-muted-foreground">Event not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="mb-6 text-muted-foreground">
          <ArrowLeft className="mr-1.5 h-4 w-4" /> Back
        </Button>

        <div className="animate-fade-in">
          {/* Hero */}
          <div className="relative h-64 overflow-hidden rounded-2xl bg-muted sm:h-80">
            {event.image_url ? (
              <img src={event.image_url} alt={event.name} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center gradient-hero">
                <Calendar className="h-20 w-20 text-primary-foreground/30" />
              </div>
            )}
          </div>

          {/* Content */}
          <div className="mt-8 grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <div className="flex flex-wrap items-center gap-3">
                {event.event_categories && (
                  <Badge variant="secondary">{event.event_categories.name}</Badge>
                )}
                {isFull && <Badge variant="destructive">Sold Out</Badge>}
              </div>

              <h1 className="mt-4 font-heading text-3xl font-bold text-foreground sm:text-4xl">
                {event.name}
              </h1>

              <p className="mt-6 whitespace-pre-wrap text-foreground/80 leading-relaxed">
                {event.description || "No description provided."}
              </p>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
                <div className="space-y-4 text-sm">
                  <div className="flex items-start gap-3">
                    <Calendar className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <div>
                      <p className="font-medium text-foreground">{format(new Date(event.event_date), "EEEE, MMMM d, yyyy")}</p>
                      <p className="text-muted-foreground">{event.event_time.slice(0, 5)}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <p className="text-foreground">{event.location}</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <Users className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <p className="text-foreground">{event.registration_count} / {event.capacity} registered</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <User className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <p className="text-foreground">By {event.profiles?.full_name || "Unknown"}</p>
                  </div>
                </div>

                <div className="mt-6">
                  {isRegistered ? (
                    <Button variant="outline" className="w-full" onClick={handleCancel}>
                      Cancel Registration
                    </Button>
                  ) : (
                    <Button className="w-full" disabled={isFull} onClick={handleRegister}>
                      {isFull ? "Event Full" : user ? "Register Now" : "Sign In to Register"}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default EventDetailPage;
