import { FieldError } from "react-hook-form";

export interface FieldErrorMessageProps {
  error?: FieldError;
  fieldName: string;
}

export function FieldErrorMessage({
  fieldName,
  error,
}: FieldErrorMessageProps) {
  return (
    <div className="py-1.5">
      <p
        role="alert"
        id={`${fieldName}-error`}
        className="text-error text-red-500 text-xs"
      >
        {error && error.message}
      </p>
    </div>
  );
}
