<script type="text/babel">
/**
 * Created by zhouyg.
 */
import Vue from 'vue';
import props2DataMixin from '../mixins/props2DataMixin';
import config from '../config';
import {merge, cloneDeep, pick} from 'lodash';
import Operation from './Operation.vue';
import { reduceObj,trans, groupToValue, getXY} from '../utils';

const opManager = {
  op: null,
  target: null,
  removeOp() {
    if (this.op && this.op.$destroy) {
      this.op.$el.remove();
      this.op.$destroy();
      this.op = null;
    }
  },
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
      return config.getSchema(this.type);
    },
    myGroup () {
      if (Array.isArray(this.myData)) {
        if (!Array.isArray(this.mySchema)) {
          throw new Error(`${this.type} not match array`);
        }

        const keys = Object.keys(this.mySchema[0]);
        const myPickedData = this.myData.map(obj => pick(obj, keys));

        let schemaArr = new Array(this.myData.length).fill(this.mySchema[0]).map(cloneDeep);
        let final = merge([], trans(myPickedData, 'value'), schemaArr);
        final = final.map(obj => Object.values(obj));
        return final;
      } else {
        let final = merge({}, trans(this.myData, 'value'), this.mySchema);
        let d = Object.values(final);
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
    showOp (e, position) {

      if (opManager.op && !this.isShowedOp) {
        opManager.removeOp();
      }
      if (this.isShowedOp) {
        opManager.removeOp();
        return this.isShowedOp = false;
      }


      if (position) {
      } else {
        position = getXY(e);
      }

      const op = new Operation({
        el: document.createElement('div'),
        propsData: {
          title: this.type,
          group: this.myGroup,
          position,
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
        opManager.removeOp();
      });
      op.$on('newOne', () => {
        config.getStorage().newData(this.type);
        opManager.removeOp();
        this.$nextTick(() => {
          this.showOp(null, position);
        })
      });
      op.$on('cancel', () => {
        opManager.removeOp();
      });
      window.pEl = this.$el;
      document.body.appendChild(op.$el);
      opManager.op = op;
      this.isShowedOp = true;
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
