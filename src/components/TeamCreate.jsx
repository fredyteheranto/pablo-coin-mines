import React, { useState, useMemo, useEffect } from "react";
import { ethers } from "ethers";
import Minting from "Minting";
import { useHistory } from "react-router-dom";
import { useFormData2, useFormData } from "utils/DataContext";

import {
  useAddress,
  useDisconnect,
  ConnectWallet,
  useContract,
  useContractRead,
  Web3Button,
  useContractWrite
} from "@thirdweb-dev/react";
import CmknftCharactersABI from "../nft/CmknftCharactersAbi.json";
import CMKOraclecontractABI from "../nft/oracle.json";
import RacingTeamCMKABI from "../nft/RacingTeamCMK.json";

const CmknftCharacters = "0xE47254aC4AD2b9dDB223243C18205fC8f28bA1eB";
const CMKTokencontract = "0xcf79feb331be62b7d0840ccd434503ba1ecdff44";
const CMKOraclecontract = "0x49Ec0A2b14763e1734610B31Eb943Eb8Bb1E8026";
const RacingTeamCMK = "0x90A3d026a15C6BA5be28a8f013F7B215d2647A1A";
//0x947a3B6d46520b310184416Db7214D3873bc14F5
const listFilterRarity = ["All", "1", "2", "3", "4", "5"];

