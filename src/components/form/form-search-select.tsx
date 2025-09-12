import { useMemo, useState } from "react";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import type { FormInputProps } from "./form-types";

type Option = {
  value: string;
  label: string;
  subLabel?: string;
};

export type FormSearchSelectProps = FormInputProps & {
  options: Option[];
  placeholder?: string;
  emptyText?: string;
  allowClear?: boolean;
};

export function FormSearchSelect(props: FormSearchSelectProps) {
  const { form, name, label, placeholder, options, emptyText = "No results", allowClear = true } = props;
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const filteredOptions = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return options;
    return options.filter((o) =>
      [o.label, o.subLabel, o.value]
        .filter(Boolean)
        .some((s) => (s as string).toLowerCase().includes(q))
    );
  }, [options, query]);

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => {
        const selected = options.find((o) => o.value === (field.value ? field.value.toString() : undefined));

        // filtering handled by filteredOptions above

        return (
          <FormItem>
            <FormLabel>{label}</FormLabel>
            {/* <FormDescription>Search by typing</FormDescription> */}
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild={true}>
                <FormControl>
                  <Button variant="outline" className="w-full justify-between">
                    <span className="truncate">
                      {selected ? selected.label : (placeholder ?? "Select an option")}
                    </span>
                    <span className="ml-2 text-xs text-muted-foreground">
                      {selected?.subLabel}
                    </span>
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-2 bg-white" align="start">
                <div className="flex items-center gap-2 mb-2">
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search..."
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  />
                  {allowClear && (
                    <Button
                      type="button"
                      variant="ghost"
                      className="h-8 px-2"
                      onClick={() => {
                        setQuery("");
                        field.onChange(null);
                      }}
                    >
                      Clear
                    </Button>
                  )}
                </div>
                <div className="max-h-64 overflow-auto divide-y">
                  {filteredOptions.length === 0 && (
                    <div className="py-6 text-sm text-muted-foreground text-center">{emptyText}</div>
                  )}
                  {filteredOptions.map((o) => (
                    <button
                      key={o.value}
                      type="button"
                      className={
                        "w-full text-left px-3 py-2 hover:bg-muted text-sm " +
                        (o.value === field.value ? "bg-muted" : "")
                      }
                      onClick={() => {
                        field.onChange(o.value);
                        setOpen(false);
                      }}
                    >
                      <div className="font-medium truncate">{o.label}</div>
                      {o.subLabel && (
                        <div className="text-xs text-muted-foreground truncate">{o.subLabel}</div>
                      )}
                    </button>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}


