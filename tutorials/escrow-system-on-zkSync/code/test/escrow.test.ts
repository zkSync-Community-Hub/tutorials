import { expect } from "chai";
import { Contract, Wallet } from "zksync-ethers";
import { getWallet, deployContract, LOCAL_RICH_WALLETS } from "../deploy/utils";
import * as ethers from "ethers";

describe("Escrow Contract", () => {
  let escrowContract: Contract;
  let intermediary: Wallet;
  let vendor: Wallet;
  let purchaser: Wallet;

  before(async function () {
    intermediary = getWallet(LOCAL_RICH_WALLETS[0].privateKey);
    vendor = getWallet(LOCAL_RICH_WALLETS[1].privateKey);
    purchaser = getWallet(LOCAL_RICH_WALLETS[2].privateKey);

    escrowContract = await deployContract("Escrow", [], {
      wallet: intermediary,
      silent: true,
    });
  });

  // it('Should create an agreement', async function () {
  //     const title = 'Test Agreement';
  //     const description = 'This is a test agreement';
  //     const amount = ethers.parseEther('1');

  //     await escrowContract.connect(vendor).createAgreement(title, description, amount);
  //     const agreement = await escrow.agreements(1);

  //     expect(agreement.title).to.equal(title);
  //     expect(agreement.description).to.equal(description);
  //     expect(agreement.amount).to.equal(amount);
  //     expect(agreement.vendor).to.equal(await vendor.getAddress());
  //   });
});
