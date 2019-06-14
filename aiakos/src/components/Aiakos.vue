<template>
  <div id="app-owner">
    <h1>{{ title }}</h1>
    <b-card class="mt-3" header="Owner"  v-if="showOwnerPanel">
      <b-form @submit="addMaintainer" @reset="onOwnerPanelReset">
        <b-form-group
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
        </b-form-group>
        <b-button type="submit" variant="primary">Add maintainer</b-button>
        <b-button type="reset" variant="danger">Reset</b-button>
      </b-form>
    </b-card>
    <b-card class="mt-3" header="Maintainer" v-if="showMaintainerPanel">
      <b-form @submit="release" >
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
        <b-button type="submit" variant="primary">Release</b-button>
      </b-form>
    </b-card>
  </div>
</template>

<script>
  export default {
    name: 'Aiakos',
    data() {
      return {
        title: 'Aiakos: Release on the blockchain.',
        maintainerAddress: '',
        releaseVersion: '',
        form: {
          email: ''
        },
        showOwnerPanel: true,
        showMaintainerPanel: true
      }
    },
    methods: {
      addMaintainer(evt) {
        console.log("addMaintainer: " + this.maintainerAddress);
      },
      release(evt) {
        console.log("release version: " + this.releaseVersion);
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
