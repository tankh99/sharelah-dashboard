import type { ReactNode } from "react";

export type FormInputProps = {
  form: any;
  inputProps?: Record<string, any>;
  isDisabled?: boolean;
  label: ReactNode;
  name: string;
  placeholder?: string;
};
