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
        <b-button-toolbar aria-label="Owner toolbar">
          <b-input-group size="m" prepend="maintainer">
            <b-form-select
              id="input-maintainer-address"
              v-model="maintainerAddress"
              :options="accounts"
              required
            ></b-form-select>
            <b-button-group size="sm" class="mr-1">
              <b-button type="submit" variant="primary">Add maintainer</b-button>
            </b-button-group>
            <b-button-group size="sm" class="mr-1">
              <b-button v-on:click="isMaintainer" variant="success">Is maintainer</b-button>
            </b-button-group>
            <b-button-group size="sm" class="mr-1">
              <b-button type="reset" variant="danger">Reset</b-button>
            </b-button-group>
          </b-input-group>
        </b-button-toolbar>
      </b-form>
    </b-card>
    <b-card class="mt-3" header="Maintainer" v-if="showMaintainerPanel">
      <b-form @submit="release">
        <b-button-toolbar aria-label="Release toolbar">
          <b-input-group size="m" prepend="version">
            <b-form-input
              id="input-release-version"
              v-model="releaseVersion"
              required
              placeholder="Version string. (1.0.0)"
            ></b-form-input>
          </b-input-group>
          <b-input-group size="m" prepend="hash">
            <b-form-input
              id="input-release-hash"
              v-model="releaseHash"
              class="text-right"
              required
              placeholder="SHA-256 Hash"
            ></b-form-input>
            <b-button-group size="sm" class="mr-1">
              <b-button v-on:click="randomHash">Random</b-button>
            </b-button-group>
            <b-button-group size="sm" class="mr-1">
              <b-button type="submit" variant="primary">Release</b-button>
            </b-button-group>
          </b-input-group>
        </b-button-toolbar>
      </b-form>
    </b-card>
  </div>
</template>

<script>
  import contractArtifacts from '../assets/contract.json';
  import getWeb3 from '../utils/getWeb3';

  export default {
    name: 'Aiakos',
    created() {
      console.log('Initializing Aiakos vue blockchain configuration.');
      getWeb3(this.contractAddress, contractArtifacts).then(value => {
        this.web3Config = value;
      });
    },
    data() {
      return {
        web3Config: null,
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
        console.log(">> addMaintainer: " + this.maintainerAddress);
        this.web3Config.contract.methods.addMaintainer(this.maintainerAddress).send({from: this.web3Config.account}, function (error, result) {
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
        this.web3Config.contract.methods.isMaintainer(this.maintainerAddress).call();
      },
      release(evt) {
        console.log("release version: " + this.releaseVersion);
        this.web3Config.contract.methods.deployRelease(this.releaseVersion, this.releaseHash).send({from: this.web3Config.account}, function (error, result) {
          if (error) {
            console.log("release error.");
            console.log(error);
          } else {
            console.log("release success.");
          }
        });
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
