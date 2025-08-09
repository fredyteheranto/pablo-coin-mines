import React from "react";
import { useToggleSidebarMenuContext } from "context/toggleSidebarMenu";
import { NavLink } from "react-router-dom";

import { MENU } from "utils/constants";

const RenderMenu = ({ list }) => {
  const { open } = useToggleSidebarMenuContext();
  return (
    <ul className=" p-2 overflow-hidden ">
      {list.map((item, key) => (
        <li key={key}>
          <NavLink
            to={item.route}
            className={`mb-1 flex items-center text-white hover:bg-[#ffcc00] hover:text-[#000]  p-2 space-x-2 rounded-md   `}
          >
            <span className="text-white ">{item.icon}</span>
            <span className={``}> {item.label} </span>
          </NavLink>
          {item.children && <RenderMenu list={item.children} />}
        </li>
      ))}
    </ul>
  );
};

const Sidebar = () => {
  const { open, handleOpenMenu } = useToggleSidebarMenuContext();
  return (
    <>
      {open && (
        <>
          <div
            className="fixed inset-0 z-10 bg-[#0a0a0a] bg-opacity-20 lg:hidden"
            style={{ backdropFilter: "blur(14px)" }}
            onClick={handleOpenMenu}
          ></div>
          <aside
            className={` tg-sidebar fixed
          inset-y-0
          z-10
          flex flex-col 
          flex-shrink-0
         
          max-h-screen
          overflow-hidden
          transition-all
          transform
          shadow-lg text-white
          lg:z-auto lg:static xs:hidden lg:shadow-none duration-300 sidebar-bg`}
          >
            <div className={`flex items-center flex-shrink-0 p-2  xs:hidden justify-between `}>
              <span className="p-2 text-xl lg:text-4xl font-semibold leading-8 tracking-wider uppercase whitespace-nowrap logok">
                <h1>PABLO MINES</h1>
              </span>
              <button className="p-2 rounded-md lg:hidden" onClick={handleOpenMenu}>
                <svg
                  className="w-6 h-6 text-white hover:text-[#000]"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <nav className="flex-1 overflow-hidden hover:overflow-y-auto sidebar-bg">
              <RenderMenu list={MENU} />
            </nav>
          </aside>
        </>
      )}
    </>
  );
};

export default Sidebar;