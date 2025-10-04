"use client";

import { Listbox } from "@headlessui/react";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";

export interface SelectOption {
  label: string;
  value: string;
  disabled?: boolean; // ✅ allow disabling individual options
  group?: string; // ✅ optional grouping
}

interface SelectProps {
  options: SelectOption[];
  value?: SelectOption;
  onChange?: (option: SelectOption) => void;
  placeholder?: string;
  error?: string; // ✅ error state support
  fetchUrl?: string; // ✅ optional dynamic API source
}

export function Select({
  options: initialOptions,
  value,
  onChange,
  placeholder,
  error,
  fetchUrl,
}: SelectProps) {
  const [options, setOptions] = useState<SelectOption[]>(initialOptions);
  const [selected, setSelected] = useState<SelectOption | undefined>(value);

  // ✅ If fetchUrl is provided, load options dynamically
  useEffect(() => {
    if (fetchUrl) {
      fetch(fetchUrl)
        .then((res) => res.json())
        .then((data: SelectOption[]) => setOptions(data))
        .catch(() => console.error("Failed to load options"));
    }
  }, [fetchUrl]);

  const handleChange = (option: SelectOption) => {
    setSelected(option);
    onChange?.(option);
  };

  // ✅ Group options if "group" exists
  const grouped = options.reduce<Record<string, SelectOption[]>>((acc, opt) => {
    const group = opt.group || "default";
    acc[group] = acc[group] || [];
    acc[group].push(opt);
    return acc;
  }, {});

  return (
    <div className="w-full">
      <Listbox value={selected} onChange={handleChange}>
        <div className="relative w-full">
          <Listbox.Button
            className={cn(
              "flex w-full items-center justify-between rounded-lg border px-3 py-2 text-left text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500",
              error ? "border-red-500 focus:ring-red-500" : "border-gray-300"
            )}
          >
            {selected ? selected.label : placeholder || "Select an option"}
            <ChevronDown className="h-4 w-4 opacity-60" />
          </Listbox.Button>
          <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-lg border bg-white py-1 text-sm shadow-lg z-50">
            {Object.entries(grouped).map(([group, groupOptions]) => (
              <div key={group}>
                {group !== "default" && (
                  <div className="px-3 py-1 text-xs text-gray-500">
                    {group}
                  </div>
                )}
                {groupOptions.map((option) => (
                  <Listbox.Option
                    key={option.value}
                    value={option}
                    disabled={option.disabled}
                    className={({ active, disabled }) =>
                      cn(
                        "cursor-pointer select-none px-3 py-2 rounded-md",
                        active && "bg-blue-100",
                        disabled && "opacity-50 cursor-not-allowed"
                      )
                    }
                  >
                    {({ selected }) => (
                      <span className="flex items-center justify-between">
                        {option.label}
                        {selected && (
                          <Check className="h-4 w-4 text-blue-600" />
                        )}
                      </span>
                    )}
                  </Listbox.Option>
                ))}
              </div>
            ))}
          </Listbox.Options>
        </div>
      </Listbox>
      {error && (
        <p className="mt-1 text-xs text-red-500">{error}</p>
      )}
    </div>
  );
}
