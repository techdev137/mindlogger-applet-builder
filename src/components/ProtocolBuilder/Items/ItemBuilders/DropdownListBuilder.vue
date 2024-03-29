<template>
  <div>
    <v-form>
      <v-row v-if="colorPalette" class="mt-2 mx-2">
        Color Palette
      </v-row>
      <v-row v-if="colorPalette" class="my-3 mx-2">
        <v-btn fab x-small color="primary" @click="colorPaletteDialog = true">
          <v-icon color="white">mdi-plus</v-icon>
        </v-btn>
      </v-row>
      <v-row class="ma-2">
        Options
        <v-spacer />
      </v-row>

      <div class="option-list">
        <div v-for="(option, index) in options" class="px-2" :key="index">
          <v-row>
            <div
              class="d-flex justify-start align-center option-item pl-2"
              :style="{
                background: colorPalette ? option.color : 'none',
                color: colorPalette ? getTextColor(option.color) : 'black',
              }"
            >
              <input v-if="isMultipleChoice" class="mx-2" type="checkbox" value="false" disabled />

              <input v-else class="mx-2" type="radio" value="false" disabled />
              <span>{{ option.name }}</span>
            </div>

            <v-spacer />

            <div class="d-flex align-center justify-end">
              <v-btn icon @click="option.expanded = !option.expanded">
                <v-icon v-if="!option.expanded">edit</v-icon>
                <v-icon v-if="option.expanded">mdi-chevron-double-up</v-icon>
              </v-btn>
              <v-btn v-if="colorPalette" icon @click="openColorPicker(option)">
                <v-icon>palette</v-icon>
              </v-btn>

              <v-btn icon @click="deleteOption(index)">
                <v-icon>delete</v-icon>
              </v-btn>
            </div>
          </v-row>

          <div v-if="option.expanded" class="px-8">
            <v-row>
              <v-col cols="12" sm="6" md="5">
                <v-text-field
                  v-model="option.name"
                  :rules="textRules"
                  label="Option Text"
                  counter="45"
                  @change="updateOption(option)"
                />
              </v-col>
              <v-col v-if="isTokenValue" cols="12" sm="5" md="4">
                <v-text-field
                  v-model="option.value"
                  :rules="numberRules"
                  type="number"
                  label="Token Value"
                  counter="5"
                  maxlength="5"
                  @change="updateOption(option)"
                />
              </v-col>

              <v-col v-if="hasScoreValue" cols="12" sm="5" md="4">
                <v-text-field
                  v-model="option.score"
                  :rules="numberRules"
                  type="number"
                  label="Score Value"
                  counter="5"
                  maxlength="5"
                  @change="updateOption(option)"
                />
              </v-col>
            </v-row>

            <v-row v-if="hasResponseAlert">
              <v-col class="d-flex align-center" cols="12" sm="12">
                <v-text-field
                  v-model="option.alert"
                  label="Alert Message"
                  :rules="alertTextRules"
                  required
                  @change="updateOption(option)"
                />
              </v-col>
            </v-row>
          </div>
        </div>
      </div>

      <div class="pa-2">
        <v-btn fab x-small color="primary" @click="addOption">
          <v-icon color="white">
            mdi-plus
          </v-icon>
        </v-btn>
      </div>

      <v-divider class="mt-4" />
      <v-row>
        <v-col class="d-flex align-center" cols="12" md="6">
          <v-radio-group v-model="isMultipleChoice" color="primary" row @change="update">
            <v-radio :value="false" label="Single Select" />
            <v-radio :value="true" label="Multiple Select" />
          </v-radio-group>
        </v-col>
      </v-row>
      <v-row>
        <v-col v-if="!isReviewerActivity" class="d-flex align-center" cols="12" md="3" sm="6">
          <v-checkbox v-model="hasScoreValue" label="Option Score" @change="update" />
        </v-col>
        <v-col class="d-flex align-center" cols="12" md="3" sm="6">
          <v-checkbox
            v-model="isSkippable"
            label="Skippable Item"
            :disabled="isSkippableItem == 2 || (isOptionalText && responseOptions.isOptionalTextRequired)"
          />
        </v-col>
      </v-row>
      <OptionalItemText
        colClasses="d-flex align-center py-0 px-3"
        :text="isOptionalText"
        :required="responseOptions.isOptionalTextRequired"
        @text="
          isOptionalText = $event;
          $emit('updateOptionalText', isOptionalText);
        "
        @required="
          responseOptions.isOptionalTextRequired = $event;
          onUpdateResponseOptions();
        "
      />
    </v-form>

    <v-dialog v-model="colorPaletteDialog" persistent max-width="1200px">
      <v-card>
        <v-card-title class="primary white--text">
          <span>Apply a Template</span>
        </v-card-title>
        <v-card-text>
          <v-container class="d-flex justify-center" fluid>
            <v-radio-group v-model="selectedPalette" row>
              <div class="pa-4 d-flex flex-column" v-for="value in Object.keys(colorPalettes)" :key="value">
                <v-radio class="mb-4 ma-auto" :value="value">
                  <template v-slot:label>
                    <div class="text-capitalize">{{ value }}</div>
                  </template>
                </v-radio>
                <v-card @click="selectedPalette = value">
                  <v-card-text>
                    <div>This is what the options would look like:</div>
                    <div class="text--primary mt-4">
                      <div
                        v-for="(optionColor, index) in colorPalettes[value]"
                        class="d-flex justify-center align-center option-color"
                        :style="{ backgroundColor: optionColor }"
                        :key="optionColor"
                      >
                        Option {{ index + 1 }}
                      </div>
                    </div>
                  </v-card-text>
                </v-card>
              </div>
            </v-radio-group>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <small class="d-flex align-center ml-4">
            <v-icon class="mr-1">info</v-icon>
            The patter repeats after the 5th option
          </small>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="colorPaletteDialog = false">
            Close
          </v-btn>
          <v-btn color="blue darken-1" text @click="applyColorPalette">
            Apply
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="colorPickerDialog" persistent max-width="350px">
      <v-card>
        <v-card-title class="primary white--text">
          <span>Set Option Color</span>
        </v-card-title>
        <v-card-text>
          <v-container class="d-flex justify-center" fluid>
            <v-color-picker class="ma-2" v-model="currentOptionColor" show-swatches></v-color-picker>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="colorPickerDialog = false">
            Close
          </v-btn>
          <v-btn color="blue darken-1" text @click="setOptionColor">
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<style lang="scss" scoped>
.mx-template-list {
  position: absolute;
  margin-top: 36px;
  z-index: 1;
}

