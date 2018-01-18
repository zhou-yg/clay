import Proxy from './components/proxy.vue';

import m from './m';

export default {
  install (Vue) {
    Vue.component('clay-proxy', Proxy);
  },
  config (map) {
    Object.keys(map).forEach(k => {
      m.set(k, map[k]);
    });
  }
}
