import { twMerge } from "tailwind-merge";

export type AppButtonProps = {
  disabled?: boolean;
  isLoading?: boolean;
  className?: string;
  size?: string;
  variant?: string;
};

type ButtonProps = JSX.IntrinsicElements["button"] & AppButtonProps;

export function Button({
  className,
  disabled = false,
  isLoading,
  variant,
  size,
  ...buttonProps
}: ButtonProps) {
  return (
    <button
      className={getButtonClassName({
        disabled,
        className: className,
        isLoading,
        size,
        variant,
      })}
      disabled={disabled}
      {...buttonProps}
    />
  );
}

function getButtonClassName({
  disabled,
  className,
  isLoading,
  variant,
  size = "medium",
}: AppButtonProps) {
  const baseClass = twMerge(
    "flex gap-2 rounded-md items-center justify-center text-white",
    size === "small" && "px-3 md:h-6 h-8 text-sm",
    size === "medium" && "px-4 md:h-9 h-12 text-md",
    size === "large" && "px-5 md:h-12 h-14 text-lg",
    disabled ? "bg-gray-400" : "bg-primary hover:opacity-80",
    variant === "primary-inverted" &&
      "bg-white text-primary border border-primary hover:bg-primary hover:text-white"
  );

  const disabledClass = disabled
    ? "cursor-not-allowed"
    : "transition-colors duration-200";

  const loadingClass = isLoading
    ? "animate-pulse pointer-events-none touch-none"
    : "";

  return twMerge(baseClass, disabledClass, loadingClass, className);
}
