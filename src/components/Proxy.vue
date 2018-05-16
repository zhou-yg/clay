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
    type: [String, Array],
  },
  data () {
    return {
      index: 0,
    };
  },
  computed: {
    currentType () {
      if (this.type instanceof Array) {
        return this.type[this.index];
      }
      return this.type;
    },
    typeArray () {
      if (this.type instanceof Array) {
        return this.type;
      }
      return [this.type];
    },
    openProxy () {
      console.log(`config.getStorage().getData('openProxy'):`, config.getStorage().getData('openProxy'));
      return config.getStorage().getData('openProxy');
    },
    myData () {
      return config.getStorage().getData(this.currentType);
    },
    mySchemaProperties () {
      console.log(config.getSchema(this.currentType));
      return config.getSchema(this.currentType).perperties;
    },
    myGroup () {
      console.log(`this.myData:`, this.myData);
      console.log(`this.mySchemaProperties:`, this.mySchemaProperties);
      console.log(`this.mySchemaProperties[0]:`, this.mySchemaProperties[0]);
      if (Array.isArray(this.myData)) {
        // if (!Array.isArray(this.mySchemaProperties)) {
        //   throw new Error(`${this.type} not match array`);
        // }
        const keys = Object.keys(this.mySchemaProperties);
        const myPickedData = this.myData.map(obj => pick(obj, keys));

        let schemaArr = new Array(this.myData.length).fill(this.mySchemaProperties).map(cloneDeep);
        let final = merge([], trans(myPickedData, 'value'), schemaArr);
        final = final.map(obj => Object.values(obj));
        console.log(final);
        return final;
      } else {
        // console.log(`trans(this.myData, 'value')`, trans(this.myData, 'value'));
        let final = merge({}, trans(this.myData, 'value'), this.mySchemaProperties);
        let d = Object.values(final);
        console.log(d);
        return d;
      }
    },
  },
  mounted () {
    // this.$nextTick(() => {
    //   console.log(this.myGroup);
    // });
  },
  methods: {
    showOp (e, position) {

      if (opManager.op && !this.isShowedOp) {
        opManager.removeOp();
      }


      if (position) {
      } else {
        position = getXY(e);
      }

      const op = new Operation({
        el: document.createElement('div'),
        propsData: {
          title: this.currentType,
          types: this.typeArray,
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
        config.getStorage().setData(this.currentType, typeValue);
      });
      op.$on('save', () => {
        config.getStorage().save();
        opManager.removeOp();
      });
      op.$on('newOne', () => {
        config.getStorage().newData(this.currentType);
        // console.log(this.myGroup);
        op.refreshGroupdata(this.myGroup);
        // opManager.removeOp();
        // this.$nextTick(() => {
        //   this.showOp(null, position);
        // })
      });
      op.$on('delOne', (i) => {
        config.getStorage().delData(this.currentType, i);
        // console.log(this.myGroup);
        op.refreshGroupdata(this.myGroup);
        // opManager.removeOp();
        // this.$nextTick(() => {
        //   this.showOp(null, position);
        // })
      });
      op.$on('upOne', (i) => {
        config.getStorage().upData(this.currentType, i);
        // console.log(this.myGroup);
        op.refreshGroupdata(this.myGroup);
        // opManager.removeOp();
        // this.$nextTick(() => {
        //   this.showOp(null, position);
        // })
      });
      op.$on('downOne', (i) => {
        config.getStorage().downData(this.currentType, i);
        // console.log(this.myGroup);
        op.refreshGroupdata(this.myGroup);
        // opManager.removeOp();
        // this.$nextTick(() => {
        //   this.showOp(null, position);
        // })
      });
      op.$on('cancel', () => {
        opManager.removeOp();
      });
      op.$on('changeType', (newIndex) => {
        this.index = newIndex;
        this.$nextTick(() => {
          this.showOp(null, position);
        })
      });
      window.pEl = this.$el;
      document.body.appendChild(op.$el);
      opManager.op = op;
    },
  },
  components: {
    Operation,
  },
});

export default Cpt;
</script>

<template lang="html">
  <span class="clay-proxy" :class="{ open:openProxy }">
    <slot v-bind="myData" v-if="myData.isShow" />

    <span v-if="openProxy" class="tag2" @click="showOp"></span>
  </span>
</template>
<style lang="">
 .clay-proxy {
   box-sizing: border-box;
   width: 100%;
   position: relative;

   &.open {
    border:1px dotted;
    min-height: 16px;
    display: inline-block;
   }

   .tag {
     content: '';
     border: solid 8px;
     border-color: #666  #666 transparent transparent ;
     position: absolute;
     top: 0px;
     right: 0;
     cursor: pointer;
   }
   .tag2 {
      border: 2px solid;
      width: 10px;
      height: 10px;
      position: absolute;
      top: -1px;
      right: -1px;
      cursor: pointer;
    }
    .tag2:before,
    .tag2:after{
        content: '';
        outline: 0;
        border-top: 2px solid #fff;
        border-bottom: 4px solid #fff;
        width: 10px;
        position:absolute;
        right: -0.5px;
        top: -4px;
        transform: rotate(-45deg);
        transform-origin: 100% 0;
     }
    .tag2:after {
       border-bottom: 2px solid black;
      heihgt: 0;
       z-index: 1;
    }
 }
</style>
