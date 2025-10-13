import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import type { FormInputProps } from "./form-types";

type FormDateInputProps = FormInputProps & {
  calendarProps?: any;
  description?: string;
  allowClear?: boolean;
  clearLabel?: string;
};

export function FormDatePicker(props: FormDateInputProps) {
  const { form, name, label, description, placeholder, calendarProps, allowClear = true, clearLabel = "Clear" } = props;

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => {
        const value =
          typeof field.value === "string" ? new Date(field.value) : field.value;

        return (
          <FormItem className="flex flex-col">
            <FormLabel>{label}</FormLabel>
            <FormDescription>{description}</FormDescription>
            <Popover>
              <PopoverTrigger asChild={true}>
                <FormControl>
                  <Button
                    className={cn(
                      "w-[240px] pl-3 text-left font-normal",
                      !field.value && "text-muted-500",
                    )}
                    variant="outline"
                    disabled={calendarProps?.disabled}
                  >
                    {field.value ? (
                      format(value, "PPP")
                    ) : (
                      <span>{placeholder ?? "Select a date"}</span>
                    )}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent align="start" className="w-auto p-0 bg-white">
                {/* Code reference: https://github.com/Medaillek/shadcn-ui-date-picker/blob/main/DatePicker.tsx */}
                <Calendar
                  onSelect={(date) => field.onChange(date ?? null)}
                  fixedWeeks // Helps prevent layout shifting when navigating between months
                  defaultMonth={value ?? new Date()}
                  month={value ?? undefined}
                  onMonthChange={(date) => field.onChange(date ?? null)}
                  captionLayout="dropdown-buttons"
                  mode="single" // Defaults to single, but can be overridden
                  selected={value}
                  {...calendarProps}
                />
                {allowClear && (
                  <div className="flex justify-end p-2 border-t">
                    <Button
                      type="button"
                      variant="ghost"
                      className="h-8 px-2"
                      onClick={() => field.onChange(null)}
                    >
                      {clearLabel}
                    </Button>
                  </div>
                )}
              </PopoverContent>
            </Popover>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}
