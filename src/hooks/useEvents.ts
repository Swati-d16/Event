import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface EventWithDetails {
  id: string;
  name: string;
  description: string | null;
  location: string;
  event_date: string;
  event_time: string;
  capacity: number;
  image_url: string | null;
  created_at: string;
  organizer_id: string;
  category_id: string | null;
  event_categories: { id: string; name: string } | null;
  profiles: { id: string; full_name: string | null } | null;
  registration_count: number;
}

const PAGE_SIZE = 12;

interface EventFilters {
  search?: string;
  category?: string;
  dateFrom?: string;
  dateTo?: string;
  location?: string;
}

export const useInfiniteEvents = (filters: EventFilters = {}) => {
  return useInfiniteQuery({
    queryKey: ["events", filters],
    queryFn: async ({ pageParam = 0 }) => {
      let query = supabase
        .from("events")
        .select("*, event_categories(*), profiles!events_organizer_id_fkey(*)")
        .order("event_date", { ascending: true })
        .range(pageParam * PAGE_SIZE, (pageParam + 1) * PAGE_SIZE - 1);

      if (filters.search) {
        query = query.or(`name.ilike.%${filters.search}%,description.ilike.%${filters.search}%,location.ilike.%${filters.search}%`);
      }
      if (filters.category) {
        query = query.eq("category_id", filters.category);
      }
      if (filters.dateFrom) {
        query = query.gte("event_date", filters.dateFrom);
      }
      if (filters.dateTo) {
        query = query.lte("event_date", filters.dateTo);
      }
      if (filters.location) {
        query = query.ilike("location", `%${filters.location}%`);
      }

      const { data, error } = await query;
      if (error) throw error;

      // Fetch registration counts
      const eventsWithCounts: EventWithDetails[] = await Promise.all(
        (data || []).map(async (event) => {
          const { data: count } = await supabase.rpc("get_registration_count", {
            event_uuid: event.id,
          });
          return { ...event, registration_count: count ?? 0 } as EventWithDetails;
        })
      );

      return eventsWithCounts;
    },
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.length === PAGE_SIZE ? allPages.length : undefined;
    },
    initialPageParam: 0,
  });
};

export const useEvent = (id: string) => {
  return useQuery({
    queryKey: ["event", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("events")
        .select("*, event_categories(*), profiles!events_organizer_id_fkey(*)")
        .eq("id", id)
        .single();
      if (error) throw error;

      const { data: count } = await supabase.rpc("get_registration_count", {
        event_uuid: id,
      });

      return { ...data, registration_count: count ?? 0 } as EventWithDetails;
    },
    enabled: !!id,
  });
};

export const useCategories = () => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data, error } = await supabase.from("event_categories").select("*").order("name");
      if (error) throw error;
      return data;
    },
  });
};

export const useUserRegistrations = (userId: string | undefined) => {
  return useQuery({
    queryKey: ["registrations", userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("event_registrations")
        .select("*, events(*, event_categories(*), profiles!events_organizer_id_fkey(*))")
        .eq("user_id", userId!)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!userId,
  });
};

export const useIsRegistered = (eventId: string, userId: string | undefined) => {
  return useQuery({
    queryKey: ["registration", eventId, userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("event_registrations")
        .select("id")
        .eq("event_id", eventId)
        .eq("user_id", userId!)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!userId && !!eventId,
  });
};
