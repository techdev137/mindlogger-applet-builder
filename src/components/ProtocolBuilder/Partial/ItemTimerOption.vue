<template>
  <v-row>
    <v-col
      :class="colClasses"
      :cols="12"
      :md="3"
      :sm="6"
    >
      <v-checkbox
        v-model="timerOption"
        label="Set Response Timer"
        @change="updateTimerOption"
      />
    </v-col>

    <v-col
      v-if="timerOption"
      :class="colClasses"
      :cols="12"
      :md="3"
      :sm="6"
    >
      <v-text-field
        v-model="timeLimit"
        label="Number of seconds"
        type="number"
        min="1"
        @input="update"
      />
    </v-col>
  </v-row>
</template>

<script>
export default {
  props: {
    colClasses: {
      type: String,
      default: '',
    },
    responseTimeLimit: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      timeLimit: this.responseTimeLimit / 1000,
      timerOption: this.responseTimeLimit ? true: false,
    }
  },
  methods: {
    updateTimerOption() {
      if (this.timerOption) {
        this.timeLimit = 10;
      }

      this.update();
    },

    update() {
      let limit = this.timeLimit;

      if (this.timerOption && (!limit || Number(limit) === 0 )) {
        limit = -1;
      }

      this.$emit('update', {
        responseTimeLimit: Number(this.timerOption ? limit * 1000 : 0)
      });
    }
  }
}
</script>
