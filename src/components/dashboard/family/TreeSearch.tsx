import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, X, Filter } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface TreeSearchProps {
  onSearchChange: (query: string) => void;
  onRelationshipFilter: (type: string | null) => void;
  searchQuery: string;
  relationshipFilter: string | null;
}

const relationshipTypes = [
  { value: "all", label: "All Relationships" },
  { value: "parent", label: "Parents" },
  { value: "child", label: "Children" },
  { value: "spouse", label: "Spouses" },
  { value: "sibling", label: "Siblings" },
  { value: "grandparent", label: "Grandparents" },
  { value: "grandchild", label: "Grandchildren" },
  { value: "aunt_uncle", label: "Aunts/Uncles" },
  { value: "niece_nephew", label: "Nieces/Nephews" },
  { value: "cousin", label: "Cousins" },
];

export const TreeSearch = ({
  onSearchChange,
  onRelationshipFilter,
  searchQuery,
  relationshipFilter,
}: TreeSearchProps) => {
  const [localQuery, setLocalQuery] = useState(searchQuery);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const handleSearchChange = (value: string) => {
    setLocalQuery(value);
    onSearchChange(value);
  };

  const handleClearSearch = () => {
    setLocalQuery("");
    onSearchChange("");
  };

  const handleRelationshipChange = (value: string) => {
    if (value === "all") {
      onRelationshipFilter(null);
    } else {
      onRelationshipFilter(value);
    }
  };

  const hasActiveFilters = searchQuery || relationshipFilter;

  return (
    <div className="flex items-center gap-2">
      <div className="relative flex-1 max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search family members..."
          value={localQuery}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="pl-9 pr-9"
        />
        {localQuery && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
            onClick={handleClearSearch}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
        <PopoverTrigger asChild>
          <Button
            variant={relationshipFilter ? "default" : "outline"}
            size="icon"
            className="relative"
          >
            <Filter className="h-4 w-4" />
            {relationshipFilter && (
              <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-primary" />
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent align="end" className="w-64">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Filter by Relationship</Label>
              <Select
                value={relationshipFilter || "all"}
                onValueChange={handleRelationshipChange}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {relationshipTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {hasActiveFilters && (
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => {
                  handleClearSearch();
                  onRelationshipFilter(null);
                  setIsFilterOpen(false);
                }}
              >
                Clear All Filters
              </Button>
            )}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};
