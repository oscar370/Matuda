import { NavLink } from "react-router-dom";

type ButtonProps = {
  label: string;
  to: string;
  onClick?: () => void;
  disabled?: boolean;
};

export default function SidebarItem({
  label,
  to,
  onClick = () => "",
  disabled = false,
}: ButtonProps) {
  return (
    <NavLink
      className={({ isActive }) =>
        `h-12 w-full cursor-pointer rounded-md px-3.5 py-3 select-none ${disabled && "cursor-not-allowed! text-(--text)/60"} ${isActive ? "bg-(--secondary) hover:bg-(--secondary-hover)" : "bg-transparent hover:bg-(--secondary-hover)"}`
      }
      to={to}
      onClick={(e) => (disabled ? e.preventDefault() : onClick())}
    >
      {label}
    </NavLink>
  );
}
