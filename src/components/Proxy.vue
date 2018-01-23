<script type="text/babel">
/**
 * Created by zhouyg.
 */
import Vue from 'vue';
import props2DataMixin from '../mixins/props2DataMixin';
import config from '../config';
import merge from 'lodash/merge';
import Operation from './Operation.vue';
import { reduceObj,trans} from '../utils';

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
      return config.getSchema(this.type);
    },
    myGroup () {
      const final = merge({}, trans(this.myData, 'value'), this.mySchema);
      const d = Object.keys(final).map(k => {
        return final[k];
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
    showOp (e) {
      var pageX = e.pageX - e.offsetX;
      var pageY = e.pageY - e.offsetY;

      if (this.op) {
        return this.removeOp();
      }
      const op = new Operation({
        el: document.createElement('div'),
        propsData: {
          group: this.myGroup,
          x: pageX,
          y: pageY,
        }
      });
      op.$on('change', group => {
        const typeValue = reduceObj(group.map(obj => {
          return {
            [obj.key]: obj.value
          }
        }))
        config.getStorage().setData(this.type, typeValue);
      });
      op.$on('save', () => {
        config.getStorage().save();
        this.removeOp();
      });
      op.$on('cancel', () => {
        this.removeOp();
      });
      window.pEl = this.$el;
      document.body.appendChild(op.$el);
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
   width: 100%;
   display: inline-block;
   position: relative;

   .tag {
     content: '';
     border: solid 8px;
     border-color: #666  #666 transparent transparent ;
     position: absolute;
     top: 0px;
     right: 0;
     cursor: pointer;
   }
 }
</style>
