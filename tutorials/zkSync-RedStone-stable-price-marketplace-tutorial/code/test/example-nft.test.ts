import { Contract, Provider, Wallet } from "zksync-web3";
import { Deployer } from "@matterlabs/hardhat-zksync-deploy";
import * as hre from "hardhat";
import { expect } from "chai";
import { SELLER_RICH_WALLET_PK, BUYER_RICH_WALLET_PK, deployContract } from "./common";

describe("ExampleNFT", function () {
  let exampleNFTContract: Contract;
  let owner: Wallet;

  it("Should deploy ExampleNFT", async function () {
    const provider = Provider.getDefaultProvider();
    const wallet = new Wallet(SELLER_RICH_WALLET_PK, provider);
    const deployer = new Deployer(hre, wallet);
    exampleNFTContract = await deployContract(deployer, "ExampleNFT");
    owner = new Wallet(SELLER_RICH_WALLET_PK, provider);
  });

  it("Should mint 2 NFTs", async function () {
    // Mint first NFT
    const mintTx1 = await exampleNFTContract.mint();
    await mintTx1.wait();

    // Mint second NFT
    const mintTx2 = await exampleNFTContract.mint();
    await mintTx2.wait();

    // Verify NFT ownership
    const ownerAddress = await owner.getAddress();
    expect(await exampleNFTContract.ownerOf(1)).to.equal(ownerAddress);
    expect(await exampleNFTContract.ownerOf(2)).to.equal(ownerAddress);
  });

  it("User1 should approve spending and User2 should spend", async function () {
    // User1 approves
    const provider = Provider.getDefaultProvider();
    const user1 = owner;
    const user1Address = await user1.getAddress();
    const user2 = new Wallet(BUYER_RICH_WALLET_PK, provider);
    const user2Address = await user2.getAddress();
    const tokenId = 1;
    const approveTx = await exampleNFTContract.approve(
      user2Address,
      tokenId,
    );
    await approveTx.wait();

    // User2 transfers
    const transferTx = await exampleNFTContract.transferFrom(
      user1Address,
      user2Address,
      tokenId,
    );
    await transferTx.wait();

    // Checking ownership
    const newOwner = await exampleNFTContract.ownerOf(tokenId);
    expect(newOwner).to.equal(user2Address);
  });
});
