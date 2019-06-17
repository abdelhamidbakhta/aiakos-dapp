<template>
  <div id="app-owner">
    <h1>{{ title }}</h1>
    <b-button v-b-modal.modal-1>Settings</b-button>
    <b-modal id="modal-1" title="BootstrapVue">
      <p class="my-4">Aiakos configuration</p>
      <b-form-group
        id="input-contract-address"
        label="Contract address:"
        label-for="input-contract-address"
        description="Address of the contract."
      >
        <b-form-input
          id="input-contract-address"
          v-model="contractAddress"
          required
        ></b-form-input>
      </b-form-group>
    </b-modal>
    <b-card class="mt-3" header="Owner" v-if="showOwnerPanel">
      <b-form @submit="addMaintainer" @reset="onOwnerPanelReset">
        <!--b-form-group
          id="input-group-maintainer-address"
          label="Maintainer address:"
          label-for="input-maintainer-address"
          description="Address of the maintainer."
        >
          <b-form-input
            id="input-maintainer-address"
            v-model="maintainerAddress"
            required
            placeholder="Enter maintainer address (prefixed by 0x)"
          ></b-form-input>
        </b-form-group-->
        <b-form-group id="input-group-maintainer-address" label="Maintainer:" label-for="input-maintainer-address">
          <b-form-select
            id="input-maintainer-address"
            v-model="maintainerAddress"
            :options="accounts"
            required
          ></b-form-select>
        </b-form-group>
        <b-button type="submit" variant="primary">Add maintainer</b-button>
        <b-button v-on:click="isMaintainer" variant="success">Is maintainer</b-button>
        <b-button type="reset" variant="danger">Reset</b-button>
      </b-form>
    </b-card>
    <b-card class="mt-3" header="Maintainer" v-if="showMaintainerPanel">
      <b-form @submit="release">
        <b-form-group
          id="input-group-release-version"
          label="Release version:"
          label-for="input-release-version"
          description="Version of the release."
        >
          <b-form-input
            id="input-release-version"
            v-model="releaseVersion"
            required
            placeholder="Version string. (1.0.0)"
          ></b-form-input>
        </b-form-group>
        <b-form-group
          id="input-group-release-hash"
          label="Release hash:"
          label-for="input-release-hash"
          description="Hash of the release."
        >
          <b-form-input
            id="input-release-hash"
            v-model="releaseHash"
            required
            placeholder="SHA-256 Hash"
          ></b-form-input>
        </b-form-group>
        <b-button v-on:click="randomHash" type="Random">Random</b-button>
        <b-button type="submit" variant="primary">Release</b-button>
      </b-form>
    </b-card>
  </div>
</template>

<script>
  import contractArtifacts from '../assets/contract.json';
  import getWeb3 from '../utils/getWeb3';

  let web3;
  let account;
  getWeb3.then(results => {
    web3 = results.web3;
    account = results.account;
  });

  export default {
    name: 'Aiakos',
    /*beforeCreate() {
      console.log('Initializing Aiakos vue.');
    },*/
    data() {
      return {
        web3: null,
        account: null,
        title: 'Aiakos: Release on the blockchain.',
        contractAddress: '0x9c253D6F4A0b9269AEce386936372236BAE10007',
        maintainerAddress: '',
        releaseVersion: '',
        releaseHash: '',
        accounts: [{
          text: 'Select account address',
          value: null
        }, '0xfd12370ac2210964b92695f08ad7a84516c77eeb',
          '0xa00b1a651e6123d55a59d043c63f720414fd1d08',
          '0xf88858b8246b4c41223354db2caca84109824f86',
          '0x6aac4573eab4adde553ea004b36e0a7594323fef'
        ],
        showOwnerPanel: true,
        showMaintainerPanel: true
      }
    },
    methods: {
      addMaintainer(evt) {
        console.log("addMaintainer: " + this.maintainerAddress);
        let contract = new web3.eth.Contract(contractArtifacts.abi);
        contract.options.address = this.contractAddress;
        contract.setProvider(web3.currentProvider);
        contract.methods.addMaintainer(this.maintainerAddress).send({from: account}, function (error, result) {
          if (error) {
            console.log("addMaintainer error.");
            console.log(error);
          } else {
            console.log("addMaintainer success.");
          }
        });
      },
      isMaintainer(evt) {
        console.log("isMaintainer: " + this.maintainerAddress);
        let contract = new web3.eth.Contract(contractArtifacts.abi);
        contract.options.address = this.contractAddress;
        contract.setProvider(web3.currentProvider);
        contract.methods.isMaintainer(this.maintainerAddress).call();
      },
      release(evt) {
        console.log("release version: " + this.releaseVersion);
      },
      randomHash(evt) {
        this.releaseHash = web3.utils.randomHex(32);
      },
      onOwnerPanelReset(evt) {
        evt.preventDefault();
        // Reset our form values
        this.maintainerAddress = '';
        // Trick to reset/clear native browser form validation state
        this.showOwnerPanel = false;
        this.$nextTick(() => {
          this.showOwnerPanel = true
        })
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  h1, h2 {
    font-weight: normal;
  }

  ul {
    list-style-type: none;
    padding: 0;
  }

  li {
    display: inline-block;
    margin: 0 10px;
  }

  a {
    color: #42b983;
  }
</style>
