import { useContext } from "react";
import { GroupContext } from "./Group";

type RangeProps = {
  label: string;
  name?: string;
  value: string | number;
  steps: string | number;
  min: string | number;
  max: string | number;
  onChange: (value: string) => void;
};

export default function Range({
  label,
  name,
  value,
  steps,
  min,
  max,
  onChange,
}: RangeProps) {
  const isGrouped = useContext(GroupContext);

  function handleRangeChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = (e.target as HTMLInputElement).value;

    onChange(value);
  }

  return (
    <button
      className={`flex h-12 items-center justify-between bg-(--surface) px-3.5 py-3 select-none ${isGrouped ? "first:rounded-t-xl last:rounded-b-xl" : "rounded-xl shadow-sm"}`}
    >
      <span>{label}</span>

      <div className="flex items-center gap-2">
        <span>{value}</span>

        <input
          className="h-2 cursor-pointer appearance-none rounded-sm bg-(--primary) transition-colors outline-none hover:bg-(--primary-hover)"
          type="range"
          name={name}
          step={steps}
          min={min}
          max={max}
          value={value}
          onChange={handleRangeChange}
        />
      </div>
    </button>
  );
}
