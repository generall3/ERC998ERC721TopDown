import "@typechain/hardhat";
import "@nomiclabs/hardhat-ethers";
import "@nomiclabs/hardhat-waffle";
import "@nomiclabs/hardhat-etherscan";
import { task } from "hardhat/config";
import "hardhat-gas-reporter";
import "solidity-coverage";
import 'dotenv/config';
import "./tasks/index";

const { INFURA_API_KEY, PRIVATE_KEY } = process.env;

task("accounts", "Prints the list of accounts", async (args, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
const config = {
  solidity: {
    version:"0.8.9",
    setting:{
      optimizer: {
        enabled: true,
        runs: 1000000,
      },
    },
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY
  },
  typechain: {
    outDir: 'src/types',
    target: 'ethers-v5',
    alwaysGenerateOverloads: false, 
    externalArtifacts: ['externalArtifacts/*.json'],
  },
  networks: {
    hardhat: {

    },
    rinkeby: {
      url: `https://rinkeby.infura.io/v3/${INFURA_API_KEY}`,
      accounts: [PRIVATE_KEY],
    },
  }
}
export default config;