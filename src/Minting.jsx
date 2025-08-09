/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState } from "react";
import { MinterPAge } from "components/MinterPAge";
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
import logo from "./assets/images/logo.png";
import incognita from "./assets/images/nft/incognita.png";
import CmknftCharactersABI from "./nft/CmknftCharactersAbi.json";
import CMKOraclecontractABI from "./nft/oracle.json";
import CmkABI from "./nft/token.json";

const CmknftCharacters = "0xE47254aC4AD2b9dDB223243C18205fC8f28bA1eB";
const CMKTokencontract = "0xcf79feb331be62b7d0840ccd434503ba1ecdff44";
const CMKOraclecontract = "0x49Ec0A2b14763e1734610B31Eb943Eb8Bb1E8026";

function Minting({ value }) {
  const address = useAddress();
  const location = useLocation();
  const [characters, setCharacters] = useState(value);
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

  const { data: permited, isLoading: loader } = useContractRead(CMKTokenNewcontract, "allowance", [
    address,
    CmknftCharacters
  ]);
  const { data: tokenData, isLoading: loadingTOneb } = useContractRead(CMKTokenNewcontract, "balanceOf", [address]);

  const { data: getBNBFromUSD } = useContractRead(CMKOraclecontractUse, "getBNBFromUSD", ["1500000000000000000"]);
  //////console.log(address);
  const { data: getCMKFromUSD } = useContractRead(CMKOraclecontractUse, "getCMKFromUSD", ["20000000000000000000"]);
  //////console.log(getCMKFromUSD?.toString());

  const priceBNB = String(Number(getBNBFromUSD?.toString()) * quantity);
  const priceInCmk = String(getCMKFromUSD?.toString() * quantity);
  const permitedCMK = permited?.toString();

  const uirpo = permitedCMK / 1e18;
  const uirpos = (getCMKFromUSD?.toString() * quantity) / 1e18;

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
    <>
      <div className="relative">
        <div className="relative max-w-screen-xl mx-auto text-gray-300 ">
          {loader ? (
            <>Loader</>
          ) : permitedCMK >= 0 ? (
            <>
              <div className="justify-center  flex-1 lg:flex md:flex  gap-6">
                <div
                  className={`relative flex-1 flex items-center flex-col   sm:mt-0 sm:rounded-xl sm:max-w-md
                `}
                >
                  <div className="w-full center">
                    <h3 className="selecsa">Select NFT quantity {value}</h3>
                    <select
                      value={quantity}
                      onChange={handleQueatity}
                      className="select select-bordered w-full selecsa max-w-xs"
                    >
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
                  <div>You will pay : {(priceInCmk / 1e18).toFixed(3)} PEM</div>

                  <div className="py-2 space-y-4">
                    {uirpo >= uirpos ? (
                      <>
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
                              Buy {value} 20 USD
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
                    ) : (
                      <>
                        {" "}
                        <Web3Button
                          contractAddress={CMKTokencontract}
                          contractAbi={CmkABI}
                          className="btn-custom-class reinv"
                          action={() =>
                            CallApprove({
                              args: [CmknftCharacters, tokenData?.toString()]
                            })
                          }
                          onSuccess={(result) => alert("Success!")}
                          onError={(error) => alert(error)}
                          theme="dark"
                        >
                          {" "}
                          Approve PEM
                        </Web3Button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              {" "}
              <Web3Button
                contractAddress={CMKTokencontract}
                contractAbi={CmkABI}
                className="btn-custom-class reinv"
                action={() =>
                  CallApprove({
                    args: [CmknftCharacters, tokenData?.toString()]
                  })
                }
                onSuccess={(result) => alert("Success!")}
                onError={(error) => alert(error)}
                theme="dark"
              >
                {" "}
                Approve PEM
              </Web3Button>
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default Minting;