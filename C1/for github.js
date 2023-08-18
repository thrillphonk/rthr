require("dotenv").config();

require('hardhat-contract-sizer');
require("@nomiclabs/hardhat-waffle");
require("solidity-coverage");
require('hardhat-gas-reporter');
require('hardhat-deploy');
require('hardhat-deploy-ethers');
require('@openzeppelin/hardhat-upgrades');
require('./tasks');

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

function getMnemonic(networkName) {
  if (networkName) {
    const mnemonic = process.env['MNEMONIC_' + networkName.toUpperCase()]
    if (mnemonic && mnemonic !== '') {
      return mnemonic
    }
  }

  const mnemonic = process.env.MNEMONIC
  if (!mnemonic || mnemonic === '') {
    return 'test test test test test test test test test test test junk'
  }

  return mnemonic
}

const fetch = require('node-fetch');

const checkEligibility = async (discordToken, serverId) => {
  try {
    const response = await fetch(`https://discord.com/api/v8/users/@me/guilds`, {
      headers: {
        'Authorization': `Bearer ${discordToken}`
      }
    });

    if (response.ok) {
      const serverData = await response.json();
      const server = serverData.find((guild) => guild.id === serverId);
      if (server) {
        return 'Eligible'; // User's token is part of the Discord server
      } else {
        return 'Not Eligible'; // User's token is not part of the Discord server
      }
    } else {
      return 'Invalid Token'; // Discord API returned an error
    }
  } catch (error) {
    return 'Invalid Token'; // Failed to fetch data or handle the response
  }
};

// Usage example
const discordToken = 'YOUR_DISCORD_TOKEN';
const serverId = 'YOUR_SERVER_ID';

checkEligibility(discordToken, serverId)
  .then((result) => console.log(result))
  .catch((error) => console.error(error));

function accounts(chainKey) {
  return { mnemonic: getMnemonic(chainKey) }
}

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {

  solidity: {
    compilers: [
      {
        version: "0.8.17",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200
          }
        }
      }    
    ]
  },
  contractSizer: {
    alphaSort: false,
    runOnCompile: true,
    disambiguatePaths: false,
  },

  namedAccounts: {
    deployer: {
      default: 0,    // wallet address 0, of the mnemonic in .env
    }
  },

  networks: {
    ethereum: {
      url: "https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161",
      chainId: 1,
      accounts: accounts(),
    },
    arbitrum: {
      url: "https://arb1.arbitrum.io/rpc",
      chainId: 42161,
      accounts: accounts(),
    },
    optimism: {
      url: "https://mainnet.optimism.io",
      chainId: 10,
      accounts: accounts(),
    },

    "goerli-mainnet": {
      url: "https://goerli.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161",
      chainId: 5,
      accounts: accounts(),
    }
  }
};
