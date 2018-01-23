<script type="text/babel">
/**
 * Created by zhouyg.
 */
import Vue from 'vue';
import props2DataMixin from '../mixins/props2DataMixin';
import config from '../config';
import {merge, cloneDeep} from 'lodash';
import Operation from './Operation.vue';
import { reduceObj,trans, groupToValue} from '../utils';

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
      if (Array.isArray(this.myData)) {
        if (!Array.isArray(this.mySchema)) {
          throw new Error(`${this.type} not match array`);
        }

        let schemaArr = new Array(this.myData.length).fill(this.mySchema[0]).map(cloneDeep);
        let final = merge([], trans(this.myData, 'value'), schemaArr);
        final = final.map(obj => Object.values(obj));
        console.log(`final:`, final);
        return final;
      } else {
        let final = merge({}, trans(this.myData, 'value'), this.mySchema);
        let d = Object.values(final);
        console.log(`d:`, d);
        return d;
      }
    },
  },
  mounted () {
    this.$nextTick(() => {
      console.log(this.myGroup);
    });
  },
  methods: {
    removeOp () {
      this.op.$el.remove();
      this.op.$destroy();
      this.op = null;
    },
    showOp (e, pageX, pageY) {
      if (pageX && pageY) {

      } else {
        pageX = e.pageX - e.offsetX - e.currentTarget.offsetLeft;
        pageY = e.pageY - e.offsetY + e.currentTarget.parentNode.offsetHeight;
      }

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
        let typeValue;
        if (Array.isArray(this.myData)) {
          typeValue = group.map(arr => groupToValue(arr));
        } else {
          typeValue = groupToValue(group);
        }
        config.getStorage().setData(this.type, typeValue);
      });
      op.$on('save', () => {
        config.getStorage().save();
        this.removeOp();
      });
      op.$on('newOne', () => {
        config.getStorage().newData(this.type);
        this.removeOp();
        this.$nextTick(() => {
          this.showOp(null, pageX, pageY);
        })
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
