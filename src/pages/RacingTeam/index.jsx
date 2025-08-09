import React, { useState } from "react";
// 0x90A3d026a15C6BA5be28a8f013F7B215d2647A1A
import { ethers } from "ethers";

import {
  useAddress,
  useDisconnect,
  ConnectWallet,
  useContract,
  useContractRead,
  Web3Button,
  useContractWrite
} from "@thirdweb-dev/react";
import CMKNftCharactersABI from "../../nft/CmknftCharactersAbi.json";
import GameCMKABI from "../../nft/GameCMKABI.json";
import CMKOraclecontractABI from "../../nft/oracle.json";
import RacingTeamCMKABI from "../../nft/RacingTeamCMK.json";

const CmknftCharacters = "0xE47254aC4AD2b9dDB223243C18205fC8f28bA1eB";
const CMKTokencontract = "0xcf79feb331be62b7d0840ccd434503ba1ecdff44";
const CMKOraclecontract = "0x49Ec0A2b14763e1734610B31Eb943Eb8Bb1E8026";
const RacingTeamCMK = "0x90A3d026a15C6BA5be28a8f013F7B215d2647A1A";
const GameCMK = "0x7D1B21f827019BF974c159ed3a664D006c8FCf35";
const wdead = "0x000000000000000000000000000000000000dead";
const Energy = ({ id, BNB }) => {
  const address = useAddress();
  const { contract: GameCMKContract } = useContract(GameCMK, GameCMKABI);
  const { data: getUserWinInfo } = useContractRead(GameCMKContract, "getUserWinInfo", [address, Number(id)]);
  const { contract: nftContractRacingTeamCMK } = useContract(RacingTeamCMK, RacingTeamCMKABI);
  const { mutateAsync: dissolveRacingTeams } = useContractWrite(nftContractRacingTeamCMK, "dissolveRacingTeams");

  const { mutateAsync: transferFrom } = useContractWrite(nftContractRacingTeamCMK, "transferFrom");

  //
  function calcularPorcentaje(valor) {
    const minimo = 1;
    const maximo = 18;

    const rango = maximo - minimo;
    const porcentaje = ((valor - minimo) / rango) * 100;
    return porcentaje;
  }
  const totalWins = () => {
    let totalExperienceForCharacters = 0;
    if (getUserWinInfo?.length > 0) {
      for (const item of getUserWinInfo) {
        if (item.wins.toString() == "1") {
          totalExperienceForCharacters += Number(item.wins.toString());
        }
      }
    }
    return totalExperienceForCharacters;
  };
  const totalExperienceForCharacters = () => {
    let totalExperienceForCharacters = 0;
    if (getUserWinInfo?.length > 0) {
      for (const item of getUserWinInfo) {
        if (item.wins.toString() == "1") {
          totalExperienceForCharacters += Number(item.wins.toString());
        }
      }
    }
    const percValid = calcularPorcentaje(totalExperienceForCharacters);
    return percValid.toFixed(0);
  };

  return (
    <>
      {" "}
      <hr></hr>
      <div>
        <span className="text-base font-medium text-secondary dark:text-white">Arsenal WEAR</span>
        <div className="flex justify-between mb-1">
          <span className="text-sm font-medium text-blue-700 dark:text-white">{totalWins()}-18</span>
          <span className="text-sm font-medium text-blue-700 dark:text-white">{totalExperienceForCharacters()}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
          <div
            className="bg-secondary h-2.5 rounded-full"
            style={{ width: totalExperienceForCharacters() + "%" }}
          ></div>
        </div>
      </div>
      <hr></hr>
      {totalExperienceForCharacters() === 100 ? (
        <>
          <Web3Button
            contractAddress={RacingTeamCMK}
            contractAbi={RacingTeamCMKABI}
            className="btn-custom-class burn"
            action={() =>
              transferFrom({
                args: [address, wdead, Number(id)]
              })
            }
            onSuccess={(result) => alert("Success!")}
            onError={(error) => alert(error)}
            theme="dark"
          >
            {" "}
            Dissolve Cartel
          </Web3Button>
        </>
      ) : (
        <>
          <Web3Button
            contractAddress={RacingTeamCMK}
            contractAbi={RacingTeamCMKABI}
            className="btn-custom-class "
            action={() =>
              dissolveRacingTeams({
                args: [Number(id)],
                overrides: {
                  value: BNB // send 0.1 native token with the contract call
                }
              })
            }
            onSuccess={(result) => alert("Success!")}
            onError={(error) => alert(error)}
            theme="dark"
          >
            {" "}
            Dissolve Cartel
          </Web3Button>
        </>
      )}
    </>
  );
};

