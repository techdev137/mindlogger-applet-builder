<template>
  <div>
    <ActivityHeader
      :headerExpanded="isExpanded"
      class="pa-4 my-4"
      @onExpand="handleExpansion()"
    />

    <template
      v-if="currentActivity.activityType === 'NORMAL'"
    >
      <ItemList
        v-if="currentScreen == config.ITEM_SCREEN"
        class="pb-2"
        @onAddItem="handleAddItem()"
      />

      <SubScaleList
        v-if="currentScreen == config.SUBSCALE_SCREEN"
        class="pb-2"
      />

      <ConditionalList
        v-if="currentScreen == config.CONDITIONAL_SCREEN"
        class="pb-2"
      />

      <Reports
        v-if="currentScreen == config.REPORT_SCREEN"
        class="pb-2"
      />
    </template>

    <template
      v-else-if="currentActivity.activityType == 'CST_GYRO' || currentActivity.activityType == 'CST_TOUCH'"
    >
      <CSTBuilder
      />
    </template>

    <template
      v-else-if="currentActivity.activityType == 'FLANKER'"
    >
      <FlankerBuilder
      />
    </template>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';
import config from '../../config';
import ActivityHeader from './ActivityHeader';
import ItemList from './Items/ItemList';
import SubScaleList from './SubScales/SubScaleList';
import ConditionalList from './Conditionals/ConditionalList';
import Reports from './Reports/Reports';
import CSTBuilder from './CognitiveActivityBuilders/CSTBuilder';
import FlankerBuilder from './CognitiveActivityBuilders/FlankerBuilder';

export default {
  components: {
    ActivityHeader,
    ItemList,
    SubScaleList,
    ConditionalList,
    CSTBuilder,
    FlankerBuilder,
    Reports,
  },
  data() {
    return {
      isExpanded: true,
    }
  },
  computed: {
    config () {
      return config;
    },
    ...mapGetters(config.MODULE_NAME, [
      'currentScreen',
      'currentActivity',
    ]),
  },
  methods: {
    handleAddItem() {
      this.isExpanded = false;
    },
    handleExpansion() {
      this.isExpanded = true;
    }
  }
}
</script>
