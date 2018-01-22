import Vue from 'vue';
import cloneDeep from 'lodash/cloneDeep';
var storage = null;
var schema = null;
var vm = null;
var vmChangedCb = () => {};

function schemaValidator (schema) {
  var r = true;
  var validTypes = ['input'];
  Object.values(schema).forEach(obj => {
    const types = Object.values(obj);
    r = r && types.every(t => {
      return validTypes.indexOf(t) !== -1;
    });
  });
  return r;
}

function initVm (data) {
  vm = new Vue({
    data: () => data,
  });
}

export default {
  setStorage (s) {
    if (!s) {
      throw new Error('a');
    }
    if (!s.init || !s.change) {
      throw new Error('b');
    }
    const initData = s.init();
    vmChangedCb = s.change;
    if (initData instanceof Promise) {
      initData.then(data => {
        initVm (data);
      })
    } else {
      initVm (initData);
    }
  },
  getStorage () {
    return {
      setData (k, v) {
        vm[k] = v;
      },
      save () {
        vmChangedCb(vm.$data);
      },
      getData (k) {
        return vm[k]
      },
    }
  },
  setSchema (s) {
    if (!schemaValidator(s)) {
      throw new Error('schema is invalid');
    }
    schema = s;
  },
  getSchema (type) {
    return JSON.parse(JSON.stringify(schema[type]));
  },
};
