import { ButtonHTMLAttributes, useContext } from "react";
import { GroupContext } from "./Group";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: string | React.ReactNode;
  variant?: BackgroundVariants;
  forceVariant?: boolean;
};

type BackgroundVariants = keyof typeof BACKGROUND;
type SizeVariants = keyof typeof SIZE;

const BACKGROUND = {
  primary: "bg-(--primary) hover:bg-(--primary-hover)",
  secondary: "bg-(--secondary) hover:bg-(--secondary-hover)",
  transparent: "bg-transparent hover:bg-(--surface-hover)/60",
  minimal: "bg-transparent hover:bg-(--surface-hover)/40",
} as const;

const SIZE = {
  default: "h-12 w-full px-3.5 py-3",
  minimal: "h-auto w-auto px-2 py-1 text-sm",
} as const;

const GROUPED_ROUNDED = "first:rounded-t-xl last:rounded-b-xl" as const;
const NORMAL_ROUNDED = "rounded-xl" as const;

export default function Button({
  className,
  children,
  variant = "primary",
  forceVariant = false,
  disabled = false,
  ...props
}: ButtonProps) {
  const isGrouped = useContext(GroupContext);

  const sz = SIZE[variant as SizeVariants] ?? SIZE.default;

  const rounded = isGrouped ? GROUPED_ROUNDED : NORMAL_ROUNDED;

  function getBackground() {
    if (disabled) return BACKGROUND.transparent;
    if (isGrouped && !forceVariant)
      return "bg-(--surface) hover:bg-(--surface-hover) shadow-none!";

    return BACKGROUND[variant];
  }

  return (
    <button
      className={`cursor-pointer shadow-sm select-none disabled:cursor-not-allowed disabled:text-(--text)/80 ${getBackground()} ${sz} ${rounded} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