.option-list {
  width: 65%;
}

.option-item {
  width: 50%;
  height: auto;
  border: 2px solid white;
  border-radius: 5px;
}

.option-color {
  margin: 1px;
  width: 100%;
  height: 40px;
  border: 2px solid white;
  border-radius: 5px;
}

.option-circle {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 2px solid grey;
}

.upload-from-pc {
  position: relative;

  .file-input,
  .file-input:after {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    border-radius: 4px;
    z-index: 1;
    opacity: 0;
  }

  .file-input {
    &:after {
      content: "";
      cursor: pointer;
    }
  }
}

.ds-tooltip-header {
  background: grey;
  color: white;
  padding: 5px 12px;
}

.ds-tooltip-close {
  background: white;
  color: black;
  padding: 5px 12px;
}
</style>

<script>
import OptionalItemText from "../../Partial/OptionalItemText.vue";

export default {
  components: {
    OptionalItemText,
  },
  props: {
    initialItemData: {
      type: Object,
      required: true,
    },
    isSkippableItem: {
      type: Number,
      default: 0,
    },
    initialResponseOptions: {
      type: Object,
      required: true,
    },
    itemTemplates: {
      type: Array,
      default: null,
    },
    hasPrizeActivity: {
      type: Boolean,
      required: false,
      default: false,
    },
    initialIsOptionalText: {
      type: Boolean,
      default: false,
    },
    isReviewerActivity: {
      type: Boolean,
      default: false,
    },
  },
  data: function() {
    const isTokenValue =
      (this.initialResponseOptions.valueType && this.initialResponseOptions.valueType.includes("token")) || false;
    let nextOptionScore = 1;

    if (this.initialItemData.options.length > 0) {
      const lastOption = this.initialItemData.options[this.initialItemData.options.length - 1];

      if (this.initialItemData.hasScoreValue && lastOption.score) {
        nextOptionScore = lastOption.score + 1;
      }
    }

    return {
      options: (this.initialItemData.options || []).map((option) => ({
        name: option.name,
        value: option.value || 0,
        score: option.score || 0,
        image: option.image || "",
        description: option.description || "",
        color: option.color || "",
        alert: option.alert || "",
        expanded: false,
        valid: true,
      })),
      textRules: [
        (v) => !!v || "Dropdown list cannot be empty",
        (v) => v.length <= 75 || "Visibility decreases over 75 characters",
      ],
      numberRules: [(v) => !isNaN(parseInt(v)) || "Please enter a numerical value"],
      alertTextRules: [(v) => !!v || "Alert Text cannot be empty"],
      nextOptionScore,
      items: [],

      isTokenValue,
      colorPalettes: {
        pastel: ["#b5feef", "#68e5a8", "#faf193", "#fabd93", "#f17688"],
        retro: ["#9cc7bd", "#f6f2d4", "#f5bf77", "#f59797", "#988189"],
        grayScale: ["#f2f2f2", "#e0e0e0", "#c6c6c6", "#a6a6a6", "#909090"],
      },
      colorPalette: this.initialItemData.colorPalette || false,
      hasScoreValue: this.initialItemData.hasScoreValue || false,
      hasResponseAlert: this.initialItemData.hasResponseAlert || false,
      enableNegativeTokens: this.initialItemData.enableNegativeTokens || false,
      randomizeOptions: this.initialItemData.randomizeOptions,
      responseOptions: this.initialResponseOptions,
      isOptionalText: this.initialIsOptionalText,
      currentOption: null,
      currentOptionColor: "",
      selectedPalette: null,
      isTooltipOpen: false,
      colorPickerDialog: false,
      colorPaletteDialog: false,
      mode: "hex",
      isMultipleChoice: this.initialItemData.isMultipleChoice || false,
    };
  },

  computed: {
    isSkippable: {
      get() {
        return this.isSkippableItem === 1 || false;
      },
      set(value) {
        this.$emit("updateAllow", value);
      },
    },
  },

  beforeMount() {
    this.items = this.itemTemplates || [];

    if (!this.options.length) {
      this.addOption();
      this.options[0].expanded = true;
    }
  },

  methods: {
    addOption() {
      let currentPalette = "";
      const nextOption = {
        name: `Option ${this.options.length + 1}`,
        value: 0,
        score: 0,
        description: "",
        color: "",
        expanded: false,
        image: "",
        alert: "",
        valid: true,
      };

      Object.keys(this.colorPalettes).forEach((key) => {
        let isPaletteAvaiable = true;
        this.options.forEach((option, index) => {
          if (option.color !== this.colorPalettes[key][index % this.colorPalettes[key].length]) {
            isPaletteAvaiable = false;
          }
        });

        if (this.options.length && isPaletteAvaiable) {
          currentPalette = key;
        }
      });
      if (currentPalette) {
        nextOption.color = this.colorPalettes[currentPalette][this.options.length % 5];
      }

      if (this.hasScoreValue) {
        nextOption.score = this.nextOptionScore;
        this.nextOptionScore++;
      }

      if (!this.isTokenValue) {
        nextOption.value = this.options.length;
      }

      this.options.push(nextOption);

      this.update();
    },

    getTextColor(hex) {
      if (!hex) {
        return "#333333";
      }

      let hexcolor = hex.replace("#", "");
      let r = parseInt(hexcolor.substr(0, 2), 16);
      let g = parseInt(hexcolor.substr(2, 2), 16);
      let b = parseInt(hexcolor.substr(4, 2), 16);
      let yiq = (r * 299 + g * 587 + b * 114) / 1000;
      return yiq >= 128 ? "#333333" : "white";
    },

    openColorPicker(option) {
      this.colorPickerDialog = true;
      this.currentOption = option;
      this.currentOptionColor = option.color || "#ffffff";
    },

    setOptionColor() {
      const optionIndex = this.options.findIndex(({ name }) => name === this.currentOption.name);

      this.currentOption.color = this.currentOptionColor;
      this.options[optionIndex] = this.currentOption;
      this.colorPickerDialog = false;
      this.update();
    },

    applyColorPalette() {
      this.colorPaletteDialog = false;
      this.options.forEach((option, index) => {
        option.color = this.colorPalettes[this.selectedPalette][index % 5];
      });
      this.update();
    },

    deleteOption(index) {
      let currentPalette = "";

      Object.keys(this.colorPalettes).forEach((key) => {
        let isPaletteAvaiable = true;
        this.options.forEach((option, index) => {
          if (option.color !== this.colorPalettes[key][index % this.colorPalettes[key].length]) {
            isPaletteAvaiable = false;
          }
        });

        if (this.options.length && isPaletteAvaiable) {
          currentPalette = key;
        }
      });

      this.options.splice(index, 1);
      if (currentPalette) {
        this.options.forEach((option, index) => {
          option.color = this.colorPalettes[this.selectedPalette][index % 5];
        });
      }
      this.update();
    },
    update() {
      const responseOptions = {
        hasScoreValue: this.hasScoreValue,
        hasResponseAlert: this.hasResponseAlert,
        isTokenValue: this.isTokenValue,
        enableNegativeTokens: this.enableNegativeTokens,
        isMultipleChoice: this.isMultipleChoice,
        isSkippableItem: this.isSkippable,
        colorPalette: this.colorPalette,
        randomizeOptions: this.randomizeOptions,
        valueType: this.isTokenValue ? "xsd:token" : "xsd:anyURI",
        options: this.options.map((option) => ({
          ...option,
          value: Number(option.value),
          score: Number(option.score),
        })),
      };
      this.$emit("updateOptions", responseOptions);
    },

    updateOption(option) {
      option.valid = this.isValidOption(option);

      this.update();
    },

    isValidOption(option) {
      if (option.name.length == 0) {
        return false;
      }
      if ((this.isTokenValue && isNaN(option.value)) || (this.hasScoreValue && isNaN(option.score))) {
        return false;
      }

      return true;
    },

    onUpdateResponseOptions() {
      if (this.responseOptions.isOptionalTextRequired) this.$emit("updateAllow", false);
      this.$emit("updateResponseOptions", this.responseOptions);
    },
  },
};
</script>
