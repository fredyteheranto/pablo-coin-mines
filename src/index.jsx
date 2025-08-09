import React from "react";
import { BrowserRouter, RouterProvider } from "react-router-dom";
import "../src/App.css";
import { Binance } from "@thirdweb-dev/chains";
import routes from "./routes";
import {
  ThirdwebProvider,
  rainbowWallet,
  trustWallet,
  safeWallet,
  metamaskWallet,
  coinbaseWallet
} from "@thirdweb-dev/react";
import { createRoot } from "react-dom/client";

import App from "./App";
import { DataContextProvider } from "utils/DataContext";

const root = createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <DataContextProvider>
      <ThirdwebProvider
        autoConnect={true}
        activeChain={Binance}
        clientId="74ad04040dfa5fd21cd06bfd7edb2351"
        supportedWallets={[metamaskWallet(), coinbaseWallet(), rainbowWallet(), trustWallet(), safeWallet()]}
      >
        <RouterProvider router={routes} />
      </ThirdwebProvider>
    </DataContextProvider>
  </React.StrictMode>
);
