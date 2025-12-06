import React, { useEffect, useRef, useState } from "react";

type ModalProps = {
  title: string;
  children: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
};

export default function Modal({
  title,
  children,
  isOpen,
  onClose,
}: ModalProps) {
  const [shouldRender, setShouldRender] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handler);

    return () => {
      window.removeEventListener("keydown", handler);
    };
  }, [onClose, isOpen]);

  useEffect(() => {
    const container = containerRef.current;

    if (isOpen) {
      if (isOpen) setShouldRender(true);
      if (!container) return;
      container.animate({ opacity: [0, 1] }, { duration: 100 });

      return;
    }

    if (!container) return;
    const animate = container.animate(
      { opacity: [1, 0] },
      { duration: 100, fill: "forwards" },
    );
    animate.finished.then(() => setShouldRender(false));
  }, [isOpen, shouldRender]);

  if (!shouldRender) return null;

  return (
    <div
      className="absolute top-0 left-0 z-98 flex h-full w-full items-center justify-center rounded-t-xl bg-black/60"
      onClick={onClose}
      ref={containerRef}
    >
      <div
        className="z-99 max-h-[90%] w-[70%] overflow-y-auto rounded-xl bg-(--surface) shadow-sm"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mt-1 grid h-8 grid-cols-3 items-center justify-center">
          <h2 className="col-end-3 text-center select-none">{title}</h2>

          <div className="text-end">
            <button
              title="Close"
              className="mr-3 w-fit cursor-pointer rounded-full bg-[#000006]/12 p-1 dark:bg-[#38383C]"
              onClick={onClose}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="16px"
                viewBox="0 0 16 16"
                width="16px"
                className="text-black/80 dark:text-white"
              >
                <path
                  d="m 5.019531 4 c -0.265625 0 -0.519531 0.105469 -0.707031 0.292969 c -0.390625 0.390625 -0.390625 1.023437 0 1.414062 l 2.292969 2.292969 l -2.292969 2.292969 c -0.390625 0.390625 -0.390625 1.023437 0 1.414062 s 1.023438 0.390625 1.414062 0 l 2.292969 -2.292969 l 2.292969 2.292969 c 0.390625 0.390625 1.023438 0.390625 1.414062 0 c 0.390626 -0.390625 0.390626 -1.023437 0 -1.414062 l -2.292968 -2.292969 l 2.292968 -2.292969 c 0.390626 -0.390625 0.390626 -1.023437 0 -1.414062 c -0.1875 -0.1875 -0.441406 -0.292969 -0.707031 -0.292969 s -0.519531 0.105469 -0.707031 0.292969 l -2.292969 2.292969 l -2.292969 -2.292969 c -0.1875 -0.1875 -0.441406 -0.292969 -0.707031 -0.292969 z m 0 0"
                  fill="currentColor"
                />
              </svg>
            </button>
          </div>
        </div>

        <div className="mx-auto w-full max-w-[600px] px-4 py-6">{children}</div>
      </div>
    </div>
  );
}
