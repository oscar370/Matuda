import { UnlistenFn } from "@tauri-apps/api/event";
import { getCurrentWindow } from "@tauri-apps/api/window";
import React, { useEffect, useRef, useState } from "react";

type SplitViewProps = {
  titleSidebar: string;
  titleMain: string;
  MainContent: React.ReactElement;
  SidebarContent: React.ReactElement;
};

export default function SplitView({
  titleSidebar,
  titleMain,
  MainContent,
  SidebarContent,
}: SplitViewProps) {
  const titleSidebarRef = useRef<HTMLDivElement>(null);
  const [isMaximized, setIsMaximized] = useState(false);
  const appWindow = getCurrentWindow();

  useEffect(() => {
    let unsubscribe: UnlistenFn | undefined;

    async function listenMaximized() {
      try {
        unsubscribe = await appWindow.onResized(async () => {
          const maximized = await appWindow.isMaximized();
          setIsMaximized(maximized);
        });
      } catch (error) {
        console.error("Failed to obtain window status: ", error);
      }
    }

    listenMaximized();

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [isMaximized, appWindow]);

  useEffect(() => {
    document.documentElement.classList.toggle("maximized", isMaximized);
    titleSidebarRef.current?.classList.toggle("maximized", isMaximized);
  }, [isMaximized]);

  return (
    <>
      <style>
        {`html:not(.maximized) {
            border-top-right-radius: 12px;
            border-top-left-radius: 12px;
          }`}
      </style>
      {/* TitleBar */}
      <div>
        <div
          data-tauri-drag-region
          className="fixed top-0 right-0 left-0 grid h-12 grid-cols-[180px_1fr] items-center"
        >
          <div
            ref={titleSidebarRef}
            data-tauri-drag-region
            className="flex h-full w-full cursor-default items-center justify-center bg-(--surface) font-bold select-none not-[.maximized]:rounded-tl-xl"
          >
            {titleSidebar}
          </div>

          <div data-tauri-drag-region className="mr-3 grid grid-cols-3">
            <div
              data-tauri-drag-region
              className="col-end-3 cursor-default text-center font-bold select-none"
            >
              {titleMain}
            </div>

            <div data-tauri-drag-region className="col-end-4 text-end">
              <button
                id="titlebar-close"
                title="Close"
                className="cursor-pointer rounded-full bg-[#000006]/12 p-1 dark:bg-[#38383C]"
                onClick={() => appWindow.close()}
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
        </div>
      </div>

      <div className="mt-12 grid h-[calc(100dvh-48px)] w-full grid-cols-[180px_1fr]">
        {/* Sidebar */}
        <div className="h-full w-full overflow-y-auto bg-(--surface) px-1.5 py-1.5">
          {SidebarContent}
        </div>

        <div className="mx-auto w-full max-w-[600px] px-4 py-6">
          {MainContent}
        </div>
      </div>
    </>
  );
}
