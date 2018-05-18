import Vue from 'vue';
import {cloneDeep, isPlainObject, isArray, pick} from 'lodash';
import { reduceObj, typeDefaultValueMap } from './utils';
var storage = null;
var schema = null;
var vm;

var vmChangedCb = () => {};

const validTypes = ['input', 'boolean', 'date', 'img', 'checkbox', 'radio', 'switch'];

function defualtValueByType (type) {
  const m = {
    'boolean': false,
    'switch': false,
    'checkbox': [],
  }
  return typeof m[type] ===  'undefined' ? '' : m[type];
}

function getScehmeDefault (schemeConfigOne) {
  console.log(`schemeConfigOne.properties:`, schemeConfigOne, schemeConfigOne.properties);
  const properties = cloneDeep(schemeConfigOne.properties);

  if (Array.isArray(properties)) {
    return [];
  } else {
    return reduceObj(Object.keys(properties).map(propName => {
      const t = properties[propName].type;
      return {
        [propName]: defualtValueByType(t),
      };
    }));
  }
}

function schemaValidator (schema) {
  var r = true;
  Object.values(schema).forEach(obj => {
    if (isArray(obj.properties)){
      obj.properties = obj.properties[0]
    }
    console.log(`obj.properties:`, obj.properties);
    let types = Object.values(obj.properties);
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
    properties: {
      objKey: {
        type, // 数据类型 input, boolean,
        name, // 名称
      }
    }
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
    var v = schema[k].properties
    if (isPlainObject(v)) {
      v = fillNameAndType(v);
    } else if (isArray(v)) {
      v = [fillNameAndType(v[0])]
    }

    return {
      [k]: Object.assign(schema[k], {
        properties: v,
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
          [key]: isArray(schema[key].properties) ? [] : {},
          [isShowKey(key)]: (schema[key].isShow || function () { return true; }).bind(this),
        };
      }), {
        openProxy: false,
      });
    },
  });
  return vm;
}
function initVmData (vm, data, mySchema) {
  const schemaKeys = Object.keys(mySchema);

  schemaKeys.forEach(k => {
    let v = data[k];
    if (typeof v === 'undefined') {
      console.log('schema key,', k);
      v = getScehmeDefault(mySchema[k]);
    }
    vm[k] = v;
  });
  //
  // Object.keys(data).forEach(k => {
  //   vm[k] = data[k];
  // });
  console.log(`initVmData:`, vm);
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
    var initData = s.init();
    function save(vmData) {

      const dataKeys = Object.keys(schema);

      const mySettingData = pick(vmData, dataKeys);

      // console.log(`mySettingData:`, mySettingData);

      Object.assign(initData, mySettingData);

      s.save(vmData, initData);
    };

    vmChangedCb = save;

    vm = initVm(schema);
    if (initData instanceof Promise) {
      initData.then(data => {
        initData = cloneDeep(data);
        vm = initVmData (vm, initData, schema);
        vmChangedCb = save;
      });
    } else {
      initData = cloneDeep(initData);
      vm = initVmData (vm, initData, schema);
    }
  },
  getStorage () {
    return {
      setData (type, v) {
        vm[type] = v;
      },
      newData (type) {
        const dataTemp = cloneDeep(schema[type].properties);

        const newData = reduceObj(Object.values(dataTemp).map(vObj => {
          return {
            [vObj.key]: typeDefaultValueMap(vObj.type),
          }
        }));

        vm[type] = vm[type].concat(newData);
      },
      delData (type, i) {
        vm[type].splice(i, 1);
      },
      upData (type, i) {
        let newData = cloneDeep(vm[type]);
        let pre = cloneDeep(newData[i - 1]);
        newData[i - 1] = cloneDeep(newData[i]);
        newData[i] = pre;
        vm[type] = newData;
      },
      downData (type, i) {
        let newData = cloneDeep(vm[type]);
        let pre = cloneDeep(newData[i]);
        newData[i] = cloneDeep(newData[i + 1]);
        newData[i + 1] = pre;
        vm[type] = newData;
      },
      getData (type) {
        const r = vm[type];
        if (r === undefined) {
          throw new Error(`${type} is not defined on Schema`);
        }
        const cloneR = cloneDeep(r);
        if (typeof cloneR === 'object') {
          if (type in schema) {
            Object.defineProperty(cloneR, 'isShow', {
              enumerable: false,
              value: vm[isShowKey(type)](),
            });
          }
        }
        // console.log(isShowKey(type), r, r.isShow, vm[isShowKey(type)]);

        return cloneR === undefined ? {} : cloneR;
      },
      save () {
        vmChangedCb(vm.$data);
      },
    }
  },
  setSchema (s) {
    if (!schemaValidator(s)) {
      throw new Error('schema properties has invalid "data type"');
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
