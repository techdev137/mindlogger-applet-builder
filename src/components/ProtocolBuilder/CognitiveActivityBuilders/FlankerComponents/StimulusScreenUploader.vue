<template>
  <v-dialog
    :width="1024"
    :value="value"
    @input="$emit('input', $event)"
    persistent
  >
    <v-card
      class="d-flex"
    >
      <div class="options">
        <v-btn class="upload-screens" @click="replaceStimulusScreen(-1)">
          {{ files.length ? 'Add' : 'Upload' }} Stimulus Screens
        </v-btn>

        <input
          :key="inputKey"
          ref="fileInput"
          type="file"
          class="file-input"
          accept="image/jpeg, image/png, image/bmp"
          :multiple="currentIndex >= 0 ? false : true"
          @change="addStimulusScreens($event)"
        >

        <div class="round-type">
          Practice Round
        </div>

        <div class="d-flex align-center">
          <div class="label">
            Show each stimulus for:
          </div>

          <v-text-field
            class="stimulus-time"
            type="number"
            min="1"
            @change="showCloseConfirmation = true"
            v-model="duration.practice"
          />

          milliseconds
        </div>

        <div class="round-type">
          Test Round
        </div>

        <div class="d-flex align-center">
          <div class="label">
            Show each stimulus for:
          </div>

          <v-text-field
            class="stimulus-time"
            type="number"
            min="1"
            @change="showCloseConfirmation = true"
            v-model="duration.test"
          />

          milliseconds
        </div>
      </div>

      <div class="splitter" />

      <div class="screens">
        <v-simple-table>
          <template v-slot:default>
            <thead>
              <tr>
                <th class="text-left">Filename</th>
                <th
                  v-if="buttonCount > 1"
                  class="text-left"
                >Correct Button Press</th>
                <th></th>
              </tr>
            </thead>

            <tbody>
              <tr
                v-for="(file, index) in files"
                :key="index"
                class="stimulus-screen"
              >
                <td class="file-name">
                  <v-tooltip
                    v-if="file.name.length > 15"
                    bottom
                  >
                    <template v-slot:activator="{ on }">
                      <div v-on="on">
                        {{ getDisplayName(file.name) }}
                      </div>
                    </template>

                    <div>
                      {{ file.name }}
                    </div>
                  </v-tooltip>

                  <div
                    v-else
                  >
                    {{ file.name }}
                  </div>
                </td>
                <td
                  v-if="buttonCount > 1"
                >
                  <v-btn
                    class="mr-2"
                    :color="!correct[index] ? 'primary' : ''"
                    @click="switchCorrectButton(index, 0)"
                  >
                    Button 1
                  </v-btn>

                  <v-btn
                    class="ml-2"
                    :color="correct[index] ? 'primary' : ''"
                    @click="switchCorrectButton(index, 1)"
                  >
                    Button 2
                  </v-btn>
                </td>
                <td>
                  <v-btn @click="replaceStimulusScreen(index)" class="stimulus-btn" icon>
                    <v-icon>mdi-pencil</v-icon>
                  </v-btn>

                  <v-btn @click="onDeleteStimulusScreen(index)" class="stimulus-btn" icon>
                    <v-icon>mdi-delete</v-icon>
                  </v-btn>
                </td>
              </tr>

              <tr
                v-if="!files.length"
                class="justify-center"
              >
                No stimulus screens uploaded
              </tr>
            </tbody>
          </template>
        </v-simple-table>

        <div
          v-if="errorMessage"
          class="error-message mt-4"
        >
          {{ errorMessage }}
        </div>

        <div class="d-flex mt-8">
          <v-spacer />

          <v-btn class="mx-4" color="primary" :disabled="!isValid || !files.length" @click="saveStimulusScreens">
            Save
          </v-btn>

          <v-btn @click="onCloseStimulusScreen">
            Close
          </v-btn>
        </div>
      </div>

      <v-dialog
        v-model="uploading"
        width="400"
      >
        <v-card class="pt-5 pb-6">
          <v-progress-circular
            class="d-block mx-auto mt-2"
            color="primary"
            indeterminate
            :size="50"
          />
        </v-card>
      </v-dialog>

      <ConfirmationDialog
        v-model="deleteConfirmDialog"
        @close="closeStimulusScreen"
      />

      <v-dialog
        v-model="deleteScreenDialog"
        width="600"
        persistent
      >
        <v-card>
          <v-card-title>
            Delete Stimulus Screen
          </v-card-title>

          <v-card-text class="pa-4">
            Are you sure you want to delete this image? It is part of one of your block sequences.
          </v-card-text>

          <v-card-actions>
            <v-spacer />
            <v-btn color="primary" @click="deleteStimulusScreen">
              OK
            </v-btn>

            <v-btn @click="deleteScreenDialog = false; currentIndex = -1;">
              Cancel
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-card>
    <Notify :notify="notify" />
  </v-dialog>
</template>

<style scoped>
.file-input {
  display: none;
}
.error-message {
  font-weight: 600;
  color: rgb(212, 75, 76);
}
.options {
  width: 40%;
  display: flex;
  flex-direction: column;
  padding: 16px;
}

.splitter {
  width: 5px;
  border: 1px solid grey;
  border-radius: 4px;
}

