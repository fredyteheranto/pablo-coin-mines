import React, { useState } from "react";
import BigNumber from "bignumber.js";
import CountdownTimerLock from "components/CountdownTimerLock";
// 0x90A3d026a15C6BA5be28a8f013F7B215d2647A1A
import { ethers } from "ethers";
import { FiLock } from "react-icons/fi";

import {
  useAddress,
  useDisconnect,
  ConnectWallet,
  useContract,
  useContractRead,
  Web3Button,
  useContractWrite
} from "@thirdweb-dev/react";
import CMKNftCharactersABI from "../nft/CmknftCharactersAbi.json";
import GameCMKABI from "../nft/GameCMKABI.json";
import CMKOraclecontractABI from "../nft/oracle.json";
import RacingTeamCMKABI from "../nft/RacingTeamCMK.json";
import CmkABI from "../nft/token.json";

const CmknftCharacters = "0xE47254aC4AD2b9dDB223243C18205fC8f28bA1eB";
const CMKTokencontract = "0xcf79feb331be62b7d0840ccd434503ba1ecdff44";
const CMKOraclecontract = "0x49Ec0A2b14763e1734610B31Eb943Eb8Bb1E8026";
const RacingTeamCMK = "0x90A3d026a15C6BA5be28a8f013F7B215d2647A1A";
const GameCMK = "0x7D1B21f827019BF974c159ed3a664D006c8FCf35";
const porcentaje = 2;
const data = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

const feeBNB = [
  "280000000000000000",
  "600000000000000000",
  "1280000000000000000",
  "2700000000000000000",
  "5600000000000000000",
  "11600000000000000000",
  "24000000000000000000",
  "49000000000000000000",
  "100000000000000000000",
  "210000000000000000000"
];

const CardMIssion = ({ item, permitedToken, priceBNB, nfyId, idNFt }) => {
  const address = useAddress();
  // 0x72b5364f138cB15A47BA7D9ffd6D21b0362Ae0A3
  // racingMission
  //const address = "0x72b5364f138cB15A47BA7D9ffd6D21b0362Ae0A3";
  const { contract: CMKOraclecontractUse } = useContract(CMKOraclecontract, CMKOraclecontractABI);

  const { contract: RacingTeamCMKcontractUse } = useContract(RacingTeamCMK, RacingTeamCMKABI);
  const { contract: GameCMKContract } = useContract(GameCMK, GameCMKABI);

  const { data: getNFTDeposit, isLoading: loadGetNFTDeposit } = useContractRead(
    RacingTeamCMKcontractUse,
    "getNFTDeposit",
    [address, Number(nfyId)]
  );

  const { data: racingMission } = useContractRead(GameCMKContract, "racingMission", [item]);

  const resultadoWei = feeBNB[item];

  const { contract: CMKTokenNewcontract } = useContract(CMKTokencontract, CmkABI);

  const { data: priceBNBs } = useContractRead(CMKOraclecontractUse, "getBNBFromUSD", [resultadoWei]);

  const { data: getCMKFromUSD } = useContractRead(CMKOraclecontractUse, "getCMKFromUSD", [
    racingMission?.circuit?.toString()
  ]);
  const { mutateAsync: CallApprove } = useContractWrite(CMKTokenNewcontract, "approve");

  const { mutateAsync: playGame } = useContractWrite(GameCMKContract, "playGame");

  const { data: balanceOf, isLoading: loaderbalanceOf } = useContractRead(CMKTokenNewcontract, "balanceOf", [address]);

  const { data: permitedTokenGame, isLoading: loaderTokenGame } = useContractRead(CMKTokenNewcontract, "allowance", [
    address,
    GameCMK
  ]);

  const { data: getUserWinInfo } = useContractRead(GameCMKContract, "getUserWinInfo", [address, Number(idNFt)]);

  const playGae = getUserWinInfo && getUserWinInfo.length > 0 && getUserWinInfo[getUserWinInfo?.length - 1];
  const lastPlayedTime = Number(playGae?.lastPlayedTime?.toString());

  const obtenerUltimosTresElementos = () => {
    const MissionG = getUserWinInfo;
    const ultimosTres = MissionG;
    const objRed = getWalletWinInfoNFTs?.filter(
      (elemento) => elemento.teamId?.toString() === selectedValue?.toString()
    );

    return ultimosTres;
  };

  function calculateNewTargetTimestamp(originalTargetTimestamp, hoursToSubtract) {
    const secondsToSubtract = hoursToSubtract * 3600;
    const newTargetTimestamp = originalTargetTimestamp - secondsToSubtract;
    return newTargetTimestamp;
  }

  function addHoursToUnixTimestamp() {
    const hoursToAdd = checkTimeDifference(lastPlayedTime);
    const secondsToAdd = hoursToAdd * 3600;
    const newUnixTimestamp = lastPlayedTime + secondsToAdd;
    return newUnixTimestamp;
  }

  const checkTimeDifference = () => {
    const now = Math.floor(Date.now() / 1000); // Fecha actual en segundos Unix
    const differenceInSeconds = now - lastPlayedTime;

    if (differenceInSeconds < 24 * 60 * 60) {
      // Si no han pasado 24 horas
      const remainingHours = Math.floor((24 * 60 * 60 - differenceInSeconds) / 3600);

      return remainingHours === 0 ? true : remainingHours;
    } else {
      return true;
    }
  };

  return (
    <>
      <div className={`${checkTimeDifference() === true ? "" : "bg-secondary m-auto relative "}`}>
        {checkTimeDifference() === true ? (
          <>
            {" "}
            <img className="rounded-lg" width="100%" height="auto" src={"/rm/" + (item + 1) + ".png"} />
          </>
        ) : (
          <>
            {" "}
            <img
              className="opacity-75"
              width="100%"
              height="auto"
              src={"https://cloudfront-us-east-1.images.arcpublishing.com/infobae/RZBYV46A5NBQDFIZ22YNJU3T5Q.jpg"}
            />
          </>
        )}

        <>
          {Number(getNFTDeposit?.SPDValue.toString()) >= Number(racingMission?.spd?.toString()) ? (
            <>
              {checkTimeDifference() === true ? (
                <>
                  <Web3Button
                    contractAddress={GameCMK}
                    contractAbi={GameCMKABI}
                    className="btn-custom-class "
                    action={() =>
                      playGame({
                        args: [item, Number(nfyId)],
                        overrides: {
                          value: priceBNBs?.toString()
                        }
                      })
                    }
                    onSuccess={(result) => alert("Success!")}
                    onError={(error) => alert(error)}
                    theme="dark"
                  >
                    {" "}
                    Start Racing {((priceBNBs?.toString() * 2) / 1e18).toFixed(4)} BNB
                  </Web3Button>
                </>
              ) : (
                <>
                  <div className={`absolute ${checkTimeDifference() === true ? "" : "lock"}`}>
                    <div className="text-xs">LOCK</div>
                    <div className="text-xs cente-img text-center">
                      <FiLock className="cente-img text-xl" />
                    </div>

                    <p className="text-xs">Start Racing in {checkTimeDifference()} H</p>
                  </div>
                </>
              )}
            </>
          ) : (
            <></>
          )}
        </>
      </div>
    </>
  );
};

