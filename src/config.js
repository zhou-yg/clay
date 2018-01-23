import Vue from 'vue';
import {cloneDeep, isPlainObject, isArray} from 'lodash';
import { reduceObj, typeDefaultValueMap } from './utils';
var storage = null;
var schema = null;
var vm = null;
var vmChangedCb = () => {};

function schemaValidator (schema) {
  var r = true;
  var validTypes = ['input', 'boolean'];
  Object.values(schema).forEach(obj => {
    if (isArray(obj)){
      obj = obj[0]
    }
    let types = Object.values(obj);
    r = r && types.every(t => {
      return validTypes.indexOf(t) !== -1 || validTypes.indexOf(t.type) !== -1;
    });
  });
  return r;
}
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
    var v = schema[k]
    if (isPlainObject(v)) {
      v = fillNameAndType(v);
    } else if (isArray(v)) {
      v = [fillNameAndType(v[0])]
    }

    return {
      [k]: v,
    };
  }))
  return schema;
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
    if (!s.init || !s.save) {
      throw new Error('b');
    }
    const initData = s.init();
    vmChangedCb = s.save;
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
        return vm[type];
      },
      save () {
        vmChangedCb(vm.$data);
      },
    }
  },
  setSchema (s) {
    if (!schemaValidator(s)) {
      throw new Error('schema is invalid');
    }
    schema = nomalizeSchema(s);

    console.log(schema);
  },
  getSchema (type) {
    if (!schema) {
      throw new Error('schema isnt initial');
    }
    return JSON.parse(JSON.stringify(type ? schema[type] : schema));
  },
};
