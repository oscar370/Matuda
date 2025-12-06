import { useContext } from "react";
import { GroupContext } from "./Group";

type NavigationConfig = {
  label: string;
  logo?: React.ReactNode;
  onClick: () => void;
};

export default function Navigation({ label, logo, onClick }: NavigationConfig) {
  const isGrouped = useContext(GroupContext);

  return (
    <button
      className={`flex h-12 cursor-pointer items-center justify-between bg-(--surface) px-3.5 py-3 select-none hover:bg-(--surface-hover) ${isGrouped ? "first:rounded-t-xl last:rounded-b-xl" : "rounded-xl shadow-sm"}`}
      onClick={onClick}
    >
      <span>{label}</span>

      {logo ? (
        logo
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="16px"
          viewBox="0 0 16 16"
          width="16px"
        >
          <path
            d="m 7.707031 12.707031 l 4 -4 c 0.390625 -0.390625 0.390625 -1.023437 0 -1.414062 l -4 -4 c -0.390625 -0.390625 -1.023437 -0.390625 -1.414062 0 s -0.390625 1.023437 0 1.414062 l 3.292969 3.292969 l -3.292969 3.292969 c -0.390625 0.390625 -0.390625 1.023437 0 1.414062 s 1.023437 0.390625 1.414062 0 z m 0 0"
            fill="currentColor"
            fillRule="evenodd"
          />
        </svg>
      )}
    </button>
  );
}
