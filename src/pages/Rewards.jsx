import React, { useState } from "react";
import CountdownTimer from "components/CountdownTimer";
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
import CMKNftCharactersABI from "../nft/CmknftCharactersAbi.json";
import GameCMKABI from "../nft/GameCMKABI.json";
import CMKOraclecontractABI from "../nft/oracle.json";
import RacingTeamCMKABI from "../nft/RacingTeamCMK.json";
import CmkABI from "../nft/token.json";
import WithdrawContractABI from "../nft/WithdrawContractABI.json";

const CmknftCharacters = "0xE47254aC4AD2b9dDB223243C18205fC8f28bA1eB";
const CMKTokencontract = "0xcf79feb331be62b7d0840ccd434503ba1ecdff44";
const CMKOraclecontract = "0x49Ec0A2b14763e1734610B31Eb943Eb8Bb1E8026";
const RacingTeamCMK = "0x90A3d026a15C6BA5be28a8f013F7B215d2647A1A";
const GameCMK = "0x7D1B21f827019BF974c159ed3a664D006c8FCf35";
const WithdrawContract = "0x629e90b1BE4635A4bd0D8e719b7fCcDa5354FDCB";

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

const CardMIssion = ({ item, permitedToken, priceBNB, nfyId, idkey }) => {
  const address = useAddress();
  const [showModal, setShowModal] = React.useState(false);

  const { contract: WithdrawContracts } = useContract(WithdrawContract, WithdrawContractABI);

  const { contract: CMKOraclecontractUse } = useContract(CMKOraclecontract, CMKOraclecontractABI);

  const { contract: RacingTeamCMKcontractUse } = useContract(RacingTeamCMK, RacingTeamCMKABI);

  const { contract: GameCMKContract } = useContract(GameCMK, GameCMKABI);

  const { mutateAsync: withdrawEarnings } = useContractWrite(WithdrawContracts, "withdraw");

  //GameCMK

  const { data: getNFTDeposit } = useContractRead(RacingTeamCMKcontractUse, "getNFTDeposit", [address, Number(nfyId)]);

  const { data: getlastPlayedTime } = useContractRead(WithdrawContracts, "getDaysLeft", [
    Number(item.lastPlayedTime?.toString())
  ]);

  //

  //  item?.teamId?.toString()
  const { data: getWalletWinInfoNFTs } = useContractRead(WithdrawContracts, "getWalletWinInfoNFTs", [address]);

  const { data: getCalculateTaxFeePercentage } = useContractRead(WithdrawContracts, "calculateTaxFeePercentage", [
    Number(getlastPlayedTime?.toString())
  ]);
  const percentaje = (getCalculateTaxFeePercentage?.toString() / 10000) * 100;
  const { contract: CMKTokenNewcontract } = useContract(CMKTokencontract, CmkABI);
  const { data: InPrice } = useContractRead(CMKOraclecontractUse, "getBNBFromUSD", ["1500000000000000000"]);

  const { data: InPriceCMK } = useContractRead(CMKOraclecontractUse, "getCMKFromUSD", [item?.earning?.toString()]);

  const perc = ((item.earning?.toString() / 1e18) * percentaje) / 100;
  const cmkperc = ((InPriceCMK?.toString() / 1e18) * percentaje) / 100;

  const eardn = perc;

  const canYouPay = (lastPlayedTime) => {
    const objRed = getWalletWinInfoNFTs?.find((elemento) => elemento.lastPlayedTimeGame?.toString() === lastPlayedTime);
    return objRed ? true : false;
  };

  const youPercentaje = (lastPlayedTime) => {
    const objRed = getWalletWinInfoNFTs?.find((elemento) => elemento.lastPlayedTimeGame?.toString() === lastPlayedTime);
    const percen = objRed?.percentajePay?.toString() / 1e18;
    const redw = objRed?.earningCMK?.toString() / 1e18;
    const suma_total = percen + redw;
    const porcentaje_valorcomision = (percen / suma_total) * 100;
    return porcentaje_valorcomision.toFixed(0);
  };

  const errorMane = (e) => {
    if (e) {
      alert("Error in the execution of the contract");
    }
  };
  const win = (e) => {
    setShowModal(false);
    location.reload();
  };

  const dateToUnix = (unix) => {
    const unixTimestamp = unix; // Ejemplo de marca de tiempo Unix en segundos
    const date = new Date(unixTimestamp * 1000); // Multiplicamos por 1000 para
    const formattedDate = date.toLocaleString();
    return formattedDate;
  };

  const convertirSegundosAHoras = (segundos) => {
    const horas = Math.floor(segundos / 3600);
    const minutos = Math.floor((segundos % 3600) / 60);
    const segundosRestantes = segundos % 60;

    return { horas: horas, minutos: minutos, segundos: segundosRestantes };
  };
  const calcularTiempoPasado = (timestampUnix) => {
    const tiempoActual = Math.floor(Date.now() / 1000); // Obtener el tiempo actual en segundos
    const diferencia = tiempoActual - timestampUnix;

    const horasEnSegundos = 24 * 60 * 60; // 24 horas en segundos

    if (diferencia >= horasEnSegundos) {
      return "Ya han pasado 24 horas.";
    } else {
      const tiempoRestante = horasEnSegundos - diferencia;
      const objTime = convertirSegundosAHoras(tiempoRestante);
      return `Aún faltan ${objTime.horas} H ${objTime.minutos} M`;
    }
  };
  return (
    <>
      <tr className="bg-white border-b dark:bg-primary-pe dark:border-white-700">
        <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
          {item?.teamId?.toString()}
        </th>
        <td className="px-6 py-4 text-white">{dateToUnix(item?.lastPlayedTime?.toString())}</td>
        <td className="px-6 py-4 text-white">{item.wins?.toString() === "1" && <>🟢</>}</td>
        <td className="px-6 py-4 text-white">{item.losses?.toString() === "1" && <>🔴</>}</td>

        <td className="px-6 py-4 text-white">
          {item.losses?.toString() === "1" ? <>💸 </> : <>${item.earning?.toString() / 1e18} USDT</>}
        </td>
        <td className="px-6 py-4 text-white">
          {youPercentaje(item?.lastPlayedTime?.toString()) ? youPercentaje(item?.lastPlayedTime?.toString()) : 0} %
        </td>

        <td className="px-6 py-4 text-white">
          <>
            {item.losses?.toString() === "1" ? (
              <>👎</>
            ) : (
              <>
                {!canYouPay(item?.lastPlayedTime?.toString()) ? (
                  <>
                    <button onClick={() => setShowModal(true)} className="btn  btn-md  border text-white">
                      Claim rewards
                    </button>
                    {showModal ? (
                      <>
                        <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
                          <div className="relative w-auto my-6 mx-auto max-w-3xl">
                            <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                              <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                                <h3 className="text-3xl font-semibold">
                                  Claim Earning - {dateToUnix(item.lastPlayedTime?.toString())}
                                </h3>
                                <button
                                  className="p-1 ml-auto bg-transparent border-0 text-black float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                                  onClick={() => setShowModal(false)}
                                >
                                  <span className="bg-transparent text-black h-6 w-6 text-2xl block outline-none focus:outline-none">
                                    ×
                                  </span>
                                </button>
                              </div>
                              <div className="relative p-6 flex-auto">
                                <div>
                                  <img
                                    src="https://mariokart8.nintendo.com/assets/img/items/th_coin.png"
                                    alt=""
                                    srcSet=""
                                  />
                                </div>
                                <p className="my-4 text-slate-500 text-lg leading-relaxed">
                                  <p>
                                    Your current tax is <span className="text-red-900 font-bold">{percentaje}%</span>{" "}
                                  </p>

                                  <p>
                                    You have : ${item.earning?.toString() / 1e18} USD Less the tax of {percentaje}%{" "}
                                  </p>
                                  <p>You are about to claim </p>
                                  <p>
                                    <b>
                                      {cmkperc?.toFixed(3)} $CMK - {perc} USD{" "}
                                    </b>
                                  </p>
                                  <p>
                                    For each day that you leave your rewards this tax will go down or it may come out in
                                    0 Good luck
                                  </p>
                                  <p>
                                    It can be more or it can be less the calculations are in real time and it is done by
                                    the smart contract
                                  </p>

                                  <p> Are you sure you want to go ahead now? </p>
                                </p>
                              </div>

                              <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
                                <Web3Button
                                  contractAddress={GameCMK}
                                  contractAbi={GameCMKABI}
                                  className="btn-custom-class ret"
                                  action={() =>
                                    withdrawEarnings({
                                      args: [Number(item.teamId?.toString()), idkey],
                                      overrides: {
                                        value: InPrice?.toString()
                                      }
                                    })
                                  }
                                  onSuccess={(result) => {
                                    win(result);
                                  }}
                                  onError={(error) => errorMane(error)}
                                  theme="dark"
                                >
                                  {" "}
                                  Claim Now {cmkperc.toFixed(3)} $CMK
                                </Web3Button>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
                      </>
                    ) : null}
                  </>
                ) : (
                  <>🤑 Plaimed Bounty ✅</>
                )}
              </>
            )}{" "}
          </>
        </td>
      </tr>
    </>
  );
};
const Rewards = () => {
  const address = useAddress();
  const [selectedValue, setSelectedValue] = useState(0); // Estado para almacenar el valor seleccionado
  const { contract: WithdrawContracts } = useContract(WithdrawContract, WithdrawContractABI);

  const { contract: CMKTokenNewcontract } = useContract(CMKTokencontract, CmkABI);

  const { data: permitedToken, isLoading: loaderToken } = useContractRead(CMKTokenNewcontract, "allowance", [
    address,
    CmknftCharacters
  ]);

  const { contract: GameCMKContract } = useContract(GameCMK, GameCMKABI);

  const { contract: nftContract } = useContract(CmknftCharacters, CMKNftCharactersABI);

  const { contract: nftContractRacingTeamCMK } = useContract(RacingTeamCMK, RacingTeamCMKABI);

  const { contract: CMKOraclecontractUse } = useContract(CMKOraclecontract, CMKOraclecontractABI);
  const { data: priceBNB } = useContractRead(CMKOraclecontractUse, "getBNBFromUSD", ["2180000000000000000"]);
  const { contract: RacingTeamCMKcontractUse } = useContract(RacingTeamCMK, RacingTeamCMKABI);
  const { data: getNFTDeposit } = useContractRead(RacingTeamCMKcontractUse, "getNFTDeposit", [
    address,
    Number(selectedValue ? selectedValue : 0)
  ]);

  const { data: getUserWinInfo, isLoading: loaderGetUserWinInfo } = useContractRead(GameCMKContract, "getUserWinInfo", [
    address,
    Number(getNFTDeposit?.tokenId?.toString())
  ]);
  //Number(getNFTDeposit?.tokenId?.toString())

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
  const { data: getWalletWinInfoNFTs } = useContractRead(WithdrawContracts, "getWalletWinInfoNFTs", [address]);

  const MissionG = getUserWinInfo;

  //withdrawEarnings
  // playGame
  const handleSelectChange = (event) => {
    setSelectedValue(event.target.value);
  };
  const totalExperienceForCharacters = () => {
    let totalExperienceForCharacters = 0;
    for (const item of MissionG) {
      if (!item.pay) {
        totalExperienceForCharacters += Number(item.earning?.toString());
      }
    }
    return totalExperienceForCharacters / 1e18;
  };
  const totalExperienceForCharactersLooss = () => {
    let totalExperienceForCharacters = 0;
    for (const item of MissionG) {
      totalExperienceForCharacters += Number(item.losses?.toString());
    }
    return totalExperienceForCharacters;
  };
  const totalExperienceForCharactersWinner = () => {
    let totalExperienceForCharacters = 0;
    for (const item of MissionG) {
      totalExperienceForCharacters += Number(item.wins?.toString());
    }
    return totalExperienceForCharacters;
  };
  const obtenerUltimosTresElementos = () => {
    const newObje = {
      teamId: 0,
      lastPlayedTime: 0,
      wins: 0,
      losses: 0,
      earning: 0
    };
    const Whitelist = "0x72b5364f138cB15A47BA7D9ffd6D21b0362Ae0A3";
    const MissionG = getUserWinInfo;
    const ultimosTres = MissionG;
    const objRed = getWalletWinInfoNFTs?.filter(
      (elemento) => elemento.teamId?.toString() === selectedValue?.toString()
    );

    return ultimosTres;
  };

  // getUserWinInfo
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
          <h1 className="text-2xl font-semibold whitespace-nowrap">Cartel Rewards</h1>
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
                    Name : {item.additionalInfo} - SPD : {item?.SPDValue?.toString()}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        {getUserWinInfo?.length > 0 && (
          <>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3 lg:grid-cols-3">
              <div className="p-5 text-center rounded-lg bg-primary-pe">
                <h4 className="sm:text-base md:text-lg ">Total Winner</h4>
                <p className="sm:text-lg md:text-3xl text-white ">{totalExperienceForCharactersWinner()} </p>
              </div>
              <div className="p-5 text-center rounded-lg bg-primary-pe ">
                <h4 className="sm:text-base md:text-lg ">Total Losser</h4>
                <p className="sm:text-lg md:text-3xl text-white">{totalExperienceForCharactersLooss()} </p>
              </div>
              <div className="p-5 text-center rounded-lg bg-primary-pe ">
                <h4 className="sm:text-base md:text-lg ">Total Rewards</h4>
                <p className="sm:text-lg text-white md:text-3xl ">{totalExperienceForCharacters()} USDT</p>
              </div>
            </div>
          </>
        )}

        {(getUserWinInfo?.length > 0 && (
          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-yellow-50 dark:bg-yellow-300 dark:text-black">
              <tr>
                <th scope="col" className="px-6 py-3">
                  Team ID
                </th>
                <th scope="col" className="px-6 py-3">
                  Date
                </th>
                <th scope="col" className="px-6 py-3">
                  Wins
                </th>
                <th scope="col" className="px-6 py-3">
                  Losses
                </th>
                <th scope="col" className="px-6 py-3">
                  Earning
                </th>{" "}
                <th scope="col" className="px-6 py-3">
                  Fee
                </th>
                <th scope="col" className="px-6 py-3">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {obtenerUltimosTresElementos().map((item, key) => (
                <CardMIssion
                  item={item}
                  key={key}
                  idkey={key}
                  permitedToken={permitedToken}
                  priceBNB={priceBNB}
                  nfyId={selectedValue}
                />
              ))}
            </tbody>
          </table>
        )) || (
            <div className="text-center">
              <h1 className="text-3xl">Not REWARDS</h1>
            </div>
          )}
      </div>
    </div>
  );
};

export default Rewards;