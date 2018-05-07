import Vue from 'vue';
import {cloneDeep, isPlainObject, isArray} from 'lodash';
import { reduceObj, typeDefaultValueMap } from './utils';
var storage = null;
var schema = null;
var vm;

var vmChangedCb = () => {};

function schemaValidator (schema) {
  var r = true;
  var validTypes = ['input', 'boolean', 'date'];
  Object.values(schema).forEach(obj => {
    if (isArray(obj.perperties)){
      obj = obj.perperties[0]
    }
    let types = Object.values(obj.perperties);
    r = r && types.every(t => {
      return validTypes.indexOf(t) !== -1 || validTypes.indexOf(t.type) !== -1;
    });
  });
  return r;
}
/*
最终转化为, 对象 or 数组
{
  [数据字段]: {
    key, // 字段名
    type, // 数据类型 input, boolean,
    name, // 名称
 }
}
*/
function nomalizeSchema (schema) {
  function fillNameAndType (v) {
    v = reduceObj(Object.keys(v).map(key => {
      var keyOne = v[key];
      if (!isPlainObject(keyOne)) {
        keyOne = {
          name: key,
          type: keyOne
        }
      }
      keyOne.key = key;
      if (!keyOne.name && !keyOne.type) {
        throw new Error('schema object struct need name and type');
      }
      return {
        [key]: keyOne,
      };
    }));
    return v;
  }

  schema = reduceObj(Object.keys(schema).map(k => {
    var v = schema[k].perperties
    if (isPlainObject(v)) {
      v = fillNameAndType(v);
    } else if (isArray(v)) {
      v = [fillNameAndType(v[0])]
    }

    return {
      [k]: Object.assign(schema[k], {
        perperties: v,
      }),
    };
  }))
  return schema;
}

function isShowKey (key) {
  return `isShow${key[0].toUpperCase() + key.substr(1)}`;
}

function initVm (schema) {
  const vm = new Vue({
    data () {
      return reduceObj(Object.keys(schema).map(key => {
        return {
          [key]: isArray(schema[key].perperties) ? [] : {},
          [isShowKey(key)]: (schema[key].isShow || function () { return true; }).bind(this),
        };
      }), {
        openProxy: false,
      });
    },
  });
  return vm;
}
function initVmData (vm, data) {
  Object.keys(data).forEach(k => {
    vm[k] = data[k];
  });
  return vm;
}

export default {
  setStorage (s) {
    if (!s) {
      throw new Error('a');
    }
    if (!s.init || !s.save) {
      throw new Error('b');
    }
    const initData = s.init();
    vmChangedCb = s.save;
    vm = initVm(schema);
    if (initData instanceof Promise) {
      initData.then(data => {
        vm = initVmData (vm, data);
      })
    } else {
      vm = initVmData (vm, initData);
    }
  },
  getStorage () {
    return {
      setData (type, v) {
        vm[type] = v;
      },
      newData (type) {
        const dataTemp = cloneDeep(schema[type][0]);

        const newData = reduceObj(Object.values(dataTemp).map(vObj => {
          return {
            [vObj.key]: typeDefaultValueMap(vObj.type),
          }
        }));

        vm[type] = vm[type].concat(newData);
      },
      getData (type) {
        const r = vm[type];
        if (r === undefined) {
          throw new Error(`${type} is not defined on Schema`);
        }
        if (type in schema) {
          Object.defineProperty(r, 'isShow', {
            enumerable: false,
            value: vm[isShowKey(type)](),
          });
        }
        console.log(isShowKey(type), r, r.isShow, vm[isShowKey(type)]);

        return r || {};
      },
      save () {
        vmChangedCb(vm.$data);
      },
    }
  },
  setSchema (s) {
    if (!schemaValidator(s)) {
      throw new Error('schema perperties has invalid "data type"');
    }
    schema = nomalizeSchema(s);

    console.log('schema:', schema);
  },
  getSchema (type) {
    if (!schema) {
      throw new Error('schema isnt initial');
    }
    return JSON.parse(JSON.stringify(type ? schema[type] : schema));
  },
};
