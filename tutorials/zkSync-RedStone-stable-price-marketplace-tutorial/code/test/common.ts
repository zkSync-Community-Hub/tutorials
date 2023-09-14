import { Deployer } from "@matterlabs/hardhat-zksync-deploy";
import { Contract } from "zksync-web3";

export const DEPLOYER_WALLET_PK =
  "0x7726827caac94a7f9e1b160f7ea819f172f7b6f9d2a97f992c38edeab82d4110";

export const BUYER_RICH_WALLET_PK = 
  "0xac1e735be8536c6534bb4f17f06f6afc73b2b5ba84ac2cfb12f7461b20c0bbe3";

export const SELLER_RICH_WALLET_PK = 
  "0xd293c684d884d56f8d6abd64fc76757d3664904e309a0645baf8522ab6366d9e";

export const deployContract = async (
  deployer: Deployer,
  contractName: string
): Promise<Contract> => {
  const artifact = await deployer.loadArtifact(contractName);
  return await deployer.deploy(artifact);
};
