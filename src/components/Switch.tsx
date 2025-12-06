import { useContext } from "react";
import { GroupContext } from "./Group";

type SwitchProps = {
  label: string;
  name?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
};

export default function Switch({
  label,
  name,
  checked,
  onChange,
}: SwitchProps) {
  const isGrouped = useContext(GroupContext);

  const handleSwitchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.checked);
  };

  const handleClick = () => {
    onChange(!checked);
  };

  return (
    <div
      className={`flex h-12 cursor-pointer items-center justify-between bg-(--surface) px-3.5 py-3 select-none hover:bg-(--surface-hover) ${isGrouped ? "first:rounded-t-xl last:rounded-b-xl" : "rounded-xl shadow-sm"}`}
      onClick={handleClick}
    >
      <span>{label}</span>

      <label
        className="relative inline-block h-[30px] w-[52px]"
        onClick={(e) => e.stopPropagation()}
      >
        <input
          name={name}
          className="peer h-0 w-0 opacity-0"
          type="checkbox"
          checked={checked}
          onChange={handleSwitchChange}
        />
        <span className="absolute top-0 right-0 bottom-0 left-0 cursor-pointer rounded-2xl bg-(--background) transition peer-checked:bg-(--primary-active) before:absolute before:bottom-1 before:left-1 before:h-[22px] before:w-[22px] before:rounded-[50%] before:bg-white before:shadow-md before:transition before:content-[''] peer-checked:before:translate-x-[22px]" />
      </label>
    </div>
  );
}
