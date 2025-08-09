import React, { useState, useMemo, useEffect } from "react";
import { ethers } from "ethers";
import Minting from "Minting";
import PreMInt from "PreMInt";

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
const CMKTokencontract = "0xcf79feb331be62b7d0840ccd434503ba1ecdff44";
const CMKOraclecontract = "0x49Ec0A2b14763e1734610B31Eb943Eb8Bb1E8026";

const listFilterRarity = ["All", "1", "2", "3", "4", "5"];

const Premint = () => {
  const [filters, setFilters] = useState();
  const [listCharacters, setListCharacters] = useState([]);
  const [fields, setFields] = useState({ minimum: null, maximun: null });
  const address = useAddress();
  const { contract: CmknftCharactersContract } = useContract(CmknftCharacters, CmknftCharactersABI);

  const { data: getWalletNFTs, isLoading } = useContractRead(CmknftCharactersContract, "getWalletNFTs", [address]);

  const countCharactersNFT = useMemo(() => {
    if (isLoading) return [];
    return getWalletNFTs?.filter((item) => item.typeNFt === "NFT");
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
              space-y-1
              border-b
              lg:items-center lg:space-y-0 lg:flex-row "
      >
        <h1 className="text-2xl font-semibold whitespace-nowrap">Pre - Mint</h1>
      </div>

      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-6 mt-6 ">
            <div className="p-5 text-center rounded-lg bg-primary-pe bg-card">
              <h4 className="sm:text-base md:text-lg ">  Pre Mint NFT </h4>

              <PreMInt value="NFT" />

            </div>

          </div>

        </>
      )}
    </div>
  );
};

export default Premint;