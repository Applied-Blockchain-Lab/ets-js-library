require("@nomicfoundation/hardhat-toolbox");
// require("solidity-docgen");

const AVALANCHE_TESTNET = "https://api.avax-test.network/ext/bc/C/rpc";

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.17",
    settings: {
      optimizer: {
        enabled: false,
        runs: 200,
      },
    },
  },
  networks: {
    hardhat: {
      chainId: 1337, // We set 1337 to make interacting with MetaMask simpler
    },
  },
  docgen: {
    pages: "files",
  },
  mocha: {
    timeout: 100000,
  },
};
