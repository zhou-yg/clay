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
    changeValue (i, v) {
      const group = cloneDeep(this.group);
      group[i].value = v;
      this.myGroup = group;
      this.$emit('change', this.myGroup);
    },
    save () {
      this.$emit('save', this.myGroup);
    },
    cancel () {
      this.$emit('cancel', this.group);
    }
  },
  components: {
  },
});

export default Cpt;
</script>

<template lang="html">
  <div class="clay-operation">
    <p v-for="(g, index) in group" :key="g.name" :data-index="index" v-if="g.type === 'input'" >
      {{g.name}}：
      <span class="input-box">
        <el-input :value="g.value" @input="v => changeValue(index, v)" />
      </span>
    </p>
    <p class="btns">
      <el-button size="small" type="primary" @click="cancel">取消</el-button>
      <el-button size="small" type="primary" @click="save">保存</el-button>
    </p>
  </div>
</template>

<style lang="">
.clay-operation{
  border: 1px solid #999;
  box-shadow: 0 2px 4px 0 rgba(0,0,0,.12), 0 0 6px 0 rgba(0,0,0,0.04);
  color: #666;
  padding: 5px;
  position: absolute;
  background: #fff;
  transform: translate(0, 10px);
  width: 180px;
  z-index: 1999;

  &:before,
  &:after {
    content: '';
    border: 5px solid;
    border-color: transparent transparent #999 transparent;
    position: absolute;
    top: -10px;
    left: 6px;
  }
  &:after{
    border: 4px solid;
    border-color: transparent transparent #fff transparent;
    top: -8px;
    left: 7px;
  }
  .input-box {
    width: 100px;
    display: inline-block;
  }
  .btns {
    margin: 10px 0 0 0;
    float: right;
  }
}
</style>
