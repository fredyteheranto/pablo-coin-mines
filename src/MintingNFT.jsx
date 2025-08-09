/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState } from "react";
import {
  useAddress,
  useDisconnect,
  ConnectWallet,
  useContract,
  useContractRead,
  Web3Button,
  useContractWrite
} from "@thirdweb-dev/react";
import { ethers } from "ethers";
import { useLocation } from "react-router-dom";
import incognita from "./assets/images/nft/incognita.png";
import CmknftCharactersABI from "./nft/CmknftCharactersAbi.json";
import CMKOraclecontractABI from "./nft/oracle.json";
import CmkABI from "./nft/token.json";
import ReferralLink from "ReferralLink";
import { MinterPAge } from "components/MinterPAge";
import logo from "./assets/images/logo.png";
import { Mynfts } from "Mynfts";
const CmknftCharacters = "0xE47254aC4AD2b9dDB223243C18205fC8f28bA1eB";
const CMKTokencontract = "0xcf79feb331be62b7d0840ccd434503ba1ecdff44";
const CMKOraclecontract = "0x49Ec0A2b14763e1734610B31Eb943Eb8Bb1E8026";

function MintingNFT() {
  const address = useAddress();
  const location = useLocation();
  const [characters, setCharacters] = useState("NFT");
  const [quantity, setQuantity] = useState(1);

  const searchs = location?.search ? location?.search : window.location.search;
  const udis = searchs.split("=");
  const referall = udis[1];
  const linkudu = referall ? referall : "0x0b56ACEa001c01596F25f86F89D4C259f287a350";

  const caracterBuscado = "&";
  const contieneCaracter = linkudu?.toLowerCase().includes(caracterBuscado.toLowerCase());

  const newURLsTrus = contieneCaracter ? linkudu.split(caracterBuscado)[0] : linkudu;

  const { contract: CmknftCharactersContract } = useContract(CmknftCharacters, CmknftCharactersABI);

  const { contract: CMKTokenNewcontract } = useContract(CMKTokencontract, CmkABI);

  const { contract: CMKOraclecontractUse } = useContract(CMKOraclecontract, CMKOraclecontractABI);

  const { data: permited } = useContractRead(CMKTokenNewcontract, "allowance", [address, CmknftCharacters]);

  const getBNBFromUSD = useContractRead(CMKOraclecontractUse, "getBNBFromUSD", ["1500000000000000000"]);
  const { getCMKFromUSD } = useContractRead(CMKOraclecontractUse, "getCMKFromUSD", ["20000000000000000000"]);
  const priceBNB = String(Number(getBNBFromUSD?.data?.toString()) * quantity);
  //////console.log("priceBNB", priceBNB);
  //////console.log("getBNBFromUSD", getBNBFromUSD?.data?.toString());
  const { mutateAsync: buyCharactersCMK } = useContractWrite(CmknftCharactersContract, "buyCharactersCMK");

  const { mutateAsync: buyCarKitCMK, isLoading } = useContractWrite(CmknftCharactersContract, "buyCarKitCMK");
  const { mutateAsync: CallApprove } = useContractWrite(CMKTokenNewcontract, "approve");

  const handleCharacters = (e) => {
    setCharacters(e.target.value);
    //////console.log(e.target.value);
  };

  const handleQueatity = (e) => {
    setQuantity(e.target.value);
    //////console.log(e.target.value);
  };

  return (
    <>
      <>
        <section className="relative py-14 bg-gray-900">
          <div
            className="absolute inset-0 blur-[118px] max-w-lg h-[800px] mx-auto sm:max-w-3xl sm:h-[400px]"
            style={{
              background:
                "linear-gradient(106.89deg, rgba(255, 0, 0, 1) 15.73%, rgba(255, 0, 0,1 ) 15.74%, rgba(255, 0, 0,0.3) 56.49%, rgba(1, 4, 255, 1) 115.91%)"
            }}
          ></div>
          <div className="relative max-w-screen-xl mx-auto text-gray-300 sm:px-4 md:px-8">
            <div className="max-w-xl mx-auto space-y-3 px-4 sm:text-center sm:px-0">
              <div className=" center-logo text-cyan-400 font-semibold text-center">
                <img src={logo} alt="" />
              </div>

              <p className="text-white text-center text-3xl font-semibold sm:text-4xl">NFT COLLECTIONS</p>
            </div>
            <div>
              <Mynfts />
            </div>
          </div>
        </section>
      </>
    </>
  );
}

export default MintingNFT;
