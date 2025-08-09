import React, { useState, useMemo, useEffect } from "react";
import { ethers } from "ethers";
import Minting from "Minting";

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

const CmknftCharacters = "0xE47254aC4AD2b9dDB223243C18205fC8f28bA1eB";

const listFilterRarity = ["All", "1", "2", "3", "4", "5"];

const Karkits = () => {
  const [filters, setFilters] = useState();
  const [listCharacters, setListCharacters] = useState([]);
  const [fields, setFields] = useState({ minimum: null, maximun: null });
  const address = useAddress();
  const { contract: CmknftCharactersContract } = useContract(CmknftCharacters, CmknftCharactersABI);

  const { data: getWalletNFTs, isLoading } = useContractRead(CmknftCharactersContract, "getWalletNFTs", [address]);

  const countCharactersNFT = useMemo(() => {
    if (isLoading) return [];
    return getWalletNFTs?.filter((item) => item?.typeNFt !== "NFT");
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
        <h1 className="text-2xl font-semibold whitespace-nowrap">Arsenal</h1>
      </div>

      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-6 mt-6 md:grid-cols-2 lg:grid-cols-3">
            <div className="p-5 text-center rounded-lg bg-primary-pe">
              <h4 className="sm:text-base md:text-lg "> Hire a Arsenal </h4>
              <Minting value="Arsenal" />
            </div>
            <div className="p-5 text-center rounded-lg bg-primary-pe ">
              <h4 className="sm:text-base md:text-lg "> Current Karkits</h4>
              <p className="sm:text-lg md:text-3xl "> {countCharactersNFT.length} </p>
            </div>
            <div className="p-5 text-center rounded-lg bg-primary-pe ">
              <h4 className="sm:text-base md:text-lg "> Total SPC</h4>
              <p className="sm:text-lg md:text-3xl "> {totalExperienceForCharacters()} </p>
            </div>
          </div>

          <div className="p-5 rounded-lg bg-primary-pe flex flex-row justify-between items-start ">
            <div className="flex flex-col items-start gap-1">
              <span className="text-xl">Filter By Rarity</span>
              <div className="flex flex-row items-center">
                {listFilterRarity?.map((item, key) => (
                  <button key={key} className="btn" onClick={() => onChangeFilter({ key: "rarity", value: item })}>
                    {item}
                  </button>
                ))}
              </div>
              {filters != null && (
                <button onClick={handleResetFilter} className="btn">
                  Rest
                </button>
              )}
            </div>
          </div>

          <div className="text-center">
            <h1 className="text-3xl">NFT COLLECTIONS</h1>
          </div>
          <div className=" mt-8 container mx-auto px-4 ">
            <div className="flex justify-center items-center ">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {listCharacters.length &&
                  listCharacters?.map((item, key) => (
                    <div className="card" id={key} key={key}>
                      <div className="bg">
                        <img src={"/nft/" + item.image} alt={item.name} width={230} height={303} />

                        <span className="rarity">SPC: {item.experienceRange.toString()}</span>

                        <span className="rarity-id">ID: {item.id.toString()}</span>
                      </div>
                      <div className="blob"></div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Karkits;