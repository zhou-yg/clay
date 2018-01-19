import Proxy from './components/proxy.vue';

import m from './m';

export default {
  install (Vue) {
    Vue.component('clay-proxy', Proxy);
  },
  config ({schema, storage}) {
    m.setStorage(storage);

    Object.keys(schema).forEach(k => {
      var value = schema[k];
      if (!value.type) {
        value = {
          type: value,
        }
      }
      storage.setData(k, value);
    });
  }
}
