<script type="text/babel">
/**
 * Created by zhouyg.
 */
import Vue from 'vue';
import props2DataMixin from '../mixins/props2DataMixin';
import m from '../m';

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
      return m.get(this.type);
    },
  },
  mounted () {
    this.$nextTick(() => {

    });
  },
  methods: {},
  components: {},
});

export default Cpt;
</script>

<template lang="html">
  <span class="clay-proxy">
    <slot v-bind="myData" />
  </span>
</template>
<style lang="">
 .clay-proxy {
   /*display: inline-block;*/
 }
</style>
