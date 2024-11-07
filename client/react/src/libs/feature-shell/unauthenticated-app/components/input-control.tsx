import { styles } from "public/styles";
import { ReactNode } from "react";
import {
  Control,
  FieldValues,
  UseControllerProps,
  useController,
} from "react-hook-form";
import { twMerge } from "tailwind-merge";
import { FieldErrorMessage } from "./field-error-message";
import { Input, InputProps } from "./input";

export type FormController<TFieldValues extends FieldValues = FieldValues> =
  UseControllerProps<TFieldValues> & {
    label?: string | ReactNode | null;
    control?: Control<TFieldValues>;
  };

export type InputControlProps<TFieldValues extends FieldValues> =
  FormController<TFieldValues> & { fieldErrorMessage?: boolean } & Omit<
      InputProps,
      "placeholder"
    > & {
      placeholder?: string | null;
      icon?: React.ReactNode;
    };

export function InputControl<TFieldValues extends FieldValues>({
  label,
  control,
  rules,
  name,
  placeholder,
  icon,
  className,
  fieldErrorMessage = true,
  ...props
}: InputControlProps<TFieldValues>) {
  const {
    field,
    fieldState: { error },
  } = useController({
    control,
    name,
    rules,
    defaultValue: "" as TFieldValues[keyof TFieldValues],
  });

  return (
    <div className={twMerge("grid gap-1", className)}>
      <label htmlFor={name} className={styles.paragraph2}>
        {label}
      </label>
      <div className="relative inline-block">
        <Input
          {...props}
          {...field}
          placeholder={placeholder as string}
          error={error}
          className="w-full"
        />
        {icon && (
          <div className="absolute top-1/2 right-3 transform -translate-y-1/2">
            {icon}
          </div>
        )}
      </div>
      {fieldErrorMessage && (
        <FieldErrorMessage error={error} fieldName={name} />
      )}
    </div>
  );
}
