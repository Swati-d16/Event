import { useState, useCallback, useEffect, useRef } from "react";
import { Navbar } from "@/components/Navbar";
import { EventCard } from "@/components/EventCard";
import { EventFiltersBar } from "@/components/EventFiltersBar";
import { useInfiniteEvents } from "@/hooks/useEvents";
import { Loader2 } from "lucide-react";

const EventsPage = () => {
  const [filters, setFilters] = useState<{
    search?: string;
    category?: string;
    dateFrom?: string;
  }>({});

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteEvents(filters);

  const loadMoreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 }
    );

    if (loadMoreRef.current) observer.observe(loadMoreRef.current);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const handleFilterChange = useCallback(
    (newFilters: typeof filters) => setFilters(newFilters),
    []
  );

  const events = data?.pages.flat() ?? [];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="font-heading text-3xl font-bold text-foreground sm:text-4xl">
            Discover Events
          </h1>
          <p className="mt-2 text-muted-foreground">
            Find and register for events that interest you
          </p>
        </div>

        <div className="mb-8">
          <EventFiltersBar onFilterChange={handleFilterChange} />
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : events.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-lg text-muted-foreground">No events found</p>
            <p className="mt-1 text-sm text-muted-foreground">Try adjusting your filters</p>
          </div>
        ) : (
          <>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {events.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>

            <div ref={loadMoreRef} className="flex justify-center py-8">
              {isFetchingNextPage && (
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default EventsPage;
