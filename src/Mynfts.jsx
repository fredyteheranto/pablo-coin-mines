import React, { useMemo } from "react";
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
import CmknftCharactersABI from "./nft/CmknftCharactersAbi.json";

const CmknftCharacters = "0xE47254aC4AD2b9dDB223243C18205fC8f28bA1eB";
export const Mynfts = () => {
  const address = useAddress();
  const { contract: CmknftCharactersContract } = useContract(CmknftCharacters, CmknftCharactersABI);

  const { data: getWalletNFTs, isLoading } = useContractRead(CmknftCharactersContract, "getWalletNFTs", [address]);

  const myNFT = getWalletNFTs;

  return (
    <>
      <div className=" mt-8 container mx-auto px-4 ">
        <div className="flex justify-center items-center ">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {isLoading ? (
              <p>Loading...</p>
            ) : (
              myNFT?.map((item, key) => (
                <div className="card" id={key} key={key}>
                  <div>{item.typeNFt}</div>

                  <div className="bg">
                    <img src={"/nft/" + item.image} alt={item.name} width={230} height={303} />

                    {item.typeNFt === "NFT" ? (
                      <>
                        <span className="rarity">PWR: {item.experienceRange.toString()}</span>
                      </>
                    ) : (
                      <>
                        {" "}
                        <span className="rarity">SPC: {item.experienceRange.toString()}</span>
                      </>
                    )}
                    <span className="rarity-id">ID: {item.id.toString()}</span>
                  </div>
                  <div className="blob"></div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
};