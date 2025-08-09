import React from "react";

import {
  useAddress,
  useDisconnect,
  ConnectWallet,
  useContract,
  useContractRead,
  Web3Button,
  useContractWrite
} from "@thirdweb-dev/react";
import logo from "../assets/images/logo.png";
import incognita from "../assets/images/nft/incognita.png";

export const MinterPAge = ({ permited }) => {
  return (
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
            <p className="text-white text-3xl font-semibold sm:text-4xl">Mint your Character or Arsenal</p>
            <div className="max-w-xl">
              <p>Please select the character and the amount of items to minter.</p>
            </div>
          </div>
          {permited?.toString() !== "0" ? (
            <>
              <div className="mt-16 justify-center sm:flex gap-4">
                <div
                  className={`relative flex-1 flex items-stretch flex-col mt-6 border-2 sm:mt-0 sm:rounded-xl sm:max-w-md bg-gray-900 border-cyan-400 border-x-0 sm:border-x-2"
                `}
                >
                  <div className="py-8 space-y-4">
                    <div className="text-red-900 text-3xl font-semibold">
                      <img src={incognita} height={300} alt="" />
                    </div>
                  </div>
                </div>
                <div
                  className={`relative flex-1 flex items-stretch flex-col mt-6 border-2 sm:mt-0 sm:rounded-xl sm:max-w-md bg-gray-900 border-cyan-400 border-x-0 sm:border-x-2"
                `}
                >
                  <div className="py-8 space-y-4">
                    <div className="text-red-900 text-3xl font-semibold">kkk</div>
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
                    args: [CmknftCharacters, ethers?.utils?.parseEther("1000")]
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
          )}
        </div>
      </section>
    </>
  );
};