<template>
  <div>
    <v-card>
      <v-card-title
        class="headline grey lighten-2"
        primary-title
      >
        Change History
      </v-card-title>
      <v-card-text class="treeview">
        <v-select
          v-model="selectedVersion"
          :items="allVersions"
          label="Versions"
          @change="change"
        />

        <v-treeview
          v-if="history.length"
          :items="history"
          :color="accent"
          activatable
          hoverable
        />
        <div v-else>
          No Changes
        </div>
      </v-card-text>
    </v-card>
  </div>
</template>

<style scoped>
.treeview {
  max-height: 450px;
  overflow: auto;
}
</style>

<script>
export default {
  props: {
    history: {
      type: Array,
      required: true,
      default: null,
    },
    versions: {
      type: Array,
      required: false,
      default: null
    },
    currentVersion: {
      type: String,
      required: false,
      default: null
    },
    defaultVersion: {
      type: String,
      required: false,
      default: ''
    }
  },
  data: function () {
    return {
      selectedVersion: this.defaultVersion || `current (${ this.currentVersion})`
    };
  },
  computed: {
    allVersions: function () {
      return [
        `current (${this.currentVersion})`,
        ...this.versions.slice(0, -1)
      ]
    }
  },
  methods: {
    change($ev) {
      this.$emit('updateHistoryView', this.selectedVersion);
    }
  }
};
</script>
