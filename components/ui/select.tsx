"use client";

import { Listbox } from "@headlessui/react";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

export interface SelectOption {
  label: string;
  value: string;
}

interface SelectProps {
  options: SelectOption[];
  value?: SelectOption;
  onChange?: (option: SelectOption) => void;
  placeholder?: string;
}

export function Select({ options, value, onChange, placeholder }: SelectProps) {
  const [selected, setSelected] = useState<SelectOption | undefined>(value);

  const handleChange = (option: SelectOption) => {
    setSelected(option);
    onChange?.(option);
  };

  return (
    <Listbox value={selected} onChange={handleChange}>
      <div className="relative w-full">
        <Listbox.Button className="flex w-full items-center justify-between rounded-lg border px-3 py-2 text-left text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
          {selected ? selected.label : placeholder || "Select an option"}
          <ChevronDown className="h-4 w-4 opacity-60" />
        </Listbox.Button>
        <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-lg border bg-white py-1 text-sm shadow-lg z-50">
          {options.map((option) => (
            <Listbox.Option
              key={option.value}
              value={option}
              className={({ active }) =>
                cn(
                  "cursor-pointer select-none px-3 py-2",
                  active ? "bg-blue-100" : ""
                )
              }
            >
              {({ selected }) => (
                <span className="flex items-center justify-between">
                  {option.label}
                  {selected && <Check className="h-4 w-4 text-blue-600" />}
                </span>
              )}
            </Listbox.Option>
          ))}
        </Listbox.Options>
      </div>
    </Listbox>
  );
}