///another component
const RacingMissions = () => {
  const address = useAddress();
  //const address = "0x72b5364f138cB15A47BA7D9ffd6D21b0362Ae0A3";
  const [selectedValue, setSelectedValue] = useState(0); // Estado para almacenar el valor seleccionado

  const { contract: CMKTokenNewcontract } = useContract(CMKTokencontract, CmkABI);

  const { data: permitedToken, isLoading: loaderToken } = useContractRead(CMKTokenNewcontract, "allowance", [
    address,
    RacingTeamCMK
  ]);

  const { mutateAsync: CallIncreaseAllowance } = useContractWrite(CMKTokenNewcontract, "increaseAllowance");

  const { data: balanceOf, isLoading: loaderbalanceOf } = useContractRead(CMKTokenNewcontract, "balanceOf", [address]);

  const { mutateAsync: CallApprove } = useContractWrite(CMKTokenNewcontract, "approve");

  const { contract: GameCMKContract } = useContract(GameCMK, GameCMKABI);

  const { contract: nftContract } = useContract(CmknftCharacters, CMKNftCharactersABI);

  const { contract: nftContractRacingTeamCMK } = useContract(RacingTeamCMK, RacingTeamCMKABI);

  const { contract: CMKOraclecontractUse } = useContract(CMKOraclecontract, CMKOraclecontractABI);
  const { data: priceBNB } = useContractRead(CMKOraclecontractUse, "getBNBFromUSD", ["4500000000000000000"]);

  const { contract: RacingTeamCMKcontractUse } = useContract(RacingTeamCMK, RacingTeamCMKABI);
  const { data: getNFTDeposit, isLoading: loadGetNFTDeposit } = useContractRead(
    RacingTeamCMKcontractUse,
    "getNFTDeposit",
    [address, Number(selectedValue ? selectedValue : 0)]
  );

  const { data: getUserWinInfo, isLoading: loaderGetUserWinInfo } = useContractRead(GameCMKContract, "getUserWinInfo", [
    address,
    Number(getNFTDeposit?.tokenId?.toString())
  ]);

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

  //increaseAllowance

  // playGame
  const handleSelectChange = (event) => {
    setSelectedValue(event.target.value);
  };
  const earningCharacters = () => {
    let totalExperienceForCharacters = 0;
    for (const item of getUserWinInfo) {
      totalExperienceForCharacters += Number(item.earning.toString());
    }
    return totalExperienceForCharacters;
  };
  const playCharactersLooss = () => {
    let totalExperienceForCharacters = 0;
    for (const item of getUserWinInfo) {
      totalExperienceForCharacters += Number(item.losses.toString());
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

  return (
    <div>
      <div className="flex flex-col gap-5">
        <div
          className="flex flex-col check-header 
              items-start
              justify-between
    
              space-y-4
              border-b
              lg:items-center lg:space-y-0 lg:flex-row "
        >
          <h1 className="text-2xl font-semibold whitespace-nowrap">Cartel Missions</h1>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-1 lg:grid-cols-1">
          <div className="p-5 text-center rounded-lg bg-primary-pe ">
            <h4 className="sm:text-base md:text-lg "> Approve for ALL mission</h4>
            <Web3Button
              contractAddress={CMKTokencontract}
              contractAbi={CmkABI}
              className="btn-custom-class "
              action={() =>
                CallApprove({
                  args: [GameCMK, balanceOf?.toString()]
                })
              }
              onSuccess={(result) => alert("Success!")}
              onError={(error) => alert(error)}
              theme="dark"
            >
              {" "}
              Approve for all
            </Web3Button>
          </div>
        </div>
        <div className="p-5 rounded-lg bg-primary-pe-selct">
          <div className="flex flex-col gap-1">
            <div className="flex flex-col gap-2 ">
              <label htmlFor="team" className="block mb-2 text-xl font-medium  ">
                Select Team
              </label>
              <select
                id="team"
                className=" border border-white text-white  text-sm rounded-lg focus:border-red-500 focus:ring-red-500  block w-full p-2.5 "
                value={selectedValue}
                onChange={handleSelectChange}
              >
                <option>Choose a Cartel</option>
                {getRacingTeams?.map((item, key) => (
                  <option value={key} key={key}>
                    ID TEAM {item.additionalInfo} - Name : {item.additionalInfo} - SPD : {item?.SPDValue?.toString()}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        {getUserWinInfo?.length > 0 && (
          <>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-4">
              <div className="p-5 text-center rounded-lg bg-primary-pe ">
                <h4 className="sm:text-base md:text-lg "> Approve ALL</h4>
                <Web3Button
                  contractAddress={CMKTokencontract}
                  contractAbi={CmkABI}
                  className="btn-custom-class "
                  action={() =>
                    CallApprove({
                      args: [GameCMK, balanceOf?.toString()]
                    })
                  }
                  onSuccess={(result) => alert("Success!")}
                  onError={(error) => alert(error)}
                  theme="dark"
                >
                  {" "}
                  Approve
                </Web3Button>
              </div>
              <div className="p-5 text-center rounded-lg bg-primary-pe">
                <h4 className="sm:text-base md:text-lg "> Win</h4>
                <p className="sm:text-lg md:text-3xl text-white ">{playCharactersWinner()} 😎 </p>
              </div>
              <div className="p-5 text-center rounded-lg bg-primary-pe ">
                <h4 className="sm:text-base md:text-lg "> Lost</h4>
                <p className="sm:text-lg md:text-3xl text-white">{playCharactersLooss()} 😟 </p>
              </div>
              <div className="p-5 text-center rounded-lg bg-primary-pe ">
                <h4 className="sm:text-base md:text-lg "> Rewards</h4>
                <p className="sm:text-lg text-white md:text-3xl ">{earningCharacters() / 1e18} USDT 🤑</p>
              </div>
            </div>
          </>
        )}

        {(data?.length > 0 && (
          <div className="grid grid-cols-1 gap-6 mt-6 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-5 h-100">
            {data.map((item, key) => (
              <CardMIssion
                item={item}
                key={key}
                permitedToken={permitedToken}
                priceBNB={priceBNB}
                nfyId={selectedValue}
                idNFt={
                  getRacingTeams && getRacingTeams?.length > 0 && getRacingTeams[selectedValue].tokenId?.toString()
                }
              />
            ))}
          </div>
        )) || (
            <div className="text-center">
              <h1 className="text-3xl">Start Racing</h1>
            </div>
          )}
      </div>
    </div>
  );
};

export default RacingMissions;