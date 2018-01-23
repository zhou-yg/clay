<script type="text/babel">
/**
 * Created by zhouyg.
 */
import Vue from 'vue';
import cloneDeep from 'lodash/cloneDeep';
import props2DataMixin from '../mixins/props2DataMixin';

const Cpt = Vue.extend({
  mixins: [props2DataMixin('group', 'myGroup')],
  props: {
    group: Array,
    x: Number,
    y: Number,
  },
  data () {
    return {
    };
  },
  computed: {
    isArr () {
      return Array.isArray(this.group[0]);
    },
    position () {
      return {
        top: this.y + 'px',
        left: this.x + 'px',
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
  },
});

export default Cpt;
</script>

<template lang="html">
  <div class="clay-operation bottom" :style="position">
    <div class="item" v-for="(g, index) in group" :key="g.name" :data-index="index" >
        <p v-if="isArr" >
          <span v-for="(g1, index2) in g">
            <p class="line" v-if="g1.type === 'input'" >
              <span class="pre">{{g1.name}}：</span>
              <span class="input-box">
                <el-input :value="g1.value" size="small" @input="v => changeValue(v, index, index2)" />
              </span>
            </p>
          </span>
        </p>
        <p v-else>
          <p class="line" v-if="g.type === 'input'" >
            <span class="pre">{{g.name}}：</span>
            <span class="input-box">
              <el-input :value="g.value" size="small" @input="v => changeValue(v, index)" />
            </span>
          </p>
        </p>
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
.clay-operation{
  border: 1px solid #eee;
  box-shadow: 0 2px 4px 0 rgba(0,0,0,.12), 0 0 6px 0 rgba(0,0,0,0.04);
  color: #666;
  padding: 5px;
  position: absolute;
  background: #fff;
  transform: translate(20px, 0px);
  width: 240px;
  z-index: 1999;
  left: 100%;
  top: 0;

  .item {
    margin: 0 0 8px 0;
    padding-bottom: 5px;
    border-bottom: 1px solid #eee;

    .pre {
      width: 4em;
      display: inline-block;
    }
    .line {
      margin: 0 0 8px 0;
    }
  }

  &:before,
  &:after {
    content: '';
    border: 5px solid;
    border-color: transparent  #999 transparent transparent;
    position: absolute;
    left: -10px;
    top: 6px;
  }
  &:after{
    border: 4px solid;
    border-color: transparent  #fff transparent transparent;
    left: -8px;
    top: 7px;
  }

  &.bottom {
    transform: translate(0px, 10px);
    &:before,
    &:after {
      border-color: transparent  transparent #999  transparent;
      position: absolute;
      top: -10px;
      left: 6px;
    }
    &:after{
      border-color: transparent transparent  #fff  transparent;
      top: -8px;
      left: 7px;
    }
  }

  .input-box {
    width: 100px;
    display: inline-block;
  }
  .btns {
    margin: 10px 0 0 0;
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
