import Web3 from 'web3'

async function getWeb3 (contractAddress, contractArtifacts) {
  let promise = new Promise((resolve, reject) => {
    window.addEventListener('load', async () => {
      let results;
      let account = null;
      let web3;
      let contract = null;
      window.web3 = new Web3(ethereum);
      try {
        // Request account access if needed
        await ethereum.enable();
        // Acccounts now exposed
        web3 = window.web3;
        await web3.eth.getAccounts().then(accounts => {
          account = accounts[0];
        });
        contract = new web3.eth.Contract(contractArtifacts.abi);
        contract.options.address = contractAddress;
        await contract.setProvider(web3.currentProvider);
        results = {
          web3: web3,
          account: account,
          contract: contract,
        };
        resolve(results);
      } catch (error) {
        // User denied account access...
        reject(Error('User denied account access.'));
      }
    });
  });
  let result = await promise;
  return {
    web3: result.web3,
    account: result.account,
    contract: result.contract,
  };
}

export default getWeb3
