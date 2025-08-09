import React from "react";
import Character from "components/Character";
import Karkit from "components/Karkit";
import TeamCreate from "components/TeamCreate";
// 0x90A3d026a15C6BA5be28a8f013F7B215d2647A1A
import { ethers } from "ethers";
import { MynftsForm } from "MynftsForm";

import {
  useAddress,
  useDisconnect,
  ConnectWallet,
  useContract,
  useContractRead,
  Web3Button,
  useContractWrite
} from "@thirdweb-dev/react";
import CMKNftCharactersABI from "../../nft/CmknftCharactersAbi.json";
import RacingTeamCMKABI from "../../nft/RacingTeamCMK.json";

const CmknftCharacters = "0xE47254aC4AD2b9dDB223243C18205fC8f28bA1eB";
const CMKTokencontract = "0xcf79feb331be62b7d0840ccd434503ba1ecdff44";
const CMKOraclecontract = "0x49Ec0A2b14763e1734610B31Eb943Eb8Bb1E8026";
const RacingTeamCMK = "0x90A3d026a15C6BA5be28a8f013F7B215d2647A1A";

const RacingTeamCreate = () => {
  const address = useAddress();
  const { contract: nftContract } = useContract(CmknftCharacters, CMKNftCharactersABI);

  const { data: permited, isLoading: loader } = useContractRead(nftContract, "isApprovedForAll", [
    address,
    RacingTeamCMK
  ]);
  const { mutateAsync: CallApprove } = useContractWrite(nftContract, "setApprovalForAll");

  return (
    <div>
      <div
        className="flex flex-col
              items-start
              justify-between
        
              space-y-4
check-header
              border-b
              lg:items-center lg:space-y-0 lg:flex-row  "
      >
        <h1 className="text-2xl font-semibold whitespace-nowrap">Create Cartel </h1>
      </div>
      <div className="p-5 text-center rounded-lg bg-primary-pe text-white mt-7 flex flex-col gap-1">
        {permited ? (
          <>
            {" "}
            <a href="#" className="btn btn-custom-class">
              It's time to create your Team
            </a>
          </>
        ) : (
          <>
            <Web3Button
              contractAddress={CmknftCharacters}
              contractAbi={CMKNftCharactersABI}
              className="btn-custom-class "
              action={() =>
                CallApprove({
                  args: [RacingTeamCMK, true]
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
      {permited ? (
        <>
          {" "}
          <div className="grid grid-cols-1 gap-6 mt-6 mb-7 md:grid-cols-1 lg:grid-cols-3">
            <Character />
            <Karkit />
            <TeamCreate />
          </div>
        </>
      ) : (
        <>
          {" "}
          <Web3Button
            contractAddress={CmknftCharacters}
            contractAbi={CMKNftCharactersABI}
            className="btn-custom-class "
            action={() =>
              CallApprove({
                args: [RacingTeamCMK, true]
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
  );
};

export default RacingTeamCreate;