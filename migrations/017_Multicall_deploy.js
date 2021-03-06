const fs = require('fs');

const Multicall = artifacts.require('Multicall');
const MulticallBnbShim = artifacts.require('MulticallBnbShim');

module.exports = async function (deployer, network, accounts) {
  // Load network config data
  const networkConfigFilename = `.env.${network}.json`;
  const networkConfig = JSON.parse(fs.readFileSync(networkConfigFilename));
  let txRegistry = networkConfig.txRegistry;

  await deployer.deploy(Multicall);
  txRegistry.push(Multicall.transactionHash);

  await deployer.deploy(MulticallBnbShim);
  txRegistry.push(MulticallBnbShim.transactionHash);

  networkConfig['txRegistry'] = txRegistry;
  networkConfig['Multicall'] = Multicall.address;
  networkConfig['MulticallBnbShim'] = MulticallBnbShim.address;

  fs.writeFileSync(networkConfigFilename, JSON.stringify(networkConfig, null, 2), { flag: 'w' });

};
