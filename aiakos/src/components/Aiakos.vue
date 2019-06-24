<template>
  <div id="content">
    <div>
      <h1>Aiakos </h1>
      <h3>Release on the blockchain.</h3>
      <h6 v-b-modal.modal-1>
        <v-icon name="cogs" scale="2"/>
      </h6>
      <b-modal id="modal-1" title="Configuration">
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
    </div>
    <div>
      <b-alert
        :show="showAlert"
        dismissible
        :variant="alertVariant"
      >
        {{ this.alertMessage }}
        <p class="mb-0">
          {{ this.alertDetails}}
        </p>
      </b-alert>
    </div>
    <div id="main">
      <b-tabs content-class="mt-3">
        <b-tab title="Owner">
          <p>
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
          </p>
        </b-tab>
        <b-tab title="Maintainer">
          <p>
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
                <b-input-group size="m">
                  <b-form-file
                    v-model="releaseFile"
                    v-on:input="computeReleaseHash"
                    placeholder="Choose a file..."
                    drop-placeholder="Drop file here..."
                  ></b-form-file>
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
                    <b-button @click="releaseFile= null">Reset file</b-button>
                  </b-button-group>
                  <b-button-group size="sm" class="mr-1">
                    <b-button type="submit" variant="primary">Release</b-button>
                  </b-button-group>
                </b-input-group>
              </b-button-toolbar>
            </b-form>
          </p>
        </b-tab>
        <b-tab title="User">
          <p>
            <b-form @submit="checkRelease">
              <b-button-toolbar aria-label="User toolbar">
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
                </b-input-group>
                <b-button-group size="sm" class="mr-1">
                  <b-button v-on:click="getReleaseInfo" variant="success">Info</b-button>
                </b-button-group>
                <b-button-group size="sm" class="mr-1">
                  <b-button type="submit" variant="primary">Check</b-button>
                </b-button-group>
              </b-button-toolbar>
              <br/>

            </b-form>
            <b-table :items="this.items" :busy="this.isBusy" class="mt-3" outlined>
              <div slot="table-busy" class="text-center text-danger my-2">
                <b-spinner class="align-middle"></b-spinner>
                <strong>Loading...</strong>
              </div>
            </b-table>
          </p>
        </b-tab>
      </b-tabs>
    </div>
  </div>
</template>

<script>
  import contractArtifacts from '../assets/contract.json';
  import getWeb3 from '../utils/getWeb3';
  import arrayBufferToWordArray from '../utils/hex'

  const CryptoJS = require("crypto-js");

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
        contractAddress: '0x9c253D6F4A0b9269AEce386936372236BAE10007',
        maintainerAddress: '',
        releaseVersion: '',
        releaseHash: '',
        releaseFile: null,
        accounts: [{
          text: 'Select account address',
          value: null
        }, '0xfd12370ac2210964b92695f08ad7a84516c77eeb',
          '0xa00b1a651e6123d55a59d043c63f720414fd1d08',
          '0xf88858b8246b4c41223354db2caca84109824f86',
          '0x6aac4573eab4adde553ea004b36e0a7594323fef'
        ],
        isBusy: false,
        items: [
          {version: '', hash: '', initialized: false, approved: false},
        ],
        showAlert: false,
        alertVariant: 'info',
        alertMessage: '',
        alertDetails: '',
        options: {
          menu: '#menu',
          anchors: ['page1', 'page2', 'page3'],
          sectionsColor: ['#41b883', '#ff5f45', '#0798ec']
        },
      }
    },
    methods: {
      addMaintainer(evt) {
        let vue = this;
        this.web3Config.contract.methods.addMaintainer(this.maintainerAddress).send({from: this.web3Config.account}, function (error, result) {
          if (error) {
            vue.onError('Add maintainer:', error);
          } else {
            vue.onInfo('Maintainer added.', '');
          }
        });
      },
      isMaintainer(evt) {
        let vue = this;
        this.web3Config.contract.methods.isMaintainer(this.maintainerAddress).call({from: this.web3Config.account}, function (error, result) {
          if (error) {
            vue.onError('Is maintainer:', error);
          } else {
            if (result) {
              vue.onInfo('Given account address is a maintainer', '');
            } else {
              vue.onInfo('Given account address is not a maintainer', '');
            }
          }
        });
      },
      release(evt) {
        let vue = this;
        this.web3Config.contract.methods.deployRelease(this.releaseVersion, this.releaseHash).send({from: this.web3Config.account}, function (error, result) {
          if (error) {
            vue.onError('Release:', error);
          } else {
            vue.onInfo('Release:', 'Approval has been granted to version: ' + vue.releaseVersion);
          }
        });
      },
      getReleaseInfo(evt) {
        this.isBusy = true;
        console.log("getReleaseInfo version: " + this.releaseVersion);
        let vue = this;
        this.web3Config.contract.methods.getReleaseInfo(this.releaseVersion).call({from: this.web3Config.account}, function (error, result) {
          if (error) {
            vue.onError('ReleaseInfo:', error);
          } else {
            let record =
              {
                Version: result[0],
                Hash: result[1],
                Initialized: result[2],
                Approved: result[3],
              };
            vue.items.splice(0, 1, record);
          }
        });
        this.isBusy = false;
      },
      checkRelease(evt) {
        let vue = this;
        this.web3Config.contract.methods.checkRelease(this.releaseVersion, this.releaseHash).send({from: this.web3Config.account}, function (error, result) {
          if (error) {
            vue.onError('Check release:', error);
          } else {
            vue.onInfo('Release ' + vue.releaseVersion + ' has been approved.');
          }
        });
      },
      computeReleaseHash(evt) {
        let vue = this;
        if (vue.releaseFile != null) {
          const reader = new FileReader();
          reader.onload = function (event) {
            const data = event.target.result;
            const hash = CryptoJS.SHA256(arrayBufferToWordArray(data));
            vue.releaseHash = '0x' + hash.toString(CryptoJS.enc.Hex);
          };
          reader.readAsArrayBuffer(vue.releaseFile);
        }
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
      },
      onError(message, details) {
        this.showAlert = true;
        this.alertVariant = 'danger';
        this.alertMessage = message;
        this.alertDetails = details;
      },
      onInfo(message, details) {
        this.showAlert = true;
        this.alertVariant = 'info';
        this.alertMessage = message;
        this.alertDetails = details;
      },
      clearAlert() {
        this.showAlert = false;
        this.alertMessage = '';
        this.alertDetails = '';
      },
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
