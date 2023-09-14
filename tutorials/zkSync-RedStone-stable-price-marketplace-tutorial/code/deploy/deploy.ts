import hre from "hardhat";
import fs from "fs";
import { ethers } from "ethers";
import { Wallet } from "zksync-web3";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { Deployer } from "@matterlabs/hardhat-zksync-deploy";
import dotenv from "dotenv";

dotenv.config();

// load wallet private key from env file
const PRIVATE_KEY = process.env.WALLET_PRIVATE_KEY || "";

if (!PRIVATE_KEY)
  throw "⛔️ Private key not detected! Add it to the .env file!";


export default async function (hre: HardhatRuntimeEnvironment) {
  const wallet = new Wallet(PRIVATE_KEY);
  const deployer = new Deployer(hre, wallet);

  const nftContract = await deployContract("ExampleNFT", deployer);
  const marketplaceContract = await deployContract("StableMarketplace", deployer);

  // Update JSON file with addresses
  updateAddressesFile({
    nft: nftContract.address,
    marketplace: marketplaceContract.address,
  });
}

export const deployContract = async (contractName: string, deployer: Deployer) => {
  console.log(`Running deploy script for the PriceChecker contract`);

  // const artifact = await deployer.loadArtifact("PriceChecker");
  const artifact = await deployer.loadArtifact(contractName);

  // Estimate contract deployment fee
  const deploymentFee = await deployer.estimateDeployFee(artifact, []);

  // ⚠️ OPTIONAL: You can skip this block if your account already has funds in L2
  // Deposit funds to L2
  // const depositHandle = await deployer.zkWallet.deposit({
  //   to: deployer.zkWallet.address,
  //   token: utils.ETH_ADDRESS,
  //   amount: deploymentFee.mul(2),
  // });
  // // Wait until the deposit is processed on zkSync
  // await depositHandle.wait();

  // Deploy this contract. The returned object will be of a `Contract` type, similarly to ones in `ethers`.
  // `greeting` is an argument for contract constructor.
  const parsedFee = ethers.utils.formatEther(deploymentFee.toString());
  console.log(`The deployment is estimated to cost ${parsedFee} ETH`);

  const contract = await deployer.deploy(artifact);

  // Show the contract info.
  const contractAddress = contract.address;
  console.log(`${artifact.contractName} was deployed to ${contractAddress}`);
  return contract;
}

function updateAddressesFile(addresses: { nft: string; marketplace: string }) {
  const addressesFilePath = `./src/config/${hre.network.name}-addresses.json`;
  console.log(`Saving addresses to ${addressesFilePath}`);
  fs.writeFileSync(
    addressesFilePath,
    JSON.stringify(addresses, null, 2) + "\n"
  );
}
