"use client";

import { useMemo, useState } from "react";
import { FilterXIcon, SlidersHorizontalIcon } from "lucide-react";

import { RoomCard } from "@/components/room-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import type { BedType, RoomCategory } from "@/lib/data";
import type { RoomSummary } from "@/lib/content";
import { formatNaira } from "@/lib/site";
import { cn } from "@/lib/utils";

const bedTypes: BedType[] = ["King", "Queen", "Double"];
const guestOptions = [1, 2, 3, 4, 5];
const priceCaps = [50000, 75000, 100000, 200000];
/** The handful of amenities guests actually filter by. */
const filterableAmenities = [
  "Bathtub & rain shower",
  "Breakfast for two included",
  "Kitchenette",
  "Two bathrooms",
  "Nespresso machine",
];

interface Filters {
  categories: RoomCategory[];
  beds: BedType[];
  guests: number | null;
  maxPrice: number | null;
  amenities: string[];
  accessibleOnly: boolean;
}

const emptyFilters: Filters = {
  categories: [],
  beds: [],
  guests: null,
  maxPrice: null,
  amenities: [],
  accessibleOnly: false,
};

/**
 * The rooms index: filters plus results.
 *
 * All filtering is in memory over six rooms — no network, no loading state, and
 * results update the instant a control changes.
 */
