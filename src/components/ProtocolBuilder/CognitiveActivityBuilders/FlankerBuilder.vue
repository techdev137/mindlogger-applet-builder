<template>
  <v-card
    class="pa-4"
  >
    <div class="mt-4">
      <v-btn class="mx-2" @click="onUploadStimulusScreen"
             :style="[!isStimulusValid && {'background': 'red', 'color': 'white'}]"
      >
        {{ stimulusScreens.length ? 'Edit' : 'Upload' }} Stimulus Screens
      </v-btn>

      <v-btn class="mx-2" @click="onUploadFixationScreen">
        {{ fixationScreen.name ? 'Edit' : 'Upload' }} Fixation Screen
      </v-btn>
    </div>

    <div class="my-2 d-flex align-center">
      <div class="label">
        Threshold to progress to Test Phase:
      </div>

      <div class="mx-4">
        &#x2265;
        <v-text-field
          :value="threshold"
          class="mx-2 inline-element threshold"
          type="number"
          @input="thresholdChange"
        />
        %
      </div>
      <p
          class="markdown-error ml-4"
          v-if="!threshold"
      >
        *Please enter positive value
      </p>
    </div>

    <div class="d-flex align-center">
      <div class="label">
        Number of buttons available to user:
      </div>
      <v-radio-group v-model="buttonCount" class="mx-4 mt-2" hide-details>
        <div class="d-flex align-center">
          <v-radio label="1 button" :value="1" />
          <v-radio class="mb-2 mx-4" label="2 buttons" :value="2" />
        </div>
      </v-radio-group>
    </div>

    <div>
      <div class="d-flex align-center">
        <div
          v-if="buttonCount > 1"
          class="label"
        >
          Left Button Name:
        </div>

        <div
          v-else
          class="label"
        >
          Button Name:
        </div>

        <v-text-field
          class="button-name ml-2 mt-4"
          v-model="buttons[0].name"
          :error-messages="buttons[0].name.length > 5 ? 'visibility decrease over 5 characters' : ''"
        />
        <Uploader
          :initialType="'image'"
          :initialAdditionalType="'small-circle'"
          :initialData="buttons[0].image"
          :aspectRatio="2.5"
          @onAddFromUrl="onAddImageFromUrl($event, 0)"
          @onAddFromDevice="onAddImageFromDevice($event, 0)"
          @onRemove="onRemoveImage(0)"
          @onNotify="onEventNotify($event)"
        />
        <p
          class="markdown-error ml-4"
          v-if="!buttons[0].name && !buttons[0].image"
        >
          *This is a required field
        </p>
      </div>

      <div v-if="buttonCount==2" class="d-flex align-center">
        <div class="label">
          Right Button Name:
        </div>

        <v-text-field
          class="button-name ml-2 mt-4"
          v-model="buttons[1].name"
          :error-messages="buttons[1].name.length > 5 ? 'visibility decrease over 5 characters' : ''"
        />
        <Uploader
          :initialType="'image'"
          :initialAdditionalType="'small-circle'"
          :initialData="buttons[1].image"
          :aspectRatio="2.5"
          @onAddFromUrl="onAddImageFromUrl($event, 1)"
          @onAddFromDevice="onAddImageFromDevice($event, 1)"
          @onRemove="onRemoveImage(1)"
          @onNotify="onEventNotify($event)"
        />
        <p
          class="markdown-error ml-4"
          v-if="!buttons[1].name && !buttons[1].image"
        >
          *This is a required field
        </p>
      </div>
    </div>

    <div class="d-flex align-center my-6">
      <div class="label">
        Set Overview Instructions:
      </div>

      <v-btn class="mx-4" fab x-small @click="openMarkdownDialog('overview', 'Set Overview Instructions')">
        <v-icon>mdi-pencil</v-icon>
      </v-btn>
    </div>

    <div class="section">
      <div class="section-title">
        Practice
      </div>

      <div class="d-flex my-4">
        <div class="block-1 mx-4">
          <v-btn
            class="upload-blocks"
            :color="blocksPractice.length ? 'white' : 'red'"
            :dark="blocksPractice.length ? false : true"
            @click="onUploadBlockSequence('practice')"
            :disabled="stimulusScreens.length <= 0"
          >
            {{ blocksPractice.length ? 'Edit' : 'Upload' }} Block Sequences
          </v-btn>
        </div>

        <div class="block-2 mx-4">
          <div class="d-flex align-center my-4">
            <div class="label">
              Update Instructions:
            </div>
            <v-btn fab x-small @click="openMarkdownDialog('practice', 'Set Practice Instructions')">
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
          </div>

          <div class="d-flex align-center my-4">
            <div class="label">
              Randomize order of screens within a block:
            </div>
            <v-checkbox
              class="my-0 mx-2"
              hide-details
              v-model="randomizeOrderPractice"
            />
          </div>
        </div>

        <div class="block-3 mx-4">
          <div class="d-flex align-center my-4">
            <div class="label">
              Show feedback for each stimulus screen:
            </div>
            <v-checkbox
              v-model="showFeedbackPractice"
              class="my-0 mx-2"
              hide-details
            />
          </div>

          <div class="d-flex align-center my-4">
            <div class="label">
              Show summary screen:
            </div>
            <v-checkbox
              v-model="showSummaryPractice"
              class="my-0 mx-2"
              hide-details
            />
          </div>
        </div>
      </div>
    </div>

    <div class="section">
      <div class="section-title">
        Test
      </div>

      <div class="d-flex my-4">
        <div class="block-1 mx-4">
          <v-btn
            class="upload-blocks"
            :color="blocksTest.length ? 'white' : 'red'"
            :dark="blocksTest.length ? false : true"
            @click="onUploadBlockSequence('test')"
            :disabled="stimulusScreens.length <= 0"
          >
            {{ blocksTest.length ? 'Edit' : 'Upload' }} Block Sequences
          </v-btn>
        </div>

        <div class="block-2 mx-4">
          <div class="d-flex align-center my-4">
            <div class="label">
              Update Instructions:
            </div>
            <v-btn fab x-small @click="openMarkdownDialog('test', 'Set Test Instructions')">
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
          </div>

          <div class="d-flex align-center my-4">
            <div class="label">
              Randomize order of screens within a block:
            </div>
            <v-checkbox
              class="my-0 mx-2"
              hide-details
              v-model="randomizeOrderTest"
            />
          </div>
        </div>

        <div class="block-3 mx-4">
          <div class="d-flex align-center my-4">
            <div class="label">
              Show feedback for each stimulus screen:
            </div>
            <v-checkbox
              v-model="showFeedbackTest"
              class="my-0 mx-2"
              hide-details
            />
          </div>

          <div class="d-flex align-center my-4">
            <div class="label">
              Show summary screen:
            </div>
            <v-checkbox
              v-model="showSummaryTest"
              class="my-0 mx-2"
              hide-details
            />
          </div>
        </div>
      </div>
    </div>

    <v-dialog
      v-model="markdownDialog"
      persistent
      max-width="800px"
    >
      <v-card>
        <v-card-title class="title">
          {{ dialogTitle }}
        </v-card-title>

        <v-card-text class="mt-2">
          <MarkDownEditor
            class="markdown-editor"
            v-model="markdown"
          />
        <p class="mt-2 markdown-error" v-if="!markdown">
          * This is a required field
        </p>
        </v-card-text>

        <v-card-actions>
          <v-spacer />
          <v-btn
            :disabled="!markdown"
            @click="onSaveInstructions"
          >
            OK
          </v-btn>

          <v-btn
            @click="markdownDialog=false"
          >
            Cancel
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <Notify :notify="notify" />
    <Loading :loading="loading" />

    <StimulusScreenUploader
      v-model="stimulusScreenDialog.visible"
      :key="`stimulus-${stimulusScreenDialog.key}`"
      :screens="stimulusScreens"
      :button-count="buttonCount"
      :stimulus-duration-practice="stimulusDurationPractice"
      :stimulus-duration-test="stimulusDurationTest"
      :active-screens="activeScreens"
      @save="saveStimulusScreens"
    />

    <FixationScreenUploader
      v-model="fixationScreenDialog.visible"
      :key="`fixation-${fixationScreenDialog.key}`"
      :screen="fixationScreen"
      :fixation-duration="fixationDuration"
      @save="saveFixationScreen"
    />

    <BlockSequenceUploader
      v-model="blockSequenceDialog.visible"
      :key="`blocks-${blockSequenceDialog.key}`"
      :screens="stimulusScreens"
      :initial-blocks="blockSequenceDialog.type == 'practice' ? blocksPractice : blocksTest"
      @save="saveBlockSequence"
    />
  </v-card>
