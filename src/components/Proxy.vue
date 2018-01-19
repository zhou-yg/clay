<script type="text/babel">
/**
 * Created by zhouyg.
 */
import Vue from 'vue';
import props2DataMixin from '../mixins/props2DataMixin';
import m from '../m';
import merge from 'lodash/merge';
import Operation from './Operation.vue';

function trans (obj, pre = 'value') {
  const d = Object.keys(obj).map(k => {
    return {
      [k]: {
        [pre]: obj[k],
      },
    };
  }).reduce((pre, next) => {
    return Object.assign(pre, next);
  }, {});
  return d;
}

const Cpt = Vue.extend({
  // mixins: [props2DataMixin('data', 'myData')],
  props: {
    type: String,
  },
  data () {
    return {};
  },
  computed: {
    myData () {
      return m.getStorage().getData(this.type);
    },
    mySchema () {
      return m.getStorage().getData(this.type);
    },
    myGroup () {
      const final = merge({}, trans(this.myData), trans(this.mySchema, 'type'));
      const d = Object.keys(final).map(k => {
        return Object.assign({
          name: k,
        },final[k])
      });
      console.log(`d:`, d);
      return d;
    },
  },
  mounted () {
    this.$nextTick(() => {

    });
  },
  methods: {},
  components: {
    Operation,
  },
});

export default Cpt;
</script>

<template lang="html">
  <span class="clay-proxy">
    <slot v-bind="myData" />

    <operation  :group="myGroup" />
  </span>
</template>
<style lang="">
 .clay-proxy {
   /*display: inline-block;*/
 }
</style>
