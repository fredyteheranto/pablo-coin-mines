/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import { useLocation } from "react-router-dom";
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
import incognita from "./assets/images/nft/incognita.png";
import CmknftCharactersABI from "./nft/CmknftCharactersAbi.json";
import CMKOraclecontractABI from "./nft/oracle.json";
import CmkABI from "./nft/token.json";

const CmknftCharacters = "0xE47254aC4AD2b9dDB223243C18205fC8f28bA1eB";
const CMKTokencontract = "0xcf79feb331be62b7d0840ccd434503ba1ecdff44";
const CMKOraclecontract = "0x49Ec0A2b14763e1734610B31Eb943Eb8Bb1E8026";

function App() {
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

  const permited = useContractRead(CMKTokenNewcontract, "allowance", [address, CmknftCharacters]);

  const getBNBFromUSD = useContractRead(CMKOraclecontractUse, "getBNBFromUSD", ["1500000000000000000"]);
  const { getCMKFromUSD } = useContractRead(CMKOraclecontractUse, "getCMKFromUSD", ["20000000000000000000"]);
  const priceBNB = String(Number(getBNBFromUSD?.data?.toString()) * quantity);

  const priceInCmk = String(Number(getCMKFromUSD?.data?.toString()) * quantity);

  const { mutateAsync: buyCharactersCMK } = useContractWrite(CmknftCharactersContract, "buyCharactersCMK");

  const { mutateAsync: buyCarKitCMK, isLoading } = useContractWrite(CmknftCharactersContract, "buyCarKitCMK");
  const { mutateAsync: CallApprove } = useContractWrite(CMKTokenNewcontract, "approve");

  const handleCharacters = (e) => {
    setCharacters(e.target.value);
  };

  const handleQueatity = (e) => {
    setQuantity(e.target.value);
  };

  return (
    <div className="flex h-screen flex-col lg:grid lg:grid-cols-10">
      {/* Left */}
      <div className="lg:col-span-4 bg-gradient-to-br from-red-800 to-red-500">
        <div className="flex flex-col items-center justify-center py-2 lg:min-h-screen">
          <div className="rounded-xl bg-gradient-to-br from-yellow-400 to-red-600">
            <img
              className="w-44 rounded-xl object-cover lg:h-96 lg:w-72 p-2"
              src="https://cryptomariokart.com/images/cryptomariokart-nft.png"
              alt="logo"
              width={280}
              height={384}
            />
          </div>
          <div className="space-y-2 p-5 text-center">
            <h1 className="text-4xl font-bold text-white">Mint Your </h1>
            <h2 className="text-xl text-gray-300">NFT</h2>
          </div>
        </div>
      </div>

      {/* Right */}
      <div className="flex flex-1 flex-col p-12 lg:col-span-6">
        <header className="flex items-center justify-between">
          <h1 className="w-52 cursor-pointer text-xl font-extralight sm:w-80">
            <span className="font-extrabold underline decoration-pink-600/50">{`Cryptomariokart`}</span>
            {` NFT Mint`}
          </h1>

          <ConnectWallet />
        </header>
        <hr className="my-2 border" />

        {/* Content */}

        {permited?.data?.toString() === "0" || permited?.data?.toString() !== priceInCmk ? (
          <>
            <div className=" flex flex-col flex-1 items-center space-y-6 text-center lg:space-y-0 ">
              <h1 className="text-3xl font-bold lg:font-5xl lg:font-extrabold">To buy you must approve the contract</h1>
              <div className="divider"></div>{" "}
              <img className="object-cover  pb-10 " src={incognita} width={280} height={430} />
              <div className="divider"></div>{" "}
            </div>
            <Web3Button
              contractAddress={CMKTokencontract}
              contractAbi={CmkABI}
              className="btn-custom-class reinv"
              action={() =>
                CallApprove({
                  args: [CmknftCharacters, ethers.utils.parseEther("1000")]
                })
              }
              onSuccess={(result) => alert("Success!")}
              onError={(error) => alert("Something went wrong!")}
              theme="dark"
            >
              {" "}
              Approve PEM
            </Web3Button>
          </>
        ) : (
          <>
            <div className="mt-10 flex flex-col flex-1 items-center space-y-6 text-center lg:space-y-0">
              <h1 className="text-3xl font-bold lg:font-5xl lg:font-extrabold">Select what you want to mint</h1>
              <div className="divider"></div>
              <div>
                {" "}
                <select
                  onChange={handleCharacters}
                  value={characters}
                  className="select select-bordered w-full max-w-xs "
                >
                  <option disabled>Pick your favorite language</option>
                  <option value="NFT">Characters</option>
                  <option value="Arsenal">Arms</option>
                </select>
              </div>
              <div className="divider"></div>
              <img className="object-cover pb-10 " src={incognita} width={280} height={384} />

              <div className="divider"></div>
              <div>
                <select value={quantity} onChange={handleQueatity} className="select select-bordered w-full max-w-xs">
                  <option disabled value="0">
                    Select NFT number to mint{" "}
                  </option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                  <option value="10">10</option>
                </select>
              </div>

              <ReferralLink />
            </div>

            {/* Mint */}

            {characters === "NFT" ? (
              <>
                <Web3Button
                  contractAddress={CmknftCharacters}
                  contractAbi={CmknftCharactersABI}
                  className="btn-custom-class ret"
                  action={() =>
                    buyCharactersCMK({
                      args: [quantity, newURLsTrus],
                      overrides: {
                        value: priceBNB // send 0.1 native token with the contract call
                      }
                    })
                  }
                  onSuccess={(result) => alert("Success!", result)}
                  onError={(error) => alert("Something went wrong!", error.Error)}
                  theme="dark"
                >
                  {" "}
                  Buy Character 20 USD
                </Web3Button>
              </>
            ) : (
              <>
                {" "}
                <Web3Button
                  contractAddress={CmknftCharacters}
                  contractAbi={CmknftCharactersABI}
                  className="btn-custom-class ret"
                  action={() =>
                    buyCarKitCMK({
                      args: [quantity, newURLsTrus],
                      overrides: {
                        value: priceBNB // send 0.1 native token with the contract call
                      }
                    })
                  }
                  onSuccess={(result) => alert("Success!", result)}
                  onError={(error) => alert("Something went wrong!", error.Error)}
                  theme="dark"
                >
                  {" "}
                  Buy Arsenal 20 USD
                </Web3Button>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default App;