</template>

<style scoped>
.markdown-editor /deep/ .v-note-panel {
  max-height: 400px;
  overflow: auto;
}

.label {
  width: 280px;
  text-align: right;
}

.inline-element {
  display: inline-block;
}

.text-right {
  text-align: right;
}

.threshold {
  max-width: 50px;
}

.markdown-error {
  color: red;
  margin-bottom: 0;
  font-size: 13px;
}

.button-name {
  margin-top: 0px;
  padding-top: 0px;
  max-width: 100px;
}

.section {
  margin: 16px 0px;
}
.section-title {
  text-align: center;
  border: 1px solid;
  border-radius: 5px;
  padding: 2px;
}

.upload-blocks {
  width: 200px;
}

.upload-blocks /deep/ .v-btn__content {
  width: 100%;
  white-space: break-spaces;
  text-align: center;
  font-size: 12px;
}

.block-1 {
  align-self: center;
}
.block-2 .label {
  width: 200px;
  text-align: center;
}

.block-3 .label {
  width: 320px;
}
</style>

<script>
import Uploader from '../Uploader.vue';
import { mapGetters, mapMutations } from 'vuex';
import config from '../../../config';
import MarkDownEditor from '../MarkDownEditor';
import StimulusScreenUploader from './FlankerComponents/StimulusScreenUploader';
import FixationScreenUploader from './FlankerComponents/FixationScreenUploader';
import BlockSequenceUploader from './FlankerComponents/BlockSequenceUploader';
import Notify from '../Additional/Notify.vue';
import Loading from '../Additional/Loading.vue';

