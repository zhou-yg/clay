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
        <el-input :value="g.value" size="small" @input="changeValue" />
      </span>
      <span class="input-box" v-if="g.type === 'boolean'" >
        <el-checkbox :value="g.value" size="small" @input="changeValue" />
      </span>
    </p>
  </div>
</template>

<style lang="">
.operation-item {

  .pre {
    width: 6em;
    display: inline-block;
  }

  .line {
    margin: 0 0 8px 0;
  }
}
</style>
