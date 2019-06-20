# Aiakos web dApp

## Quickstart

Assuming the following file tree structure:

|— aiakos

 		|— aiakos-dapp

​		 |— awakes-contracts

```bash
# working directory: aiakos
# Deploy ganache
ganache-cli --host "0.0.0.0" --accounts 4 --deterministic -v \
--mnemonic "unfold bachelor enact fiber later donate uncover once torch figure engine keep"
# Build and deploy Aiakos smart contracts
git clone https://github.com/PegaSysEng/aiakos-contracts
cd aiakos-contracts
truffle compile
truffle migrate --reset -network=development
cd ..
# Build and deploy Aiakos the web application
cd aiakos-dapp/aiakos
npm install
npm run dev


```

