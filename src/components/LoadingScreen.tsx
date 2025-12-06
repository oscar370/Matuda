type LoadingScreenProps = {
  message: string;
  isLoading: boolean;
};

export default function LoadingScreen({
  message,
  isLoading,
}: LoadingScreenProps) {
  if (!isLoading) return null;
  return (
    <div
      className={`absolute top-0 left-0 z-9999 flex h-full w-full bg-black/60 select-none not-[.maximized]:rounded-t-xl`}
    >
      <style>
        {`
          @keyframes spinnerstroke {
            0% {
              stroke-dasharray: 1 150;
              stroke-dashoffset: 0;
            }
            50% {
              stroke-dasharray: 90 150;
              stroke-dashoffset: -35;
            }
            100% {
              stroke-dasharray: 90 150;
              stroke-dashoffset: -124;
            }
          }
        `}
      </style>
      <div className="mx-auto my-auto flex cursor-default items-center justify-center rounded-lg bg-(--surface) px-2.5 py-2 font-bold text-(--text) select-none">
        <svg className="mr-3 size-5" viewBox="0 0 50 50" fill="none">
          <circle
            cx="25"
            cy="25"
            r="20"
            stroke="currentColor"
            strokeWidth="5"
            strokeLinecap="round"
            className="animate-[spinnerstroke_1.2s_ease-in-out_infinite]"
          />
        </svg>
        <span>{message}</span>
      </div>
    </div>
  );
}
