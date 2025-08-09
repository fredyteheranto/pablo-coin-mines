import React from "react";
import CountdownTimer from "components/CountdownTimer";
// 0x90A3d026a15C6BA5be28a8f013F7B215d2647A1A
import { ethers } from "ethers";
import ReferralLink from "ReferralLink";

import {
  useAddress,
  useDisconnect,
  ConnectWallet,
  useContract,
  useContractRead,
  Web3Button,
  useContractWrite
} from "@thirdweb-dev/react";
import bgmks from "../assets/images/banner.png";
import CMKNftCharactersABI from "../nft/CmknftCharactersAbi.json";
import GameCMKABI from "../nft/GameCMKABI.json";
import CMKOraclecontractABI from "../nft/oracle.json";
import RacingTeamCMKABI from "../nft/RacingTeamCMK.json";
import CmkABI from "../nft/token.json";
import WithdrawContractABI from "../nft/WithdrawContractABI.json";

const data = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
const CmknftCharacters = "0xE47254aC4AD2b9dDB223243C18205fC8f28bA1eB";
const CMKTokencontract = "0xcf79feb331be62b7d0840ccd434503ba1ecdff44";
const CMKOraclecontract = "0x49Ec0A2b14763e1734610B31Eb943Eb8Bb1E8026";
const RacingTeamCMK = "0x90A3d026a15C6BA5be28a8f013F7B215d2647A1A";
const GameCMK = "0x7D1B21f827019BF974c159ed3a664D006c8FCf35";
const WithdrawContract = "0x629e90b1BE4635A4bd0D8e719b7fCcDa5354FDCB";

const Stats = () => {
  const address = useAddress();
  const { contract } = useContract(WithdrawContract, WithdrawContractABI);
  const { contract: CMKOraclecontractUse } = useContract(CMKOraclecontract, CMKOraclecontractABI);
  const { data } = useContractRead(contract, "getWalletWinInfoNFTs", [address]);
  const { data: getTokenValue } = useContractRead(contract, "getTokenValue", []);

  const { data: priceCMKTousd } = useContractRead(CMKOraclecontractUse, "getCMKFromUSD", ["1000000000000000000"]);
  const cmkToUSD = (getTokenValue?.toString() / priceCMKTousd?.toString()).toFixed(2);
  const { contract: CMKTokenNewcontract } = useContract(CMKTokencontract, CmkABI);

  const { data: balanceOf, isLoading: loaderbalanceOf } = useContractRead(CMKTokenNewcontract, "balanceOf", [address]);
  const wins = () => {
    let wins = 0;
    if (data && data?.length) {
      for (const item of data) {
        wins += Number(item.wins?.toString());
      }
    }
    return wins;
  };
  const earning = () => {
    let earning = 0;
    if (data && data?.length) {
      for (const item of data) {
        earning += Number(item.earning?.toString());
      }
    }
    return (earning?.toString() / 1e18).toFixed(2);
  };
  const earningCMK = () => {
    let earningCMK = 0;
    if (data && data?.length) {
      for (const item of data) {
        earningCMK += Number(item.earningCMK?.toString());
      }
    }
    return (earningCMK?.toString() / 1e18).toFixed(2);
  };
  const losses = () => {
    let losses = 0;
    if (data && data?.length) {
      for (const item of data) {
        losses += Number(item.losses?.toString());
      }
    }
    return losses;
  };

  const percentajePay = () => {
    const cmkToUSD = (balanceOf?.toString() / priceCMKTousd?.toString()).toFixed(2) + " USD";
    const cmk = (balanceOf?.toString() / 1e18).toFixed(2) + " PEM";
    return cmk + " / " + cmkToUSD;
  };

  const poolStatus = () => {
    const cmk = (getTokenValue?.toString() / 1e18).toFixed(2) + " PEM";

    return cmk + " / " + cmkToUSD + " USD";
  };
  //

  const stats = [
    { label: "Pool status", value: poolStatus() },
    { label: "Rewards USD", value: earning() + " USD" },
    { label: "Rewards PEM", value: earningCMK() + " PEM" },
    { label: "Your Balance", value: percentajePay() },
    { label: "Days until zero fee", value: "21 days" },
    { label: "Play History", value: wins() + " Win / " + losses() + " Loses" }
  ];

  return (
    <>
      <div
        className="flex flex-col
              items-start
              justify-between
        
              space-y-4
check-header
              border-b
              lg:items-center lg:space-y-0 lg:flex-row "
      >
        <h1 className="text-2xl font-semibold whitespace-nowrap">Stats</h1>
      </div>
      <div className="mb-5">
        <img alt="" src={bgmks} width="100%" height={300} />
      </div>
      {data && (
        <>
          <div className="grid grid-cols-1 gap-6 mt-1 md:grid-cols-2 lg:grid-cols-3">
            {stats.map((stat, key) => (
              <div
                key={key}
                className="p-5 text-center bg-primary-pe text-white transition-shadow border rounded-lg shadow-sm hover:shadow-lg"
              >
                <h4 className="sm:text-base md:text-xl "> {stat.label} </h4>
                <p className="sm:text-lg md:text-xl "> {stat.value} </p>
              </div>
            ))}
          </div>
        </>
      )}
    </>
  );
};

export default Stats;