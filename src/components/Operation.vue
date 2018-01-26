<script type="text/babel">
/**
 * Created by zhouyg.
 */
import Vue from 'vue';
import cloneDeep from 'lodash/cloneDeep';
import props2DataMixin from '../mixins/props2DataMixin';
import OperationItem from './OperationItem.vue';

const Cpt = Vue.extend({
  mixins: [props2DataMixin('group', 'myGroup')],
  props: {
    title: String,
    group: Array,
    position: Object,
  },
  data () {
    return {
    };
  },
  computed: {
    isArr () {
      return Array.isArray(this.group[0]);
    },
    positionDirection () {
      switch (this.position.direction) {
        case 'right':
          return 'right';
        default:
          return 'left';
      }
    },
  },
  mounted () {
    this.$nextTick(() => {

    });
  },
  methods: {
    changeValue (v, i , i2) {
      const group = cloneDeep(this.group);
      if (i2 !== undefined) {
        group[i][i2].value = v;
      } else {
        group[i].value = v;
      }
      this.myGroup = group;
      this.$emit('change', this.myGroup);
    },
    save () {
      this.$emit('save');
    },
    cancel () {
      this.$emit('cancel', this.group);
    },
    newOne () {
      this.$emit('newOne');
    },
  },
  components: {
    OperationItem,
  },
});

export default Cpt;
</script>

<template lang="html">
  <div class="clay-operation-box">
    <div class="clay-operation" :class="positionDirection" >
      <header>
        <h3>{{title}}</h3>
      </header>
      <div class="item" v-for="(g, index) in group" :key="g.name" :data-index="index" >
          <p v-if="isArr" >
            <span v-for="(g1, index2) in g">
              <operation-item :g="g1" @change="v => changeValue(v, index, index2)" />
            </span>
          </p>
          <p v-else>
            <operation-item :g="g" @change="v => changeValue(v, index)" />
          </p>
      </div>
    </div>
    <p class="btns">
      <span class="fl" v-if="isArr">
        <el-button size="small" @click="newOne">新建</el-button>
      </span>
      <span class="fr">
        <el-button size="small" type="primary" @click="save">保存</el-button>
      </span>
      <span class="fr">
        <el-button size="small" type="primary" @click="cancel">取消</el-button>
      </span>
    </p>
  </div>
</template>

<style lang="">
.clay-operation-box{
  /*&:before {
    content: '';
    background-color: rgba(0, 0, 0, 0.5);
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 1999
  }*/
}
.clay-operation{
  border: 1px solid #eee;
  box-shadow: 0 2px 4px 0 rgba(0,0,0,.12), 0 0 6px 0 rgba(0,0,0,0.04);
  color: #666;
  padding: 5px;
  background: #fff;
  width: 300px;
  position: fixed;
  z-index: 1999;
  top: 0;
  left: 0;
  bottom: 0;
  overflow: auto;
  padding-bottom: 40px;

  header {
    margin-bottom: 10px;
    color: #333;
  }

  .item {
    margin: 0 0 8px 0;
    padding-bottom: 5px;
    border-bottom: 1px solid #eee;
  }

  &.right {
    left: auto;
    right: 0;

    & + .btns{
      left: auto;
      right: 0;
    }
  }

  .input-box {
    width: 200px;
    display: inline-block;
  }
  & + .btns {
    background-color: #fff;
    border-top: 1px solid #eee;
    padding: 10px 0;
    width: 312px;
    position: absolute;
    left: 0;
    bottom: 0;
    z-index: 2300;
    .fr{
      float: right;

      & + .fr {
        margin-right: 8px;
      }
    }
    .fl{
      float: left;
    }
  }
}
</style>
