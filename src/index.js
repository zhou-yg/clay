import Proxy from './components/Proxy.vue';
import generateVuexModule from './generateVuexModule';
import config from './config';

var isConfiged = false;

export default {
  install (Vue) {
    Vue.component('clay-proxy', Proxy);
    Vue.filter('asArr', function (obj) {
      return Object.values(obj);
    });
  },
  config ({schema, storage}) {
    config.setSchema(schema);
    config.setStorage(storage);

    isConfiged = true;
  },
  clayState () {
    return generateVuexModule();
  },
}
