import React, { useState, useMemo, useEffect } from "react";
import { ethers } from "ethers";
import Minting from "Minting";
import { useFormData2 } from "utils/DataContext";

import {
  useAddress,
  useDisconnect,
  ConnectWallet,
  useContractRead,
  Web3Button,
  useContractWrite,
  useContract
} from "@thirdweb-dev/react";
import CmknftCharactersABI from "../nft/CmknftCharactersAbi.json";
import RacingTeamCMKABI from "../nft/RacingTeamCMK.json";

const CmknftCharacters = "0xE47254aC4AD2b9dDB223243C18205fC8f28bA1eB";
const RacingTeamCMK = "0x90A3d026a15C6BA5be28a8f013F7B215d2647A1A";

const listFilterRarity = ["All", "1", "2", "3", "4", "5"];

const Character = () => {
  const [filters, setFilters] = useState();
  const [checkedItems, setCheckedItems] = useState([]);
  const { formData2, setFormData2 } = useFormData2([]);

  const [listCharacters, setListCharacters] = useState([]);
  const [fields, setFields] = useState({ minimum: null, maximun: null });
  const address = useAddress();
  const { contract: CmknftCharactersContract } = useContract(CmknftCharacters, CmknftCharactersABI);

  const { data: getWalletNFTs, isLoading } = useContractRead(CmknftCharactersContract, "getWalletNFTs", [address]);

  const { data: getOwnerOf, isLoading: isGeloading } = useContractRead(CmknftCharactersContract, "ownerOf", [address]);

  const { contract: nftContractRacingTeamCMK } = useContract(RacingTeamCMK, RacingTeamCMKABI);

  const { data: getRacingTeams, isLoading: loadergetRacingTeams } = useContractRead(
    nftContractRacingTeamCMK,
    "getRacingTeams",
    [address]
  );

  const countCharactersNFT = useMemo(() => {
    if (isLoading) return [];
    // const charactersIds = getRacingTeams.map((item) => item.charactersIds.toString());
    const charactersIds = getRacingTeams.flatMap((item) => item.charactersIds.map(String));
    const flattenedCharactersIds = charactersIds.join(",").split(",");

    return getWalletNFTs?.filter(
      (item) => item?.typeNFt === "NFT" && !flattenedCharactersIds.includes(item.id.toString())
    );
  }, [getWalletNFTs, isLoading]);

  useEffect(() => {
    if (listCharacters?.length !== 0) return;
    setListCharacters(countCharactersNFT);
  }, [countCharactersNFT]);

  useEffect(() => {
    if (filters == null) return;
    if (filters?.rarity === "All") return handleResetFilter();
    const totalExperienceForCharacters = countCharactersNFT?.filter(
      (item) => Number(item.rarity.toString()) === Number(filters?.rarity)
    );

    setListCharacters(totalExperienceForCharacters);
  }, [filters]);

  const totalExperienceForCharacters = () => {
    let totalExperienceForCharacters = 0;
    for (const item of countCharactersNFT) {
      totalExperienceForCharacters += Number(item.experienceRange.toString());
    }
    return totalExperienceForCharacters;
  };

  function handleFilter(params) {
    if (fields.maximun != null || fields.minimum != null) {
      setFilters((current) => ({ ...current, ...fields }));
    }
  }

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

  const handleCheckboxChange = (event, nft) => {
    const item = event.target.name;
    const isChecked = event.target.checked;

    if (isChecked) {
      // Si está marcado, agrega el objeto al array
      setFormData2((prevItems) => [...prevItems, { ...nft, nftid: item, checked: isChecked }]);
    } else {
      // Si está desmarcado, filtra el array para eliminar el objeto con el nftid correspondiente
      setFormData2((prevItems) => prevItems.filter((obj) => obj.nftid !== item));
    }
  };

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
        <h1 className="text-2xl font-semibold whitespace-nowrap">NFT</h1>
      </div>

      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <>
          <div className="p-5 rounded-lg bg-primary-pe-pe flex flex-row justify-between items-start ">
            <div className="flex flex-col items-start gap-1">
              <span className="text-xl">Filter NFT By Rarity</span>
              <div className="flex flex-row items-center">
                {listFilterRarity?.map((item, key) => (
                  <button key={key} className="btn" onClick={() => onChangeFilter({ key: "rarity", value: item })}>
                    {item}
                  </button>
                ))}
              </div>
              {filters != null && (
                <button onClick={handleResetFilter} className="btn">
                  Reset
                </button>
              )}
            </div>
          </div>

          <div className=" mt-2 container mx-auto px-4 ">
            {listCharacters.length ? (
              <>
                {" "}
                <div>
                  <h2 className="mb-5 pl-2 text-lg font-medium text-gray-900 dark:text-back">Selet NFT</h2>
                </div>
                <div className="flex justify-center items-center ">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {listCharacters?.map((item, key) => (
                      <div key={key}>
                        <input
                          type="checkbox"
                          id={item.id.toString()}
                          name={item.id.toString()}
                          className="hidden peer"
                          checked={formData2.checked} // Verifica si el item está en formData2
                          onChange={(event) => {
                            handleCheckboxChange(event, item);
                          }}
                        />
                        <label
                          key={item.id.toString()}
                          htmlFor={item.id.toString()}
                          className="inline-flex items-center justify-between w-full  text-gray-500 bg-white border-4 border-gray-200 rounded-lg cursor-pointer dark:hover:text-gray-300 dark:border-gray-700 peer-checked:border-blue-600 hover:text-gray-600 dark:peer-checked:text-gray-300 peer-checked:text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700"
                        >
                          <div className="card-game" id={key}>
                            <div className="bg-game">
                              <img src={"/nft/" + item.image} alt={item.name} width={150} />

                              <span className="rarity-game">SPC: {item.experienceRange.toString()}</span>

                              <span className="rarity-id-game">ID: {item.id.toString()}</span>
                            </div>
                            <div className="blob-game"></div>
                          </div>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <>
                {" "}
                <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-6">
                  <div className="p-5 text-center rounded-lg bg-primary-pe">
                    <h4 className="sm:text-base md:text-lg "> Hire a NFT </h4>
                    <Minting value="NFT" />
                  </div>
                </div>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Character;