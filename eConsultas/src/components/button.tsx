import type { SVGProps } from "react";

interface ButtonProps {
  label: string;
  type:
    | "primary"
    | "secondary"
    | "accent"
    | "secondary-accent"
    | "danger"
    | "custom";
  onClick: (event?: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  icon?: ({
    className,
    ...props
  }: SVGProps<SVGSVGElement>) => React.JSX.Element;
  fit?: boolean;
  height?: string;
  width?: string;
  disabled?: boolean;
  className?: string;
  iconPosition?: "left" | "right";
  iconColor?: string;
}

const defaultStyle =
  "rounded-md py-3 px-6 flex items-center justify-center text-center text-base";

const style: Record<string, string> = {
  primary:
    "bg-primary text-white hover:bg-primary-hover shadow-sm hover:shadow-md transition-all duration-300 disabled:bg-primary/50 disabled:cursor-not-allowed",
  secondary:
    "bg-transparent border-2 border-primary text-primary hover:border-primary-hover hover:text-primary-hover hover:shadow-md transition-all duration-300 disabled:border-primary/50 disabled:text-primary/50 disabled:cursor-not-allowed",
  accent:
    "bg-accent text-white hover:bg-accent-hover shadow-sm hover:shadow-md transition-all duration-300 disabled:bg-accent/50 disabled:cursor-not-allowed",
  "secondary-accent":
    "bg-transparent border-2 border-accent text-accent hover:border-accent-hover hover:text-accent-hover hover:shadow-md transition-all duration-300 disabled:border-accent/50 disabled:text-accent/50 disabled:cursor-not-allowed",
  danger:
    "bg-destructive text-white hover:bg-destructive-hover shadow-sm hover:shadow-md transition-all duration-300 disabled:bg-destructive/50 disabled:cursor-not-allowed",
  custom: "",
};

export default function Button({
  label,
  type,
  onClick,
  icon: Icon,
  iconPosition = "right",
  iconColor = "#FFFFFF",
  fit = false,
  height = "h-12",
  width = "w-auto",
  disabled = false,
  className = "",
}: ButtonProps) {
  const fontWeight = type !== "custom" ? "font-medium" : "";

  return (
    <button
      className={`${defaultStyle} ${fontWeight} ${style[type]} ${height} ${
        fit ? "w-full" : ""
      } ${className} ${!fit && !className?.includes("w-") ? width : ""}`}
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
    >
      {iconPosition === "left" && Icon && (
        <Icon
          className={`mr-2 h-5 w-5`}
          color={type === "custom" ? iconColor : ""}
        />
      )}
      {label}
      {iconPosition === "right" && Icon && (
        <Icon
          className={`ml-2 h-5 w-5`}
          color={type === "custom" ? iconColor : ""}
        />
      )}
    </button>
  );
}
