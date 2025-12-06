import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { GroupContext } from "./Group";

type SelectProps = {
  label: string;
  name?: string;
  children: React.ReactNode;
};

type ContextProps = {
  setActiveOption: React.Dispatch<React.SetStateAction<string>>;
  setActiveOptionLegend: React.Dispatch<React.SetStateAction<string>>;
};

export const ActiveOptionContext = createContext<ContextProps | null>(null);

export default function Select({ label, name, children }: SelectProps) {
  const isGrouped = useContext(GroupContext);
  const [activeOption, setActiveOption] = useState("");
  const [activeOptionLegend, setActiveOptionLegend] = useState("");
  const [isOptionsHidden, setIsOptionsHidden] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOptionsHidden) return;

    function handleClickOutside(e: MouseEvent) {
      const isNotSelect = !containerRef.current?.contains(e.target as Node);
      if (isNotSelect && !isOptionsHidden) {
        setIsOptionsHidden(true);
      }
    }

    window.addEventListener("click", handleClickOutside);
    return () => window.removeEventListener("click", handleClickOutside);
  }, [isOptionsHidden]);

  function handleSelectClick() {
    setIsOptionsHidden((prev) => !prev);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleSelectClick();
    }
  }

  return (
    <div
      ref={containerRef}
      role="button"
      tabIndex={0}
      className={`relative flex h-12 w-full cursor-pointer items-center justify-between bg-(--surface) px-3.5 py-3 select-none hover:bg-(--surface-hover) ${isGrouped ? "first:rounded-t-xl last:rounded-b-xl" : "rounded-xl shadow-sm"}`}
      onClick={handleSelectClick}
      onKeyDown={handleKeyDown}
      aria-expanded={!isOptionsHidden}
      aria-haspopup="listbox"
    >
      <span>{label}</span>
      <div className="flex items-center gap-2">
        <span>{activeOptionLegend}</span>

        <svg
          height="16px"
          viewBox="0 0 16 16"
          width="16px"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="m 3.292969 7.707031 l 4 4 c 0.390625 0.390625 1.023437 0.390625 1.414062 0 l 4 -4 c 0.390625 -0.390625 0.390625 -1.023437 0 -1.414062 s -1.023437 -0.390625 -1.414062 0 l -3.292969 3.292969 l -3.292969 -3.292969 c -0.390625 -0.390625 -1.023437 -0.390625 -1.414062 0 s -0.390625 1.023437 0 1.414062 z m 0 0"
            fill="currentColor"
            fillRule="evenodd"
          />
        </svg>
      </div>

      <ActiveOptionContext value={{ setActiveOption, setActiveOptionLegend }}>
        <ul
          role="listbox"
          className={`absolute top-[55px] right-2 z-99 flex max-h-80 flex-col gap-1.5 overflow-y-auto rounded-xl bg-[color-mix(in_srgb,var(--surface),white_5%)] p-3 shadow-sm ${isOptionsHidden ? "pointer-events-none opacity-0" : "opacity-100"}`}
        >
          {children}
        </ul>
      </ActiveOptionContext>

      <input type="hidden" name={name} value={activeOption} />
    </div>
  );
}
