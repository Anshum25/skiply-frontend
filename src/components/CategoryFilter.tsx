import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BUSINESS_CATEGORIES } from "@/lib/constants";
import { BusinessCategory } from "@/lib/types";
import { useApp } from "@/contexts/AppContext";

export interface CategoryFilterCategory {
  value: BusinessCategory;
  label: string;
  icon: string;
  // allow extra fields (like color) for flexibility
  [key: string]: any;
}

export interface CategoryFilterProps {
  categories: CategoryFilterCategory[];
  selectedCategory: BusinessCategory | "all";
  onCategorySelect: (category: BusinessCategory | "all") => void;
}

export function CategoryFilter({
  categories,
  selectedCategory,
  onCategorySelect,
}: CategoryFilterProps) {
  return (
    <Select
      value={selectedCategory}
      onValueChange={onCategorySelect}
    >
      <SelectTrigger className="w-[200px]">
        <SelectValue placeholder="Select category" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All Categories</SelectItem>
        {categories.map((category) => (
          <SelectItem key={category.value} value={category.value}>
            <div className="flex items-center space-x-2">
              <span>{category.icon}</span>
              <span>{category.label}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
