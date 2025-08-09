import App from "App";
import Minting from "Minting";
import MintingNFT from "MintingNFT";
import { Mynfts } from "Mynfts";
import Characters from "pages/Characters";
import Dashboard from "pages/Dashboard";
import Karkits from "pages/Karkits";
import Premint from "pages/Premint";
import RacingMissions from "pages/RacingMissions";
import RacingTeam from "pages/RacingTeam";
import RacingTeamCreate from "pages/RacingTeam/Create";
import Rewards from "pages/Rewards";
import Stats from "pages/Stats";
import { createBrowserRouter } from "react-router-dom";

export default createBrowserRouter([
  {
    path: "/nn",
    element: <Minting />
  },
  {
    path: "my-nft",
    element: <MintingNFT />
  },
  {
    path: "mint",
    element: <Minting />
  },
  {
    path: "mint-nft",
    element: <MintingNFT />
  },
  {
    path: "",
    element: <Dashboard />,
    children: [
      {
        path: "",
        element: <Stats />
      },
      {
        path: "pre-mint",
        element: <Premint />
      },
      {
        path: "nft",
        element: <Characters />
      },
      {
        path: "arsenal",
        element: <Karkits />
      },
      {
        path: "cartel",
        element: <RacingTeam />,
        children: []
      },
      {
        path: "cartel-team/create",
        element: <RacingTeamCreate />
      },

      {
        path: "cartel-missions",
        element: <RacingMissions />
      },
      {
        path: "cartel-rewards",
        element: <Rewards />
      }
    ]
  }
]);