export default {
  components: {
    Uploader,
    MarkDownEditor,
    Notify,
    Loading,
    StimulusScreenUploader,
    FixationScreenUploader,
    BlockSequenceUploader,
  },

  data() {
    return {
      buttons: [
        { name: '', value: 0, image: '' },
        { name: '', value: 1, image: '' }
      ],

      markdown: '',
      dialogTitle: '',
      markdownDialog: false,
      dataType: '',

      notify: {},
      loading: false,

      practiceScreens: [2, 4, 6],
      testScreens: [8, 10, 12],

      stimulusScreenDialog: {
        visible: false,
        key: 0
      },
      fixationScreenDialog: {
        visible: false,
        key: 0
      },
      blockSequenceDialog: {
        type: 'practice',
        key: 0,
        visible: false
      },
    }
  },

  computed: {
    config () {
      return config;
    },
    ...mapGetters(config.MODULE_NAME,
      [
        'currentActivity',
      ]
    ),

    items () {
      return this.currentActivity.items;
    },

    isStimulusValid(){
      return this.stimulusScreens.length > 0 && this.stimulusDurationPractice >= 1 && this.stimulusDurationPractice % 1 == 0 &&
      this.stimulusDurationTest >= 1 && this.stimulusDurationTest % 1 == 0;
    },

    isFixationValid(){
      return this.fixationDuration >= 1 && this.fixationDuration % 1 == 0 || this.fixationScreen === null || !this.fixationScreen.name;
    },

    isActivityValid(){
      return this.isStimulusValid && this.isFixationValid && (this.buttons[0].name != '') && (this.buttons[1].name != '' || this.buttonCount == 1) && !(!this.threshold)
    },

    threshold() {
      const option = this.getInputOption('minimumAccuracy');
      return option['schema:value'];
    },

    buttonCount: {
      get () {
        const option = this.getInputOption('buttons');
        return option['schema:itemListElement'].length;
      },
      set (value) {
        if (value == 2) {
          this.buttons[1].name = '>';
          this.buttons[1].image = '';
        }

        this.saveButtons(value);

        if (value == 1) {
          this.stimulusScreens = this.stimulusScreens.map(screen => ({
            ...screen,
            value: 0
          }))
        }
      }
    },

    showFeedbackTest: {
      get () {
        const option = this.getInputOption('showFeedback', this.testScreens[0]);
        return option['schema:value'];
      },
      set (value) {
        for (const index of this.testScreens) {
          this.updateInputOption('showFeedback', {
            'schema:name': 'showFeedback',
            'schema:value': value,
            '@type': 'schema:Boolean',
          }, index);
        }
      }
    },

    showSummaryTest: {
      get () {
        const option = this.getInputOption('showResults', this.testScreens[0]);
        return option['schema:value'];
      },
      set (value) {
        for (const index of this.testScreens) {
          this.updateInputOption('showResults', {
            'schema:name': 'showResults',
            'schema:value': value,
            '@type': 'schema:Boolean',
          }, index);
        }
      }
    },

    showFeedbackPractice: {
      get () {
        const option = this.getInputOption('showFeedback', this.practiceScreens[0]);
        return option['schema:value'];
      },
      set (value) {
        for (const index of this.practiceScreens) {
          this.updateInputOption('showFeedback', {
            'schema:name': 'showFeedback',
            'schema:value': value,
            '@type': 'schema:Boolean',
          }, index); // index for practice screen
        }
      }
    },

    showSummaryPractice: {
      get () {
        const option = this.getInputOption('showResults', this.practiceScreens[0]);
        return option['schema:value'];
      },
      set (value) {
        for (const index of this.practiceScreens) {
          this.updateInputOption('showResults', {
            'schema:name': 'showResults',
            'schema:value': value,
            '@type': 'schema:Boolean',
          }, index);
        }
      }
    },

    randomizeOrderPractice: {
      get () {
        const option = this.getInputOption('samplingMethod', this.practiceScreens[0]);
        return option['schema:value'] == 'randomize-order';
      },
      set (value) {
        for (const index of this.practiceScreens) {
          this.updateInputOption('samplingMethod', {
            'schema:name': 'samplingMethod',
            'schema:value': value ? 'randomize-order' : 'fixed-order',
            '@type': 'schema:Text'
          }, index)
        }
      }
    },

    randomizeOrderTest: {
      get () {
        const option = this.getInputOption('samplingMethod', this.testScreens[0]);
        return option['schema:value'] == 'randomize-order';
      },
      set (value) {
        for (const index of this.testScreens) {
          this.updateInputOption('samplingMethod', {
            'schema:name': 'samplingMethod',
            'schema:value': value ? 'randomize-order' : 'fixed-order',
            '@type': 'schema:Text'
          }, index)
        }
      }
    },

    stimulusDurationPractice: {
      get () {
        const option = this.getInputOption('trialDuration', this.practiceScreens[0]);
        return option['schema:value'];
      },
      set (value) {
        for (const index of this.practiceScreens) {
          this.updateInputOption('trialDuration', {
            'schema:name': 'trialDuration',
            'schema:value': value,
            '@type': 'schema:Number'
          }, index)
        }
      }
    },

    stimulusDurationTest: {
      get () {
        const option = this.getInputOption('trialDuration', this.testScreens[0]);
        return option['schema:value'];
      },
      set (value) {
        for (const index of this.testScreens) {
          this.updateInputOption('trialDuration', {
            'schema:name': 'trialDuration',
            'schema:value': value,
            '@type': 'schema:Number'
          }, index)
        }
      }
    },

    fixationDuration: {
      get () {
        const option = this.getInputOption('fixationDuration', this.practiceScreens[0]);
        return option['schema:value'];
      },
      set (value) {
        this.updateInputOption('fixationDuration', {
          'schema:name': 'fixationDuration',
          'schema:value': value,
          '@type': 'schema:Number'
        })
      }
    },

    stimulusScreens: {
      get () {
        const option = this.getInputOption('trials', this.practiceScreens[0]);
        return option['schema:itemListElement'].map(item => ({
          id: item['@id'],
          name: item['schema:name'],
          image: item['schema:image'],
          value: item['schema:value']
        }));
      },

      set (trials) {
        this.updateInputOption('trials', {
          "@type": "schema:ItemList",
          "schema:name": "trials",
          "schema:numberOfItems": trials.length,
          'schema:itemListElement': trials.map(trial => ({
            "@id": trial.id,
            "@type": "schema:Property",
            "schema:name": trial.name,
            "schema:image": trial.image,
            "schema:value": trial.value
          }))
        })
      }
    },

    fixationScreen: {
      get () {
        const option = this.getInputOption('fixationScreen', this.practiceScreens[0]);
        return {
          name: option['schema:value'],
          image: option['schema:image']
        }
      },

      set (screen) {
        this.updateInputOption('fixationScreen', {
          "@type": "schema:Text",
          "schema:name": "fixationScreen",
          "schema:value": screen.name,
          "schema:image": screen.image
        })
      }
    },

    blocksPractice: {
      get () {
        return this.getBlocks(this.practiceScreens[0]);
      },
      set (blocks) {
        this.setBlocks(blocks, this.practiceScreens)
      }
    },

    blocksTest: {
      get () {
        return this.getBlocks(this.testScreens[0]);
      },
      set (blocks) {
        this.setBlocks(blocks, this.testScreens);
      }
    },

    activeScreens () {
      const allBlocks = [...this.blocksPractice, ...this.blocksTest];
      const activeScreens = [];
      for (const block of allBlocks) {
        for (const screen of block.screens) {
          if (!activeScreens.includes(screen)) {
            activeScreens.push(screen);
          }
        }
      }

      return activeScreens;
    }
  },

  beforeMount () {
    const buttons = this.getInputOption('buttons')['schema:itemListElement'] || [];

    for (let i = 0; i < buttons.length; i++) {
      this.$set(this.buttons, i, {
        name: buttons[i]['schema:name'],
        value: buttons[i]['schema:value'],
        image: buttons[i]['schema:image']
      });
    }

    if (this.isActivityValid)
    {
      this.updateActivityMetaInfo({ valid: true })
    }else{
      this.updateActivityMetaInfo({ valid: false })
    }

  },

  watch: {
    buttons: {
      deep: true,
      handler () {
        this.saveButtons(this.buttonCount);
      }
    },
    isActivityValid(newVal) {
      if (newVal)
      {
        this.updateActivityMetaInfo({ valid: true })
      }else{
        this.updateActivityMetaInfo({ valid: false })
      }

    }
  },

  methods: {
    ...mapMutations(config.MODULE_NAME, [
      'updateItemMetaInfo',
      'updateActivityMetaInfo',
    ]),

    thresholdChange (val){
      let newVal = Number(val);

      // let newVal = val;

      if (Number.isInteger(newVal) && newVal > 0) {
        for (const index of this.practiceScreens) {
          this.updateInputOption('minimumAccuracy', {
            'schema:name': 'minimumAccuracy',
            'schema:value': newVal,
            '@type': 'schema:Number',
          }, index)
        }

      }else{
        for (const index of this.practiceScreens) {
          this.updateInputOption('minimumAccuracy', {
            'schema:name': 'minimumAccuracy',
            'schema:value': null,
            '@type': 'schema:Number',
          }, index)
        }
      }

    },

    getBlocks (index) {
      const option = this.getInputOption('blocks', index);
      return option['schema:itemListElement'].map(block => ({
        name: block['schema:name'],
        screens: block.order
      }))
    },

    setBlocks (blocks, indexes) {
      for (const index of indexes) {
        this.updateInputOption('blocks', {
          "@type": "schema:ItemList",
          "schema:name": "blocks",
          "schema:numberOfItems": blocks.length,
          "schema:itemListElement": blocks.map(block => ({
            "schema:name": block.name,
            "order": block.screens
          }))
        }, index)
      }
    },

    onUploadBlockSequence (type) {
      this.blockSequenceDialog.visible = true;
      this.blockSequenceDialog.type = type;
      this.blockSequenceDialog.key++;
    },

    onAddImageFromUrl (event, index) {
      this.$set(this.buttons[index], 'image', event);
      this.notify = {
        type: 'success',
        message: 'Button image is successfully added.',
        duration: 3000
      }
    },

    async onAddImageFromDevice (uploadFunction, index) {
      this.loading = true;

      try {
        this.$set(this.buttons[index], 'image', await uploadFunction());
        this.notify = {
          type: 'success',
          message: 'Button image is sucessfully added.',
          duration: 3000,
        };
      } catch (e) {
        this.notify = {
          type: 'error',
          message: 'Something went wrong while uploading button image. Please use different image or try again later.',
          duration: 3000,
        }
      }

      this.loading = false;
    },

    onRemoveImage (index) {
      this.$set(this.buttons[index], 'image', '');

      this.notify = {
        type: 'warning',
        message: `Button image is successfully removed.`,
        duration: 3000,
      };
    },

    onEventNotify (event) {
      this.notify = {
        type: 'warning',
        message: event.message,
        duration: 3000
      }
    },

    saveButtons (buttonCount) {
      this.updateInputOption('buttons', {
        'schema:name': 'buttons',
        'schema:itemListElement': this.buttons.filter((_, index) => index < buttonCount).map((button, index) => ({
          "schema:name": button.name,
          "schema:value": index,
          "schema:image": button.image
        }))
      })
    },

    getInputOption (name, index = -1) {
      for (let i = 0; i < this.items.length; i++) {
        const item = this.items[i];
        if (item.inputType == 'visual-stimulus-response' && (index == -1 || index == i)) {
          return item.inputOptions.find(option => option['schema:name'] == name);
        }
      }

      return null;
    },

    updateInputOption (name, value, itemIndex = -1) {
      for (let i = 0; i < this.items.length; i++) {
        const item = this.items[i];
        if (item.inputType == 'visual-stimulus-response' && (itemIndex == -1 || itemIndex == i)) {
          this.updateItemMetaInfo({
            index: i,
            obj: {
              inputOptions: item.inputOptions.map(option => {
                return option['schema:name'] == name ? value : option;
              })
            }
          });
        }
      }
    },

    onSaveInstructions () {
      const indexes = this.getItemIndexFromType(this.dataType);

      this.markdownDialog = false;
      for (const index of indexes) {
        this.updateItemMetaInfo({
          index,
          obj: {
            markdownText: this.markdown
          }
        })
      }
    },

    getItemIndexFromType(type) {
      switch(type) {
        case 'overview':
          return [0];
        case 'practice':
          return [1];
        case 'test':
          return [7];
      }
      return [-1];
    },

    openMarkdownDialog(type, title) {
      const index = this.getItemIndexFromType(type)[0];

      if (index >= 0) {
        this.dialogTitle = title;
        this.markdown = this.items[index].markdownText;
        this.dataType = type;
        this.markdownDialog = true;
      }
    },

    saveStimulusScreens ({ screens, duration, activeScreenRemoved }) {
      if (screens.length >= this.stimulusScreens.length && !activeScreenRemoved) {
        const screenMapping = {};
        for (let i = 0; i < this.stimulusScreens.length; i++) {
          screenMapping[this.stimulusScreens[i].id] = screens[i].id;
        }

        this.blocksTest = this.blocksTest.map(block => ({
          name: block.name,
          screens: block.screens.map(screen => screenMapping[screen])
        }))

        this.blocksPractice = this.blocksPractice.map(block => ({
          name: block.name,
          screens: block.screens.map(screen => screenMapping[screen])
        }))
      } else {
        this.blocksTest = [];
        this.blocksPractice = [];
      }

      this.stimulusScreens = screens;
      this.stimulusDurationPractice = duration.practice;
      this.stimulusDurationTest = duration.test;

      this.stimulusScreenDialog.visible = false;
    },

    saveFixationScreen ({ screen, duration }) {
      this.updateInputOption('showFixation', {
        "@type": "schema:Boolean",
        "schema:name": "showFixation",
        "schema:value": screen ? true : false
      });

      if (!screen) {
        this.fixationScreen = {
          name: '',
          image: ''
        };
        this.fixationDuration = 0;
      } else {
        this.fixationScreen = screen;
        this.fixationDuration = duration;
      }
      this.fixationScreenDialog.visible = false;
    },

    saveBlockSequence (blocks) {
      if (this.blockSequenceDialog.type == 'practice') {
        this.blocksPractice = blocks;
      } else {
        this.blocksTest = blocks;
      }

      this.blockSequenceDialog.visible = false;
    },

    onUploadStimulusScreen () {
      this.stimulusScreenDialog.visible = true;
      this.stimulusScreenDialog.key++;
    },

    onUploadFixationScreen () {
      this.fixationScreenDialog.visible = true;
      this.fixationScreenDialog.key++;
    }
  }
}
</script>
