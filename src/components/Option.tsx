import { useContext, useEffect } from "react";
import { ActiveOptionContext } from "./Select";

type OptionProps = {
  label: string;
  value: string;
  onClick: (value: string) => void;
  active?: boolean;
};

export default function Option({ label, value, onClick, active }: OptionProps) {
  const context = useContext(ActiveOptionContext);

  if (!context) throw new Error("Context not provided");
  const { setActiveOption, setActiveOptionLegend } = context;

  useEffect(() => {
    if (active) {
      setActiveOption(value);
      setActiveOptionLegend(label);
    }
  }, [active, setActiveOption, setActiveOptionLegend]);

  function handleOptionClick(
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) {
    const value = (e.target as HTMLButtonElement).value;

    onClick(value);
  }

  return (
    <li>
      <button
        value={value}
        role="option"
        className="w-full cursor-pointer appearance-none rounded-lg bg-transparent px-2.5 py-2 text-left text-[--text] duration-100 hover:bg-(--primary)"
        onClick={handleOptionClick}
      >
        {label}
      </button>
    </li>
  );
}