const TeamCreate = () => {
  const [idCharacters, setCharacters] = useState([]);
  const [listCharacters, setListCharacters] = useState([]);
  const [fields, setFields] = useState({ minimum: null, maximun: null });
  const address = useAddress();
  const [inputValue, setInputValue] = useState("New Cartel  ");
  const { formData: karKit } = useFormData();
  const { formData2: Character } = useFormData2();
  const { contract: CmknftCharactersContract } = useContract(CmknftCharacters, CmknftCharactersABI);

  const { contract: nftContract } = useContract(CmknftCharacters, CmknftCharactersABI);

  const { contract: nftContractRacingTeamCMK } = useContract(RacingTeamCMK, RacingTeamCMKABI);

  const { data: permited, isLoading: loader } = useContractRead(nftContract, "isApprovedForAll", [
    address,
    RacingTeamCMK
  ]);
  const { contract: CMKOraclecontractUse } = useContract(CMKOraclecontract, CMKOraclecontractABI);

  const { mutateAsync: createTeam } = useContractWrite(nftContractRacingTeamCMK, "createRacingTeams");

  const { mutateAsync: dissolveRacingTeams } = useContractWrite(nftContractRacingTeamCMK, "dissolveRacingTeams");

  const { data: priceBNB } = useContractRead(CMKOraclecontractUse, "getBNBFromUSD", ["1500000000000000000"]);

  const idskarKit = karKit.map((objeto) => parseInt(objeto.id, 10));

  const idsCharacter = Character.map((objeto) => parseInt(objeto.id, 10));

  const handleRedireccionar = () => {
    alert("It's time to play!");
    // Realizar el refresh de la página
    window.location.reload();

    // Redirigir a la nueva ruta después del refresh
    history.push("/racing-missions");
  };

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  function onChangeFilter({ key, value }) {
    let aux = {};
    if (filters != null) {
      aux = filters;
    }
    setFilters({ ...aux, [key]: value });
  }

  function handleResetFilter() {
    setListCharacters(countCharactersNFT);
    setFilters(null);
  }

  const generateMetadata = (_name, _karkits, _characters) => {
    const NFTMetadata = {
      name: _name,
      description: _name,
      image: "https://cryptomariokart.site/team/team.png",
      attributes: [
        {
          trait_type: "Author",
          value: "CMK"
        },
        {
          display_type: "date",
          trait_type: "Published",
          value: new Date()
        },
        {
          trait_type: "Name Team",
          value: _name
        },
        {
          trait_type: "Karkits",
          value: [_karkits]
        },
        {
          trait_type: "NFT",
          value: [_characters]
        }
      ]
    };
    const jsonData = JSON.stringify(NFTMetadata);
    const base64Data = btoa(jsonData);
    return base64Data;
  };

  function totalExperienceForCharacters() {
    let totalExperienceForCharacters = 0;
    for (const item of Character) {
      totalExperienceForCharacters += Number(item.experienceRange.toString());
    }
    return totalExperienceForCharacters;
  }
  function totalExperienceForKarkit() {
    let totalExperienceForCharacters = 0;
    for (const item of karKit) {
      totalExperienceForCharacters += Number(item.experienceRange.toString());
    }
    return totalExperienceForCharacters;
  }

  return (
    <div className="flex flex-col gap-5">
      <div
        className="flex flex-col check-header 
              items-start
              justify-between
              
              space-y-4
              border-b
              lg:items-center lg:space-y-0 lg:flex-row "
      >
        <h1 className="text-2xl font-semibold whitespace-nowrap">New Team</h1>
      </div>

      <>
        <div className="p-5 rounded-lg bg-primary-pe ">
          <div className="flex flex-col  w-full items-center gap-1 ">
            <span className="text-xl">Create New Team</span>

            <div className="flex flex-col w-full ">
              <label htmlFor="nameTeam" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Name your Team
              </label>
              <input
                name="nameTeam"
                className=" bg-black block w-full form-input px-4 py-3 rounded-lg"
                required
                placeholder="My New Team"
                type="text"
                value={inputValue}
                onChange={handleInputChange}
              />
            </div>
            <div className="flex flex-col w-full ">
              <label htmlFor="nameTeam" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Karkits ({totalExperienceForKarkit()})
              </label>{" "}
              <div className="grid grid-cols-4 gap-4">
                {karKit.map((obj) => (
                  <div key={obj.nftid}>
                    <img className="rounded-lg " src={"/selected/c_" + obj.image} alt={obj.name} width={150} />
                  </div>
                ))}
              </div>
            </div>
            <hr />
            <div className="flex flex-col w-full ">
              <label htmlFor="nameTeam" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Characters ({Character.length}/{totalExperienceForKarkit()})
              </label>
              {Character.length > totalExperienceForKarkit() ? (
                <>To add more you must add more Karkit</>
              ) : (
                <>
                  <div className="grid grid-cols-4 gap-4">
                    {Character.map((obj) => (
                      <div key={obj.nftid}>
                        <img src={"/selected/c_" + obj.image} alt={obj.name} width={80} />
                        <p className="text-sm "> {obj.name}</p>
                        <p className="text-sm ">PWR: {obj.experienceRange.toString()}</p>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-col w-full ">
                    <label htmlFor="nameTeam" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                      Resume
                    </label>
                  </div>
                  <div className="flex flex-col w-full ">
                    <div>
                      <p className="text-sm "> TEAM NAME: {inputValue} </p>
                      <p className="text-sm "> PWR: {totalExperienceForCharacters()}</p>
                    </div>
                  </div>
                  <div className="flex flex-col w-full ">
                    {idsCharacter.length > 0 && idsCharacter.length > 0 && inputValue !== "" && (
                      <>
                        <Web3Button
                          contractAddress={CmknftCharacters}
                          contractAbi={CmknftCharactersABI}
                          className="btn-custom-class "
                          action={() =>
                            createTeam({
                              args: [
                                idskarKit,
                                idsCharacter,
                                inputValue,
                                "https://metadata.cryptomariokart.site/" +
                                generateMetadata(inputValue, idskarKit, idsCharacter)
                              ],
                              overrides: {
                                value: priceBNB // send 0.1 native token with the contract call
                              }
                            })
                          }
                          onSuccess={(result) => handleRedireccionar()}
                          onError={(error) => alert(error)}
                          theme="dark"
                        >
                          {" "}
                          Create Cartel
                        </Web3Button>
                      </>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </>
    </div>
  );
};

export default TeamCreate;