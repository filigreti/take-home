"use client";
import React, { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Check, ChevronsUpDown } from "lucide-react";
import { countries } from "@/lib/countries";
import { format } from "date-fns";
import { DatePickerWithRange } from "./ui/rangepicker";
import { sources } from "next/dist/compiled/webpack/webpack";

interface NewsSource {
  category: string;
  country: string;
  description: string;
  id: string;
  language: string;
  name: string;
  url: string;
}

interface NewsData {
  success: {
    sources: Array<NewsSource>;
  };
}

const Filter = ({ success }: NewsData) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [countryValue, setCountryValue] = useState("");
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get("category") || "general";
  const { replace } = useRouter();
  const pathname = usePathname();
  const query = searchParams.get("query")?.toString();
  const filteredSources = useMemo(() => {
    if (query) {
      return success.sources.filter((source) =>
        source.name.toLowerCase().includes(value.toLowerCase())
      );
    } else {
      return success.sources.filter(
        (source) =>
          source.category === currentCategory &&
          source.name.toLowerCase().includes(value.toLowerCase())
      );
    }
  }, [currentCategory, query]);

  const updateParams = async (key: string, category: string) => {
    const params = new URLSearchParams(searchParams);

    params.delete("sources");
    params.delete("country");
    params.set(key, category);
    setOpen(false);
    replace(`${pathname}?${params.toString()}`);
  };

  const update = async (value: string) => {
    const params = new URLSearchParams(searchParams);
    params.delete("sources");
    params.delete("country");
    params.set("country", value);
    setOpen(false);
    replace(`${pathname}?${params.toString()}`);
  };

  const clearFilter = async () => {
    const params = new URLSearchParams(searchParams);
    params.delete("sources");
    params.delete("country");
    params.delete("from");
    params.delete("to");
    params.delete("query");

    replace(`${pathname}?${params.toString()}`);
  };

  const handleDateRangeChange = (val: any) => {
    const params = new URLSearchParams(searchParams);
    params.delete("sources");
    params.delete("country");
    params.set("from", format(val.from, "yyyy-MM-dd"));
    params.set("to", format(val.to, "yyyy-MM-dd"));
    setOpen(false);
    replace(`${pathname}?${params.toString()}`);
  };

  const memoisedCountries = useMemo(() => {
    return countries;
  }, []);

  return (
    <div className=" relative">
      <div className=" flex items-center justify-between text-sm border-b py-2 px-5">
        <div>Filter</div>
        <div>
          <Button
            onClick={clearFilter}
            className=" text-gray-400 text-xs"
            variant="link"
          >
            Clear
          </Button>
        </div>
      </div>
      <div className="px-5 mt-3  relative ">
        <div>
          <p className=" text-xs mb-2 font-semibold ">Sources</p>

          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                className="w-full justify-between py-4 text-xs"
              >
                {searchParams.get("sources")?.toString()
                  ? filteredSources.find(
                      (sources) =>
                        sources.id === searchParams.get("sources")?.toString()
                    )?.name
                  : "Select Source"}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              align="start"
              className="w-full max-h-[20rem] overflow-auto p-0"
            >
              <Command>
                <CommandInput placeholder="Search Source..." />
                <CommandEmpty>No Source found.</CommandEmpty>
                <CommandGroup>
                  {filteredSources.map((sources) => (
                    <CommandItem
                      onSelect={() => updateParams("sources", sources.id)}
                      key={sources.id}
                      value={sources.id}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          searchParams.get("source")?.toString() === sources.id
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                      {sources.name ?? ""}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
      </div>
      <div>
        {!searchParams.get("query")?.toString() ? (
          <div className="px-5 mt-3">
            <div>
              <p className=" text-xs font-semibold mb-2 ">Countries</p>

              <Select
                onValueChange={update}
                value={searchParams.get("country")?.toString()}
              >
                <SelectTrigger className="w-full text-xs pl-4 font-medium">
                  <SelectValue placeholder="Select Country" />
                </SelectTrigger>
                <SelectContent>
                  {memoisedCountries.map((country) => (
                    <SelectItem key={country.value} value={country.value}>
                      {country.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        ) : (
          <div className="px-5 mb-5  relative mt-3">
            <p className=" text-xs font-semibold mb-2 ">Date Range</p>
            <DatePickerWithRange onDateRangeChange={handleDateRangeChange} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Filter;
