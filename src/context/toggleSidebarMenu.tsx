import { createContext, useContext, useMemo, useState, ReactNode, useEffect } from "react";

// Definición de tipos
interface AppContextType {
  open: boolean;
  handleOpenMenu: () => void;
}

interface ToggleSidebarMenuProviderProps {
  children: ReactNode;
}

const defaultValue = { open: true, handleOpenMenu: () => {} };

// Context
const AppContext = createContext<AppContextType>(defaultValue);

// Provider
const ToggleSidebarMenuProvider: React.FC<ToggleSidebarMenuProviderProps> = ({ children }: any) => {
  const [open, setOpen] = useState(true);

  useEffect(() => {}, [open]);

  function handleOpenMenu() {
    setOpen((current) => !current);
  }

  const values = useMemo(
    () => ({
      open,
      handleOpenMenu
    }),
    [open]
  );

  return <AppContext.Provider value={values}> {children} </AppContext.Provider>;
};

function useToggleSidebarMenuContext() {
  const context = useContext(AppContext);

  if (!context) {
    //////console.error("Error deploying App Context!!!");
  }

  return context;
}

export { useToggleSidebarMenuContext, ToggleSidebarMenuProvider };
