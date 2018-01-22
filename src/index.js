import Proxy from './components/Proxy.vue';
import generateVuexModule from './generateVuexModule';
import config from './config';

var isConfiged = false;

export default {
  install (Vue) {
    Vue.component('clay-proxy', Proxy);
  },
  config ({schema, storage}) {
    config.setStorage(storage);
    config.setSchema(schema);

    isConfiged = true;
  },
  clayState () {
    return generateVuexModule();
  },
}
