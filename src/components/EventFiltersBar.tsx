import { useState, useEffect, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCategories } from "@/hooks/useEvents";
import { Search, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EventFiltersBarProps {
  onFilterChange: (filters: {
    search?: string;
    category?: string;
    dateFrom?: string;
    dateTo?: string;
  }) => void;
}

export const EventFiltersBar = ({ onFilterChange }: EventFiltersBarProps) => {
  const { data: categories } = useCategories();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [dateFrom, setDateFrom] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const emitFilters = useCallback(() => {
    onFilterChange({
      search: search || undefined,
      category: category === "all" ? undefined : category,
      dateFrom: dateFrom || undefined,
    });
  }, [search, category, dateFrom, onFilterChange]);

  useEffect(() => {
    const timer = setTimeout(emitFilters, 300);
    return () => clearTimeout(timer);
  }, [emitFilters]);

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search events..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setShowFilters(!showFilters)}
          className={showFilters ? "bg-accent text-accent-foreground" : ""}
        >
          <SlidersHorizontal className="h-4 w-4" />
        </Button>
      </div>

      {showFilters && (
        <div className="flex flex-wrap gap-3 animate-fade-in">
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories?.map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            className="w-[180px]"
            placeholder="From date"
          />
        </div>
      )}
    </div>
  );
};
