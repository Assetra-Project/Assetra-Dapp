require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

module.exports = {
  solidity: "0.8.20",
  defaultNetwork: "hedera",
  networks: {
    hedera: {
      url: "https://testnet.hashio.io/api", // Hedera Testnet JSON-RPC endpoint
      accounts: [process.env.PRIVATE_KEY],
    },
  },
};
