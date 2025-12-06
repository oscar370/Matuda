import React, { createContext } from "react";

type GroupProps = {
  title?: string;
  description?: string;
  button?: React.ReactNode;
  children: React.ReactNode;
};

export const GroupContext = createContext<boolean | null>(null);

export default function Group({
  title,
  description,
  button,
  children,
}: GroupProps) {
  return (
    <div className="select-none">
      {(title || button) && (
        <div className="mb-2 flex items-center justify-between">
          {title && <h2 className="cursor-default select-none">{title}</h2>}

          {button && button}
        </div>
      )}
      {description && (
        <p className="mb-2 text-sm text-(--text)/90">{description}</p>
      )}
      <GroupContext value={true}>
        <div className="flex w-full flex-col gap-px rounded-xl p-0 shadow-sm">
          {children}
        </div>
      </GroupContext>
    </div>
  );
}
