import { AiFillPlusCircle, AiFillNotification, AiTwotoneSliders } from "react-icons/ai";
import { BsFillBarChartFill, BsFillEmojiHeartEyesFill, BsFillEvFrontFill } from "react-icons/bs";
import { FaGripHorizontal } from "react-icons/fa";
import { RiTeamFill } from "react-icons/ri";

export const MENU = [
  {
    label: "Home",
    route: "/",
    icon: <BsFillBarChartFill />
  },

  {
    label: "PRE - MINT",
    route: "/pre-mint",
    icon: <FaGripHorizontal />
  },
  {
    label: "NFT",
    route: "/nft",
    icon: <BsFillEmojiHeartEyesFill />
  },
  {
    label: "Arsenal",
    route: "/arsenal",
    icon: <BsFillEvFrontFill />
  },
  {
    label: "Cartel",
    route: "/cartel",
    icon: <RiTeamFill />
  },
  {
    label: "Create",
    route: "/cartel-team/create",
    icon: <AiFillPlusCircle />
  },

  {
    label: "Cartel Missions",
    route: "/cartel-missions",
    icon: <AiFillNotification />
  },
  {
    label: "Rewards",
    route: "/cartel-rewards",
    icon: <AiTwotoneSliders />
  },
  {
    label: "Market place",
    route: "/",
    icon: <AiTwotoneSliders />
  },
  {
    label: "Staking",
    route: "/",
    icon: <AiTwotoneSliders />
  }
];