const RacingTeam = () => {
  const address = useAddress();
  const [filters, setFilters] = useState();
  const [fields, setFields] = useState({ minimum: null, maximun: null });

  const { contract: nftContract } = useContract(CmknftCharacters, CMKNftCharactersABI);
  const { contract: nftContractRacingTeamCMK } = useContract(RacingTeamCMK, RacingTeamCMKABI);

  const { data: permited, isLoading: loader } = useContractRead(nftContract, "isApprovedForAll", [
    address,
    RacingTeamCMK
  ]);

  const { data: countTeam, isLoading: loaderTeam } = useContractRead(nftContractRacingTeamCMK, "getNFTDepositCount", [
    address
  ]);

  const { data: getRacingTeams, isLoading: loadergetRacingTeams } = useContractRead(
    nftContractRacingTeamCMK,
    "getRacingTeams",
    [address]
  );
  const { mutateAsync: dissolveRacingTeams } = useContractWrite(nftContractRacingTeamCMK, "dissolveRacingTeams");

  const { data, isLoading } = useContractRead(nftContractRacingTeamCMK, "walletNFTs", [address, 0]);
  const { contract: CMKOraclecontractUse } = useContract(CMKOraclecontract, CMKOraclecontractABI);

  const { data: getNFTDeposit, isLoading: loadGetNFTDeposit } = useContractRead(
    nftContractRacingTeamCMK,
    "getNFTDeposit",
    [address, 0]
  );

  const { mutateAsync: CallApprove } = useContractWrite(nftContract, "setApprovalForAll");

  const { data: priceBNB } = useContractRead(CMKOraclecontractUse, "getBNBFromUSD", ["2500000000000000000"]);

  const totalExperienceForCharacters = () => {
    let totalExperienceForCharacters = 0;
    if (getRacingTeams?.length > 0) {
      for (const item of getRacingTeams) {
        totalExperienceForCharacters += Number(item.SPDValue.toString());
      }
    }
    return totalExperienceForCharacters;
  };
  const playCharactersWinner = () => {
    let totalExperienceForCharacters = 0;
    for (const item of getUserWinInfo) {
      totalExperienceForCharacters += Number(item.wins.toString());
    }
    return totalExperienceForCharacters;
  };
  function handleFilter(params) {
    if (fields.maximun != null || fields.minimum != null) {
      setFilters((current) => ({ ...current, ...fields }));
    }
  }

  return (
    <div>
      <div className="flex flex-col gap-5">
        <div
          className="flex flex-col
              items-start
              justify-between
        
              space-y-4
check-header
              border-b
              lg:items-center lg:space-y-0 lg:flex-row  "
        >
          <h1 className="text-2xl font-semibold whitespace-nowrap"> Cartel</h1>
        </div>

        <div className="grid grid-cols-1 gap-6 mt-6 mb-7 md:grid-cols-2 lg:grid-cols-2">
          <div className="p-5 text-center rounded-lg bg-primary-pe text-white ">
            <h4 className="sm:text-base md:text-lg "> Current Cartel</h4>
            <p className="sm:text-lg md:text-3xl "> {countTeam?.toString()} </p>
          </div>
          <div className="p-5 text-center rounded-lg bg-primary-pe text-white ">
            <h4 className="sm:text-base md:text-lg "> Total PWR</h4>
            <p className="sm:text-lg md:text-3xl "> {totalExperienceForCharacters()} </p>
          </div>
        </div>
        <div
          className="flex flex-col
              items-start
              justify-between
        
              space-y-4
check-header
              border-b
              lg:items-center lg:space-y-0 lg:flex-row  "
        >
          <h1 className="text-2xl font-semibold whitespace-nowrap">My Cartel </h1>
        </div>
        <div className="grid grid-cols-1 gap-6  mb-7 md:grid-cols-2 lg:grid-cols-4">
          {getRacingTeams?.map((item, key) => (
            <div key={key} className="p-5 text-center rounded-lg bg-primary-pe text-white flex flex-col gap-1">
              <img src={"/nft/triforce_icon.png"} className="cente-img" alt={item.additionalInfo} width={150} />
              <p>ID : {item.tokenId.toString()}</p>
              <p>Name : {item.additionalInfo}</p>
              <p>SPD : {item.SPDValue.toString()}</p>
              <Energy id={item.tokenId.toString()} BNB={priceBNB} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RacingTeam;