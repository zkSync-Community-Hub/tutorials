import { expect } from 'chai';
import { Contract, Wallet } from "zksync-ethers";
import { getWallet, deployContract, LOCAL_RICH_WALLETS } from '../deploy/utils';
import * as ethers from "ethers";

describe('Escrow Contract', ()=>{
    let escrowContract: Contract;
    let intermediary: Wallet;
    let vendor: Wallet;
    let purchaser: Wallet;

    before(async function () {
        intermediary = getWallet(LOCAL_RICH_WALLETS[0].privateKey);
        vendor = getWallet(LOCAL_RICH_WALLETS[1].privateKey);
        purchaser = getWallet(LOCAL_RICH_WALLETS[2].privateKey);
    
        escrowContract = await deployContract("Escrow", [], { wallet: intermediary, silent: true });
    });

    it('Should allow purchaser to register', async function () {
      await (escrowContract.connect(purchaser) as Contract).registerPurchaser();
      expect(await escrowContract.purchaser()).to.equal(purchaser.address);
    });

    it('Should allow vendor to register', async function () {
      await (escrowContract.connect(vendor) as Contract).registerVendor();
      expect(await escrowContract.vendor()).to.equal(vendor.address);
    });

    it('Should create an agreement', async function () {
        const title = 'Test Agreement';
        const description = 'This is a test agreement';
        const amount = ethers.parseEther('1');
    
        await (escrowContract.connect(vendor) as Contract).createAgreement(title, description, amount);
        const agreement = await escrowContract.agreements(1);
    
        expect(agreement.title).to.equal(title);
        expect(agreement.description).to.equal(description);
        expect(agreement.amount).to.equal(amount);
        expect(agreement.vendor).to.equal(await vendor.getAddress());
      });

      it('Should allow purchaser to enter an agreement', async function () {
        await (escrowContract.connect(purchaser)as Contract).enterAgreement(1);
    
        const agreement = await escrowContract.agreements(1);
        expect(agreement.purchaser).to.equal(await purchaser.getAddress());
      });

      
      it('Should allow purchaser to deposit funds', async function () {
        const amount = ethers.parseEther('1');
        await (escrowContract.connect(purchaser) as Contract).depositFunds(1, { value: amount })
        expect(await escrowContract.isFunded()).to.true
      });

      it('Should allow intermediary to release payment', async function () {
        await (escrowContract.connect(intermediary) as Contract).releasePayment(1)
        expect(await escrowContract.isFunded()).to.false
        expect(await escrowContract.isFinished()).to.true
      });

      it('Should not allow refund payment after escrow is finished', async function () {
        try {
            const release = await (escrowContract.connect(intermediary) as Contract).refundPayment(1)
            await release.wait()
            expect.fail('Expected payment to fail but it did not')
        } catch (error) {
            expect(error.message).to.include("Escrow has already been completed");
        }
        
      }) 

})