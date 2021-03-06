const fs = require('fs');

const RewardPool = artifacts.require('RewardPool');
const ExtraRewardPool = artifacts.require('ExtraRewardPool');

module.exports = async function (deployer, network, accounts) {
  // Load network config data
  const networkConfigFilename = `.env.${network}.json`;
  const networkConfig = JSON.parse(fs.readFileSync(networkConfigFilename));
  
  if (network == 'develop') {
    // environment for tests
    
    // Get addresses
    const wbnbAddress = networkConfig.WBNB;
    const balleAddress = networkConfig.BALLE;
    const treasuryAddress = networkConfig.treasuryAddress;

    // Deploy ExtraRewardPool contract
    await deployer.deploy(ExtraRewardPool, balleAddress);
    // Deploy RewardPool contract
    await deployer.deploy(RewardPool, wbnbAddress, balleAddress, treasuryAddress, ExtraRewardPool.address);

    networkConfig['rewardPoolAddress'] = RewardPool.address;
    networkConfig['extraRewardPoolAddress'] = ExtraRewardPool.address;

  } else {

    let txRegistry = networkConfig.txRegistry;

    // Get addresses
    const wbnbAddress = networkConfig.WBNB;
    const balleAddress = networkConfig.BALLE;
    const treasuryAddress = networkConfig.treasuryAddress;

    // Deploy ExtraRewardPool contract
    await deployer.deploy(ExtraRewardPool, balleAddress);
    txRegistry.push(ExtraRewardPool.transactionHash);

    // Deploy RewardPool contract
    await deployer.deploy(RewardPool, wbnbAddress, balleAddress, treasuryAddress, ExtraRewardPool.address);
    txRegistry.push(RewardPool.transactionHash);

    networkConfig['txRegistry'] = txRegistry;
    networkConfig['rewardPoolAddress'] = RewardPool.address;
    networkConfig['extraRewardPoolAddress'] = ExtraRewardPool.address;

  }

  fs.writeFileSync(networkConfigFilename, JSON.stringify(networkConfig, null, 2), { flag: 'w' });

};