.screens {
  flex-grow: 1;
  padding: 16px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.upload-screens {
  width: 200px;
  align-self: center;
}

.upload-screens /deep/ .v-btn__content {
  width: 100%;
  white-space: break-spaces;
  text-align: center;
}

.round-type {
  margin-top: 20px;
}

.label {
  text-align: right;
  margin-left: 20px;
  margin-right: 5px;
}

.stimulus-time {
  max-width: 60px;
}

.stimulus-btn {
  opacity: 0;
  transition: opacity .1s;
}
.stimulus-screen:hover .stimulus-btn {
  opacity: 1;
}

thead {
  display: block;
}
tbody {
  max-height: 400px;
  overflow: auto;
  display: block;
}
tr {
  width: 100%;
  display: flex;
}

td, th {
  display: flex;
  align-items: center;
  width: 25%;
}

td:nth-child(2), th:nth-child(2) {
  width: 50%;
}
</style>

<script>
import { Uploader as S3Uploader } from '../../../../models/Uploader';
import ConfirmationDialog from './ConfirmationDialog';
import Notify from "../../Additional/Notify";

export default {
  components: {
    ConfirmationDialog,
    Notify,
  },
  props: {
    value: {
      type: Boolean,
      required: true
    },
    buttonCount: {
      type: Number,
      required: true
    },
    stimulusDurationPractice: {
      type: Number,
      required: true
    },
    stimulusDurationTest: {
      type: Number,
      required: true
    },
    screens: {
      type: Array,
      required: true
    },
    activeScreens: {
      type: Array,
      required: true
    }
  },

  data () {
    return {
      files: [...this.screens],
      correct: this.screens.map(screen => screen.value),
      inputKey: 0,
      duration: {
        practice: this.stimulusDurationPractice,
        test: this.stimulusDurationTest
      },
      s3Uploader: new S3Uploader('image'),
      uploading: false,
      errorMessage: '',
      currentIndex: -1,
      deleteScreenDialog: false,
      deleteConfirmDialog: false,
      activeScreenRemoved: false,
      showCloseConfirmation: false,
      notify: {}
    }
  },

  computed: {
    isValid () {
      return this.files.length > 0 && this.correct.length > 0 &&
              this.duration.practice >= 1 && this.duration.practice % 1 == 0 &&
              this.duration.test >= 1 && this.duration.test % 1 == 0;
    }
  },

  methods: {
    getDisplayName (name) {
      return name.length > 15 ? name.slice(0, 12) + '...' : name;
    },

    addStimulusScreens (e) {
      for (const file of e.target.files) {

        if (this.isFileImage(file)){

          if (this.currentIndex >= 0) {
            this.$set(this.files, this.currentIndex, file);
          } else {
            this.files.push(file);
            this.correct.push(0);
          }

        }else{
          this.notify = {
            type: 'warning',
            message: 'Please check if you use correct image file!',
            duration: 3000
          }
        }

      }
    },

    switchCorrectButton (index, value) {
      this.$set(this.correct, index, value);
      this.showCloseConfirmation = true;
    },

    onDeleteStimulusScreen (index) {
      this.currentIndex = index;

      if (this.activeScreens.includes(this.files[index].id)) {
        this.deleteScreenDialog = true;
      } else {
        this.deleteStimulusScreen();
      }
    },

    deleteStimulusScreen () {
      this.files.splice(this.currentIndex, 1);
      this.correct.splice(this.currentIndex, 1);
      this.showCloseConfirmation = true;
      this.currentIndex = -1;

      if (this.deleteScreenDialog) {
        this.activeScreenRemoved = true;
      }

      this.deleteScreenDialog = false;
    },

    onCloseStimulusScreen() {
      if (this.showCloseConfirmation) {
        this.deleteConfirmDialog = this.showCloseConfirmation;
      } else {
        this.$emit('input', false);
      }
    },

    closeStimulusScreen() {
      this.$emit('input', false);
      this.showCloseConfirmation = false;
    },

    replaceStimulusScreen (index) {
      this.currentIndex = index;
      this.inputKey++;
      this.showCloseConfirmation = true;

      setTimeout(() => {
        this.$refs.fileInput.click();
      })
    },

    async saveStimulusScreens () {
      let screens = [], index = 0;

      this.uploading = true;
      this.errorMessage = '';

      try {
        for (index = 0; index < this.files.length; index++) {
          let image = '';

          if (this.files[index].id) {
            image = this.files[index].image;
          } else {
            const response = await this.s3Uploader.upload(this.files[index]);
            image = response.location;
          }

          this.$set(this.files, index, {
            id: this.files[index].id || (this.files[index].name.replace(/[^a-zA-Z0-9]/g, '__') + index),
            name: this.files[index].name,
            image
          })
        }

        this.$emit('save', {
          screens: this.files.map((file, index) => ({
            ...file,
            value: this.correct[index]
          })),
          duration: {
            practice: Number(this.duration.practice),
            test: Number(this.duration.test),
          },
          activeScreenRemoved: this.activeScreenRemoved
        })
      } catch (e) {
        this.errorMessage = `Sorry, we were not able to upload ${this.files[index].name}. Please upload different file or try again later.`;
      }

      this.uploading = false;
    },

    isFileImage(file) {
      return file && file['type'].split('/')[0] === 'image';
    }

  }
}
</script>
