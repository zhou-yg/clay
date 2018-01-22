<script type="text/babel">
/**
 * Created by zhouyg.
 */
import Vue from 'vue';
import props2DataMixin from '../mixins/props2DataMixin';
import config from '../config';
import merge from 'lodash/merge';
import Operation from './Operation.vue';

function trans (obj, pre) {
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
      return config.getStorage().getData(this.type);
    },
    mySchema () {
      return config.getSchama(this.type);
    },
    myGroup () {
      const final = merge({}, trans(this.myData, 'value'), trans(this.mySchema, 'type'));
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
      // this.showOp();
    });
  },
  methods: {
    removeOp () {
      this.op.$el.remove();
      this.op.$destroy();
      this.op = null;
    },
    showOp () {
      if (this.op) {
        return this.removeOp();
      }
      const op = new Operation({
        el: document.createElement('div'),
        propsData: {
          group: this.myGroup,
        }
      });
      op.$on('change', group => {
        group.forEach(obj => {
          config.getStorage().setData(this.type, {
            [obj.name]: obj.value,
          });
        })
      });
      op.$on('save', () => {
        config.getStorage().save();
      });
      op.$on('cancel', () => {
        this.removeOp();
      });
      window.pEl = this.$el;
      this.$el.appendChild(op.$el);
      this.op = op;
    },
  },
  components: {
    Operation,
  },
});

export default Cpt;
</script>

<template lang="html">
  <span class="clay-proxy">
    <slot v-bind="myData" />

    <span class="tag" @click="showOp"></span>
  </span>
</template>
<style lang="">
 .clay-proxy {
   /*display: inline-block;*/
   position: relative;

   .tag {
     content: '';
     border: solid 8px;
     border-color: transparent transparent #666  #666;
     position: absolute;
     top: -16px;
     left: 0;
   }
 }
</style>
