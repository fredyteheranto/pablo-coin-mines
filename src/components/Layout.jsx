import React from "react";
import Header from "components/Header";
import Sidebar from "components/Sidebar";
import { ToggleSidebarMenuProvider } from "context/toggleSidebarMenu";

const Layout = ({ children }) => {
  return (
    <ToggleSidebarMenuProvider>
      <div className="flex h-screen overflow-y-hidden ">
        <Sidebar />
        <div className="flex flex-col flex-1 h-full overflow-hidden">
          <Header />
          <main className="flex-1 max-h-full p-5 overflow-hidden overflow-y-scroll">{children}</main>
        </div>
      </div>
    </ToggleSidebarMenuProvider>
  );
};

export default Layout;