export function RoomsExplorer({ rooms }: { rooms: RoomSummary[] }) {
  // Categories come from the content, in the order the dashboard defines.
  const roomCategories = Array.from(
    new Set(rooms.map((room) => room.category)),
  );

  const [filters, setFilters] = useState<Filters>(emptyFilters);
  const [sort, setSort] = useState<"recommended" | "low" | "high" | "size">(
    "recommended",
  );

  const toggle = <K extends "categories" | "beds" | "amenities">(
    key: K,
    value: Filters[K][number],
  ) =>
    setFilters((current) => {
      const list = current[key] as string[];
      return {
        ...current,
        [key]: list.includes(value as string)
          ? list.filter((entry) => entry !== value)
          : [...list, value],
      };
    });

  const activeCount =
    filters.categories.length +
    filters.beds.length +
    filters.amenities.length +
    (filters.guests ? 1 : 0) +
    (filters.maxPrice ? 1 : 0) +
    (filters.accessibleOnly ? 1 : 0);

  const results = useMemo(() => {
    const matched = rooms.filter((room) => {
      if (filters.categories.length && !filters.categories.includes(room.category))
        return false;
      if (filters.beds.length && !filters.beds.includes(room.bed)) return false;
      if (filters.guests && room.maxAdults + room.maxChildren < filters.guests)
        return false;
      if (filters.maxPrice && room.rate > filters.maxPrice) return false;
      if (filters.accessibleOnly && !room.accessible) return false;
      if (
        filters.amenities.length &&
        !filters.amenities.every((amenity) => room.amenities.includes(amenity))
      )
        return false;
      return true;
    });

    switch (sort) {
      case "low":
        return [...matched].sort((a, b) => a.rate - b.rate);
      case "high":
        return [...matched].sort((a, b) => b.rate - a.rate);
      case "size":
        return [...matched].sort((a, b) => b.sizeSqm - a.sizeSqm);
      default:
        return matched;
    }
  }, [rooms, filters, sort]);

  const panel = (
    <div className="space-y-6">
      <FilterGroup label="Room type">
        <div className="flex flex-wrap gap-2">
          {roomCategories.map((category) => (
            <Chip
              key={category}
              active={filters.categories.includes(category)}
              onClick={() => toggle("categories", category)}
            >
              {category}
            </Chip>
          ))}
        </div>
      </FilterGroup>

      <Separator />

      <FilterGroup label="Guests">
        <div className="flex flex-wrap gap-2">
          {guestOptions.map((count) => (
            <Chip
              key={count}
              active={filters.guests === count}
              onClick={() =>
                setFilters((current) => ({
                  ...current,
                  guests: current.guests === count ? null : count,
                }))
              }
            >
              {count}+
            </Chip>
          ))}
        </div>
      </FilterGroup>

      <Separator />

      <FilterGroup label="Bed type">
        <div className="flex flex-wrap gap-2">
          {bedTypes.map((bed) => (
            <Chip
              key={bed}
              active={filters.beds.includes(bed)}
              onClick={() => toggle("beds", bed)}
            >
              {bed}
            </Chip>
          ))}
        </div>
      </FilterGroup>

      <Separator />

      <FilterGroup label="Nightly rate up to">
        <div className="flex flex-wrap gap-2">
          {priceCaps.map((cap) => (
            <Chip
              key={cap}
              active={filters.maxPrice === cap}
              onClick={() =>
                setFilters((current) => ({
                  ...current,
                  maxPrice: current.maxPrice === cap ? null : cap,
                }))
              }
            >
              {formatNaira(cap)}
            </Chip>
          ))}
        </div>
      </FilterGroup>

      <Separator />

      <FilterGroup label="Amenities">
        <ul className="space-y-2.5">
          {filterableAmenities.map((amenity) => {
            const id = `amenity-${amenity.replace(/\W+/g, "-").toLowerCase()}`;
            return (
              <li key={amenity} className="flex items-center gap-2.5">
                <Checkbox
                  id={id}
                  checked={filters.amenities.includes(amenity)}
                  onCheckedChange={() => toggle("amenities", amenity)}
                />
                <Label htmlFor={id} className="text-sm font-normal">
                  {amenity}
                </Label>
              </li>
            );
          })}
          <li className="flex items-center gap-2.5">
            <Checkbox
              id="accessible-only"
              checked={filters.accessibleOnly}
              onCheckedChange={(checked) =>
                setFilters((current) => ({
                  ...current,
                  accessibleOnly: checked === true,
                }))
              }
            />
            <Label htmlFor="accessible-only" className="text-sm font-normal">
              Step-free / accessible rooms only
            </Label>
          </li>
        </ul>
      </FilterGroup>

      {activeCount > 0 && (
        <Button
          variant="outline"
          size="lg"
          className="h-11 w-full font-bold"
          onClick={() => setFilters(emptyFilters)}
        >
          <FilterXIcon /> Clear all filters
        </Button>
      )}
    </div>
  );

  return (
    <div className="grid gap-10 lg:grid-cols-[17rem_1fr] lg:gap-12">
      {/* Desktop filter rail */}
      <aside
        aria-label="Filter rooms"
        className="hidden lg:sticky lg:top-28 lg:block lg:h-fit"
      >
        {panel}
      </aside>

      <div>
        <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
          <p aria-live="polite" className="text-sm font-semibold">
            {results.length} room{results.length === 1 ? "" : "s"}
            {activeCount > 0 && (
              <span className="text-muted-foreground">
                {" "}
                · {activeCount} filter{activeCount === 1 ? "" : "s"} applied
              </span>
            )}
          </p>

          <div className="flex items-center gap-2">
            <label htmlFor="sort" className="sr-only">
              Sort rooms
            </label>
            <select
              id="sort"
              value={sort}
              onChange={(event) =>
                setSort(event.target.value as typeof sort)
              }
              className="h-11 rounded-lg border border-input bg-background px-3 text-sm font-semibold"
            >
              <option value="recommended">Recommended</option>
              <option value="low">Price: low to high</option>
              <option value="high">Price: high to low</option>
              <option value="size">Largest first</option>
            </select>

            {/* Mobile filter tray */}
            <Sheet>
              <SheetTrigger
                render={
                  <Button
                    variant="outline"
                    size="lg"
                    className="h-11 font-bold lg:hidden"
                  />
                }
              >
                <SlidersHorizontalIcon /> Filters
                {activeCount > 0 && (
                  <Badge className="ml-1 bg-brand text-brand-foreground">
                    {activeCount}
                  </Badge>
                )}
              </SheetTrigger>
              <SheetContent side="bottom" className="max-h-[85svh] overflow-y-auto">
                <SheetHeader>
                  <SheetTitle>Filter rooms</SheetTitle>
                  <SheetDescription>
                    {results.length} of {rooms.length} rooms match
                  </SheetDescription>
                </SheetHeader>
                <div className="px-4 pb-2">{panel}</div>
                <SheetFooter>
                  <SheetClose
                    render={
                      <Button
                        size="lg"
                        className="h-12 w-full bg-brand font-bold text-brand-foreground hover:bg-brand/90"
                      />
                    }
                  >
                    Show {results.length} room{results.length === 1 ? "" : "s"}
                  </SheetClose>
                </SheetFooter>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {results.length === 0 ? (
          <div className="rounded-2xl border border-dashed p-12 text-center">
            <h2 className="font-heading text-xl font-extrabold">
              No rooms match those filters
            </h2>
            <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">
              Try relaxing one of them — or call us on 0803 383 3628 and
              we&apos;ll find something that works.
            </p>
            <Button
              size="lg"
              className="mt-6 h-11 bg-brand font-bold text-brand-foreground hover:bg-brand/90"
              onClick={() => setFilters(emptyFilters)}
            >
              Clear filters
            </Button>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {results.map((room, index) => (
              <RoomCard key={room.slug} room={room} priority={index < 3} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function FilterGroup({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <fieldset>
      <legend className="mb-3 text-xs font-bold tracking-[0.14em] text-muted-foreground uppercase">
        {label}
      </legend>
      {children}
    </fieldset>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        "min-h-11 rounded-full px-4 text-sm font-bold ring-1 transition-colors",
        active
          ? "bg-brand text-brand-foreground ring-brand"
          : "bg-background text-muted-foreground ring-border hover:text-foreground",
      )}
    >
      {children}
    </button>
  );
}
