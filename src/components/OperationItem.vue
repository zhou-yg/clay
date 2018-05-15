<script type="text/babel">
/**
 * Created by zhouyg.
 */
import Vue from 'vue';
const Cpt = Vue.extend({
  props: {
    g: Object,
  },
  data () {
    return {
    };
  },
  computed: {

  },
  mounted () {
    this.$nextTick(() => {

    });
  },
  methods: {
    changeValue (v) {
      this.$emit('change', v);
    },
  },
  components: {
  },
});

export default Cpt;
</script>

<template lang="html">
  <div class="operation-item">
    <p class="line" >
      <span class="pre">{{g.name}}：</span>
      <span class="input-box" v-if="g.type === 'input'" >
        <el-input :value="g.value" size="small" @input="changeValue" :placeholder="g.placeholder" />
      </span>
      <span class="input-box" v-if="g.type === 'boolean'" >
        <el-checkbox :value="g.value" size="small" @input="changeValue" />
      </span>
      <span class="input-box" v-if="g.type === 'date'" >
        <el-date-picker :value="g.value" size="small" @input="changeValue" />
      </span>
      <span class="input-box" v-if="g.type === 'img'" >
        <div v-if="g.value">
          <img style="width: 100%" :src="g.value" />
        </div>
        <el-input :value="g.value" size="small" @input="changeValue" />
      </span>
      <span class="input-box" style="vertical-align: text-top;width: auto" v-if="g.type === 'checkbox'" >
        <el-checkbox-group
          v-model="g.value"
          @change="changeValue">
          <el-checkbox v-for="item in g.labels" :label="item.label">{{item.name}}</el-checkbox>
        </el-checkbox-group>
      </span>
      <span class="input-box" style="vertical-align: text-top;width: auto" v-if="g.type === 'radio'" >
        <el-radio-group
          :value="g.value"
          @change="changeValue">
          <el-radio v-for="item in g.labels" :label="item.label">{{item.name}}</el-radio>
        </el-radio-group>
      </span>
      <span class="input-box" style="vertical-align: text-top;width: auto" v-if="g.type === 'radio'" >
        <el-switch
          :value="g.value"
          @change="changeValue"
          active-color="#01a6ff"
          inactive-color="#efefef">
        </el-switch>
      </span>
    </p>
  </div>
</template>

<style lang="">
.operation-item {

  .pre {
    width: 6em;
    text-align: right;
    display: inline-block;
  }

  .line {
    margin: 0 0 8px 0;
  }
}
</style>
