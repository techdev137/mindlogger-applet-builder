<template>
  <v-card>
    <v-simple-table>
      <template v-slot:default>
        <thead>
          <tr>
            <th class="text-left" />
            <th 
              v-for="(option) in options"
              :key="option.name"
              class="text-left"
            >
              {{ option.name }}
            </th>
          </tr>
        </thead>

        <tbody>
          <tr
            v-for="(item, i) in items"
            :key="i"
          >
            <td>
              {{ item.name }}
            </td>
            <td
              v-for="(option, j) in options"
              :key="j"
            >
              <v-text-field
                v-model="values[i][j]"
                :type="inputType"
              />
            </td>
          </tr>
        </tbody>
      </template>
    </v-simple-table>

    <v-card-actions class="d-flex justify-space-around">
      <v-btn
        color="primary"
        @click="saveValues"
      >
        Save
      </v-btn>

      <v-btn
        @click="resetValues"
      >
        Reset
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  props: {
    options: {
      type: Array,
      required: true,
    },
    items: {
      type: Array,
      required: true,
    },
    initial: {
      type: Array,
      required: true
    },
    title: {
      type: String,
      required: true,
    },
    inputType: {
      type: String,
      required: false,
      default: 'number'
    }
  },
  data() {
    const values = [];
    for (let i = 0; i < this.items.length; i++) {
      values.push([]);
      for (let j = 0; j < this.options.length; j++) {
        if (i < this.initial.length && j < this.initial[i].length) {
          values[i].push(this.initial[i][j]);
        } else {
          values[i].push(0);
        }
      }
    }

    return {
      values
    }
  },
  methods: {
    saveValues() {
      this.$emit('update', this.values);
    },
    resetValues() {
      for (let i = 0; i < this.items.length; i++) {
        for (let j = 0; j < this.options.length; j++) {
          this.$set(this.values[i], j, (this.inputType == 'number' ? 0 : ''));
        }
      }
    }
  }
}
</script>
