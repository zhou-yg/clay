import config from './config';

const UPDATE_CLAY_DATA = '@UPDATE_CLAY_DATA';

function typeDefaultValueMap (t) {
  const m = {
    input: '',
    date: '',
  };
  const v = m[t]
  return v === undefined ? null : v;
}

function reduceObj (arr) {
  return arr.reduce((pre, next) => Object.assign(pre, next), {});
}

export default function generateVuexModule () {

  const schema = config.getSchema();

  const state = reduceObj(Object.values(schema).map(obj => {
    return reduceObj(Object.keys(obj).map(name => {
      var type = obj[name];
      return {
        [name]: typeDefaultValueMap(type),
      }
    }));
  }));

  const module = {
    state,
    mutations: {
      [UPDATE_CLAY_DATA] (state, data) {
        Object.assign(state, data);
      }
    },
    actions: {
      updateClayData (store, obj) {
        store.commit(Object.assign({
          type: UPDATE_CLAY_DATA,
        }, obj));
      }
    }
  };

  return {
    clayModule: module,
  };
}
