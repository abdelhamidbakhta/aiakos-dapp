import Web3 from 'web3'

let getWeb3 = new Promise(function (resolve, reject) {
  window.addEventListener('load', async () => {
    let results;
    let account;
    let web3;
    window.web3 = new Web3(ethereum);
    try {
      // Request account access if needed
      await ethereum.enable();
      // Acccounts now exposed
      web3 = window.web3;
      await web3.eth.getAccounts().then(accounts => {
        account = accounts[0];
      });
      results = {
        web3: web3,
        account: account,
      };
      resolve(results);
    } catch (error) {
      // User denied account access...
      console.log('User denied account access.');
    }
  });
});

export default getWeb3
