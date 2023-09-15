// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "./Marketplace.sol";

/* 
  StableMarketplace contract should extend MainDemoConsumerBase contract
  For being able to use redstone oracles data, more inf:
  https://docs.redstone.finance/docs/smart-contract-devs/get-started/redstone-core#1-adjust-your-smart-contracts 
*/
contract StableMarketplace is Marketplace {
  /*
    `_getPriceFromOrder` function should uses the `getOracleNumericValueFromTxMsg` function,
    which fetches signed data from tx calldata and verifies its signature
  */ 
  function _getPriceFromOrder(
    SellOrder memory order
  ) internal view override returns (uint256) {
    // TO IMPLEMENT
  }
}
