import { Link } from "react-router-dom";
import { format } from "date-fns";
import { MapPin, Calendar, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { EventWithDetails } from "@/hooks/useEvents";

interface EventCardProps {
  event: EventWithDetails;
}

export const EventCard = ({ event }: EventCardProps) => {
  const spotsLeft = event.capacity - event.registration_count;
  const isFull = spotsLeft <= 0;

  return (
    <Link to={`/events/${event.id}`} className="group block">
      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-card transition-all duration-300 hover:shadow-elevated hover:-translate-y-1">
        <div className="relative h-44 overflow-hidden bg-muted">
          {event.image_url ? (
            <img
              src={event.image_url}
              alt={event.name}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center gradient-hero">
              <Calendar className="h-12 w-12 text-primary-foreground/40" />
            </div>
          )}
          {event.event_categories && (
            <Badge className="absolute left-3 top-3 bg-card/90 text-foreground backdrop-blur-sm border-0 text-xs font-medium">
              {event.event_categories.name}
            </Badge>
          )}
          {isFull && (
            <Badge variant="destructive" className="absolute right-3 top-3 text-xs">
              Sold Out
            </Badge>
          )}
        </div>
        <div className="p-5">
          <h3 className="font-heading text-lg font-semibold text-foreground line-clamp-1 group-hover:text-primary transition-colors">
            {event.name}
          </h3>
          <div className="mt-3 flex flex-col gap-1.5 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Calendar className="h-3.5 w-3.5 shrink-0" />
              <span>{format(new Date(event.event_date), "MMM d, yyyy")} · {event.event_time.slice(0, 5)}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-3.5 w-3.5 shrink-0" />
              <span className="line-clamp-1">{event.location}</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-3.5 w-3.5 shrink-0" />
              <span>{isFull ? "No spots left" : `${spotsLeft} spots left`}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};
