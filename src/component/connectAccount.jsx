import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import EtherWallet from "../artifacts/contracts/EtherWallet.sol/EtherWallet.json";

//Boostratp components
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

// rainbowKit and wagmi
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useSigner, useContract, useContractRead } from "wagmi";

export const ConnectAccount = () => {
  const contractAddress = "0x566C004f350a3DB3e1c196A7858003Ed44c63404";

  //Etherwallet smart contract handling
  const [scbalance, setscBalance] = useState(0);
  const [ethToDeposit, setethToDeposit] = useState(0);
  const [ethToUseForWithdrawal, setEthToUseForWithdrawal] = useState();
  const [ethAddrToUseForWithdrawal, setEthAddrToUseForWithdrawal] = useState();

  const { data: contractBalance } = useContractRead({
    address: contractAddress,
    abi: EtherWallet.abi,
    functionName: "balanceOf",
    watch: true,
  });

  useEffect(() => {
    if (contractBalance) {
      setscBalance(contractBalance / 10 ** 18);
    }
  }, [contractBalance]);

  const { data: signer } = useSigner();
  const contract = useContract({
    address: contractAddress,
    abi: EtherWallet.abi,
    signerOrProvider: signer,
  });

  const depositToEtherWalletContract = async () => {
    await contract.deposit({
      value: ethers.utils.parseEther(ethToDeposit),
    });
  };

  const withdrawFromEtherWalletContract = async () => {
    if (ethAddrToUseForWithdrawal) {
      await contract.withdraw(
        ethAddrToUseForWithdrawal,
        ethers.utils.parseEther(ethToUseForWithdrawal)
      );

      setEthToUseForWithdrawal(0);
      setEthAddrToUseForWithdrawal("");
    }
  };

  return (
    <div className="container pt-5 col-lg-6 col-md-8">
      <div className="flex mb-6">
        <ConnectButton />
      </div>
      <h3 className="font-bold mt-3 text=5x1">
        Deposit to EtherWallet Smart Contract
      </h3>
      <Form.Group className="mb-4" controlId="numberInEth">
        <Form.Control
          type="text"
          placeholder="Enter amount to deposit in Eth"
          className="mb-3"
          value={ethToDeposit}
          onChange={({ target: { value } }) => setethToDeposit(value)}
        />
        <Button
          variant="primary"
          type="button"
          onClick={depositToEtherWalletContract}
        >
          Deposit to EtherWallet Smart Contract
        </Button>
      </Form.Group>

      <div className="mt-2 mb-2">
        Etherwallet Smart Contract Address:{contractAddress}
      </div>
      <div className="mt-2 mb-2">
        Etherwallet Smart Contract Balance:{Number(scbalance).toFixed(2)} ETH
      </div>

      <h3 className="font-bold mt-5 text=5x1">
        Withdraw from EtherWallet Smart Contract
      </h3>
      <Form.Group className="mb-3" controlId="numberInEthWithdraw">
        <Form.Control
          type="text"
          value={ethToUseForWithdrawal}
          placeholder="Enter amount to withdraw in ETH"
          className="mb-3"
          onChange={(e) => setEthToUseForWithdrawal(e.target.value)}
        />
        <Form.Control
          type="text"
          value={ethAddrToUseForWithdrawal}
          placeholder="Enter the ETH address to withdraw to"
          className="mb-3"
          onChange={(e) => setEthAddrToUseForWithdrawal(e.target.value)}
        />
        <Button
          variant="primary"
          type="button"
          onClick={withdrawFromEtherWalletContract}
        >
          Withdraw from EtherWallet Smart Contract
        </Button>
      </Form.Group>
    </div>
  );
};
