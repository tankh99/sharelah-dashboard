import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import type { FormInputProps } from "./form-types";

export type FormTextInputProps = FormInputProps & {
  description?: string;
  multiline?: boolean;
  type?: string;
};

export function FormTextInput(props: FormTextInputProps) {
  const {
    form,
    name,
    label,
    inputProps,
    placeholder,
    description,
    multiline,
    type = "text",
  } = props;

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => {
        return (
          <FormItem>
            <FormLabel>{label}</FormLabel>
            <FormDescription>{description}</FormDescription>
            <FormControl>
              {/* Using onInput because onChange doesn't trigger when autofilling information */}
              {multiline ? (
                <Textarea
                  placeholder={placeholder}
                  {...field}
                  {...inputProps}
                />
              ) : (
                <Input
                  placeholder={placeholder}
                  type={type}
                  {...field}
                  {...inputProps}
                />
              )}
            </FormControl>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}
