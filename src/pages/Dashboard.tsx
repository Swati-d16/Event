import { useAuth } from "@/contexts/AuthContext";
import { useUserRegistrations } from "@/hooks/useEvents";
import { Navbar } from "@/components/Navbar";
import { EventCard } from "@/components/EventCard";
import { Loader2, CalendarCheck, CalendarClock, History } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { EventWithDetails } from "@/hooks/useEvents";

const DashboardPage = () => {
  const { user } = useAuth();
  const { data: registrations, isLoading } = useUserRegistrations(user?.id);

  const now = new Date();

  const enrichedEvents: EventWithDetails[] = (registrations || []).map((reg) => {
    const ev = reg.events as any;
    return {
      ...ev,
      registration_count: 0,
    };
  });

  const upcoming = enrichedEvents.filter(
    (e) => new Date(e.event_date) >= now
  );
  const past = enrichedEvents.filter(
    (e) => new Date(e.event_date) < now
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="font-heading text-3xl font-bold text-foreground sm:text-4xl">
            My Dashboard
          </h1>
          <p className="mt-2 text-muted-foreground">
            Manage your event registrations
          </p>
        </div>

        {/* Stats */}
        <div className="mb-8 grid gap-4 sm:grid-cols-3">
          <div className="flex items-center gap-4 rounded-2xl border border-border bg-card p-5 shadow-card">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
              <CalendarCheck className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold font-heading text-foreground">{enrichedEvents.length}</p>
              <p className="text-sm text-muted-foreground">Total Registrations</p>
            </div>
          </div>
          <div className="flex items-center gap-4 rounded-2xl border border-border bg-card p-5 shadow-card">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-success/10">
              <CalendarClock className="h-6 w-6 text-success" />
            </div>
            <div>
              <p className="text-2xl font-bold font-heading text-foreground">{upcoming.length}</p>
              <p className="text-sm text-muted-foreground">Upcoming Events</p>
            </div>
          </div>
          <div className="flex items-center gap-4 rounded-2xl border border-border bg-card p-5 shadow-card">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-muted">
              <History className="h-6 w-6 text-muted-foreground" />
            </div>
            <div>
              <p className="text-2xl font-bold font-heading text-foreground">{past.length}</p>
              <p className="text-sm text-muted-foreground">Past Events</p>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <Tabs defaultValue="upcoming" className="w-full">
            <TabsList>
              <TabsTrigger value="upcoming">Upcoming ({upcoming.length})</TabsTrigger>
              <TabsTrigger value="past">Past ({past.length})</TabsTrigger>
              <TabsTrigger value="all">All ({enrichedEvents.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="upcoming" className="mt-6">
              {upcoming.length === 0 ? (
                <p className="py-12 text-center text-muted-foreground">No upcoming events</p>
              ) : (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {upcoming.map((event) => (
                    <EventCard key={event.id} event={event} />
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="past" className="mt-6">
              {past.length === 0 ? (
                <p className="py-12 text-center text-muted-foreground">No past events</p>
              ) : (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {past.map((event) => (
                    <EventCard key={event.id} event={event} />
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="all" className="mt-6">
              {enrichedEvents.length === 0 ? (
                <p className="py-12 text-center text-muted-foreground">You haven't registered for any events yet</p>
              ) : (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {enrichedEvents.map((event) => (
                    <EventCard key={event.id} event={event} />
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        )}
      </main>
    </div>
  );
};

export default DashboardPage;
