import { ConnectWallet } from "@thirdweb-dev/react";
import { useToggleSidebarMenuContext } from "context/toggleSidebarMenu";
import React from "react";

export default function Header() {
  const [showModal, setShowModal] = React.useState(false);
  const { handleOpenMenu, open } = useToggleSidebarMenuContext();
  return (
    <>
      <header className="flex-shrink-0 border-b bgGradint">
        <div className="flex items-center  justify-between  p-2">
          <div className="flex items-center space-x-3 z-9">
            <span className="p-2 text-xl font-semibold leading-8 tracking-wider uppercase whitespace-nowrap lg:hidden">
              CMK
            </span>
            <button className="p-2 rounded-md focus:outline-none focus:ring" onClick={handleOpenMenu}>
              <svg
                className={`w-4 h-4 text-white transform transition-transform ${open ? "-rotate-180" : ""}`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 5l7 7-7 7M5 5l7 7-7 7" />
              </svg>
            </button>
          </div>
          <div className="flex  items-center  gap-2 z-50">
            <ConnectWallet />
          </div>
        </div>
      </header>
    </>
  );
}
